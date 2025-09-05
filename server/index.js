import express from 'express';
import path from 'path';
import os from 'os';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import simpleGit from 'simple-git';
import axios from 'axios';
import sonarqubeScanner from 'sonarqube-scanner';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '1mb' }));

const PORT = process.env.PORT || 4000;

function base64(input) {
  return Buffer.from(input, 'utf8').toString('base64');
}

function sonarAxios({ hostUrl, token }) {
  const authHeader = `Basic ${base64(`${token}:`)}`;
  return axios.create({
    baseURL: hostUrl,
    headers: { Authorization: authHeader },
    timeout: 30000,
    validateStatus: () => true,
  });
}

function runSonarScanner({ serverUrl, token, projectKey, projectName, sourcesDir }) {
  return new Promise((resolve, reject) => {
    sonarqubeScanner(
      {
        serverUrl,
        token,
        options: {
          'sonar.projectKey': projectKey,
          'sonar.projectName': projectName || projectKey,
          'sonar.sources': sourcesDir,
          'sonar.exclusions': 'node_modules/**,**/*.test.*,tests/**,**/*.spec.*',
        },
      },
      (result) => {
        if (result) {
          return resolve(result);
        }
        resolve(undefined);
      }
    );
  });
}

async function runSonarScannerInChild({ serverUrl, token, projectKey, projectName, sourcesDir }) {
  const runnerPath = path.join(os.tmpdir(), `sonar-runner-${Date.now()}.cjs`);
  const content = `
const { createRequire } = require('module');
const path = require('path');
const projectRoot = process.env.PROJECT_ROOT;
const requireFromProject = createRequire(path.join(projectRoot, 'package.json'));
const scanner = requireFromProject('sonarqube-scanner');
scanner({
  serverUrl: process.env.SONAR_URL,
  token: process.env.SONAR_TOKEN,
  options: {
    'sonar.projectKey': process.env.SONAR_KEY,
    'sonar.projectName': process.env.SONAR_NAME,
    'sonar.projectBaseDir': process.env.SONAR_BASEDIR,
    'sonar.sources': '.',
    'sonar.inclusions': '**/*.js,**/*.jsx,**/*.ts,**/*.tsx',
    'sonar.exclusions': 'node_modules/**,**/*.test.*,tests/**,**/*.spec.*',
    ...(process.env.SONAR_TSCONFIG ? { 'sonar.typescript.tsconfigPath': process.env.SONAR_TSCONFIG } : {})
  }
}, () => {
  process.exit(0);
});
`;
  await fs.writeFile(runnerPath, content, 'utf8');
  try {
    await new Promise((resolve, reject) => {
      const child = spawn(process.execPath, [runnerPath], {
        env: {
          ...process.env,
          PROJECT_ROOT: path.join(__dirname, '..'),
          SONAR_URL: serverUrl,
          SONAR_TOKEN: token,
          SONAR_KEY: projectKey,
          SONAR_NAME: projectName,
          SONAR_BASEDIR: sourcesDir,
          ...(process.env.SONAR_TSCONFIG ? { SONAR_TSCONFIG: process.env.SONAR_TSCONFIG } : {})
        },
        stdio: 'inherit',
      });
      child.on('exit', (code) => {
        if (code === 0) return resolve();
        reject(new Error(`Sonar scanner child exited with code ${code}`));
      });
      child.on('error', reject);
    });
  } finally {
    try { await fs.rm(runnerPath, { force: true }); } catch {}
  }
}

async function fetchSonarResults({ hostUrl, token, projectKey, maxWaitMs = 60000 }) {
  const axiosClient = sonarAxios({ hostUrl, token });
  const start = Date.now();

  async function tryFetch() {
    // Fetch measures
    const measuresRes = await axiosClient.get('/api/measures/component', {
      params: {
        component: projectKey,
        metricKeys: 'bugs,vulnerabilities,code_smells,security_hotspots',
      },
    });

    // Fetch issues
    const issuesRes = await axiosClient.get('/api/issues/search', {
      params: {
        componentKeys: projectKey,
        ps: 100,
        s: 'SEVERITY',
        facets: 'severities,types',
      },
    });

    if (measuresRes.status === 200 && issuesRes.status === 200) {
      return {
        measures: measuresRes.data,
        issues: issuesRes.data,
      };
    }
    return null;
  }

  while (Date.now() - start < maxWaitMs) {
    try {
      const data = await tryFetch();
      if (data) return data;
    } catch {}
    await new Promise((r) => setTimeout(r, 3000));
  }
  // One last attempt; return whatever we get (may include errors)
  const axiosClientLast = sonarAxios({ hostUrl, token });
  const measuresRes = await axiosClientLast.get('/api/measures/component', {
    params: {
      component: projectKey,
      metricKeys: 'bugs,vulnerabilities,code_smells,security_hotspots',
    },
  });
  const issuesRes = await axiosClientLast.get('/api/issues/search', {
    params: {
      componentKeys: projectKey,
      ps: 100,
      s: 'SEVERITY',
      facets: 'severities,types',
    },
  });
  return {
    measures: measuresRes.data,
    issues: issuesRes.data,
  };
}

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

app.post('/api/sonar/scan', async (req, res) => {
  const { repoUrl} = req.body || {};
    const hostUrl= 'http://localhost:9000';
    const token  = 'squ_51088d4005de03191d2d591d14db1bef1bb809ba';

  const repoName = repoUrl.split('/').pop().replace(/\.git$/, '') || 'project';
  const key = repoName.toLowerCase().replace(/[^a-z0-9-_\.]/g, '-');

  const tempBase = await fs.mkdtemp(path.join(os.tmpdir(), 'sonar-scan-'));
  const repoDir = path.join(tempBase, 'repo');

  try {
    console.log('repoUrl', repoUrl);
    const git = simpleGit();
    await git.clone(repoUrl, repoDir);

    // set tsconfig if present for better TypeScript analysis
    const tsconfigPath = path.join(repoDir, 'tsconfig.json');
    try { await fs.access(tsconfigPath); process.env.SONAR_TSCONFIG = tsconfigPath; } catch {}

    await runSonarScannerInChild({
      serverUrl: hostUrl,
      token,
      projectKey: key,
      projectName: repoName,
      sourcesDir: repoDir,
    });

    const results = await fetchSonarResults({ hostUrl, token, projectKey: key, maxWaitMs: 180000 });
    res.json({ success: true, results });
  } catch (e) {
    res.status(500).json({ success: false, error: e?.message || 'Scan failed' });
  } finally {
    try { await fs.rm(tempBase, { recursive: true, force: true }); } catch {}
  }
});

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});


