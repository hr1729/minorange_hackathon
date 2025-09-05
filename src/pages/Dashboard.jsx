import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "../components/shadcn/Card";
import { Button } from "../components/shadcn/Button";
import { Input } from "../components/shadcn/Input";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import JSZip from 'jszip';

const severityColors = {
  HIGH: 'bg-red-100 text-red-800',
  MEDIUM: 'bg-yellow-100 text-yellow-800',
  LOW: 'bg-green-100 text-green-800',
};

const columnHelper = createColumnHelper();

const columns = [
  columnHelper.accessor('issue', {
    header: 'Issue',
    cell: (info) => (
      <div>
        <div className="font-medium">{info.getValue()}</div>
        <div className="text-sm text-gray-500">{info.row.original.description}</div>
      </div>
    ),
  }),
  columnHelper.accessor('severity', {
    header: 'Severity',
    cell: (info) => (
      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${severityColors[info.getValue()]}`}>
        {info.getValue()}
      </span>
    ),
  }),
  columnHelper.accessor('location', {
    header: 'Location',
  }),
  columnHelper.accessor('fix', {
    header: 'Suggested Fix',
  }),
];

const Dashboard = () => {
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState('');
  const [scanning, setScanning] = useState(false);
  const [results, setResults] = useState([]);

  const table = useReactTable({
    data: results,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const handleFileUpload = async (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      // Read ZIP file contents
      const zip = new JSZip();
      await zip.loadAsync(uploadedFile);
      console.log('ZIP contents:', Object.keys(zip.files));
    }
  };

  const handleUrlSubmit = (event) => {
    event.preventDefault();
    if (url) {
      startScan();
    }
  };

  const startScan = async () => {
    setScanning(true);
    // Mock scan delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock results
    setResults([
      {
        id: 1,
        issue: 'Hardcoded API Key',
        severity: 'HIGH',
        location: 'src/config.js:15',
        description: 'Found hardcoded API key in configuration file',
        fix: 'Move API key to environment variables',
      },
      {
        id: 2,
        issue: 'Insecure Cookie Settings',
        severity: 'MEDIUM',
        location: 'src/auth/session.js:45',
        description: 'Cookie missing secure and httpOnly flags',
        fix: 'Add secure and httpOnly flags to cookie configuration',
      },
    ]);
    setScanning(false);
  };

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Plugin Security Scanner</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Upload Plugin (ZIP)
              </label>
              <Input
                type="file"
                accept=".zip"
                onChange={handleFileUpload}
                className="w-full"
              />
            </div>

            {/* URL Input */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Or Enter Repository URL
              </label>
              <form onSubmit={handleUrlSubmit} className="flex gap-2">
                <Input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://github.com/user/repo"
                  className="flex-1"
                />
                <Button type="submit" disabled={scanning}>
                  {scanning ? 'Scanning...' : 'Scan'}
                </Button>
              </form>
            </div>

            {/* Results Table */}
            {results.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Security Issues Found</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                          {headerGroup.headers.map(header => (
                            <th
                              key={header.id}
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              onClick={header.column.getToggleSortingHandler()}
                            >
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                            </th>
                          ))}
                        </tr>
                      ))}
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {table.getRowModel().rows.map(row => (
                        <tr key={row.id}>
                          {row.getVisibleCells().map(cell => (
                            <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;