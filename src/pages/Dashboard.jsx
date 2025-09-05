import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "../components/shadcn/Card";
import { Button } from "../components/shadcn/Button";
import { Input } from "../components/shadcn/Input";
import { Shield, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import * as Tabs from '@radix-ui/react-tabs';
import { format } from 'date-fns';
import { useNotifications } from '../components/notifications/NotificationProvider';

const mockChartData = Array.from({ length: 7 }, (_, i) => ({
  date: format(new Date(Date.now() - i * 24 * 60 * 60 * 1000), 'MMM dd'),
  scans: Math.floor(Math.random() * 50) + 10,
  issues: Math.floor(Math.random() * 30),
})).reverse();

const severityData = [
  { name: 'High', value: 12 },
  { name: 'Medium', value: 24 },
  { name: 'Low', value: 36 },
];

const Dashboard = () => {
  const [scanning, setScanning] = useState(false);
  const [repoUrl, setRepoUrl] = useState('');
  const [scanResults, setScanResults] = useState(null);
  const { addNotification } = useNotifications();
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    {
      title: 'Total Scans',
      value: '1,234',
      icon: Shield,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Critical Issues',
      value: '23',
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
    {
      title: 'Resolved',
      value: '789',
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Pending',
      value: '45',
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  const handleScan = async () => {
    if (!repoUrl) {
      addNotification({ title: 'Missing URL', message: 'Please enter a repository URL.' });
      return;
    }
    setScanning(true);
    setScanResults(null);
    try {
      const res = await fetch('/api/sonar/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repoUrl }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data?.error || 'Scan failed');
      }
      setScanResults(data.results);
      addNotification({ title: 'Scan Complete', message: 'SonarQube scan completed.' });
    } catch (e) {
      addNotification({ title: 'Scan Failed', message: String(e.message || e) });
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.title}</p>
                  <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
        <Tabs.List className="flex space-x-2 border-b mb-6">
          <Tabs.Trigger
            value="overview"
            className={`px-4 py-2 -mb-px ${
              activeTab === 'overview'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-500'
            }`}
          >
            Overview
          </Tabs.Trigger>
          <Tabs.Trigger
            value="scan"
            className={`px-4 py-2 -mb-px ${
              activeTab === 'scan'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-500'
            }`}
          >
            New Scan
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Activity Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Scan Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={mockChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="scans"
                        stroke="#2563eb"
                        fill="#93c5fd"
                      />
                      <Area
                        type="monotone"
                        dataKey="issues"
                        stroke="#dc2626"
                        fill="#fca5a5"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Severity Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Issue Severity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={severityData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </Tabs.Content>

        <Tabs.Content value="scan">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Upload Plugin (ZIP)
                  </label>
                  <Input type="file" accept=".zip" className="w-full" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Or Enter Repository URL
                  </label>
                  <div className="flex gap-2">
                    <Input
                      type="url"
                      placeholder="https://github.com/user/repo"
                      className="flex-1"
                      value={repoUrl}
                      onChange={(e) => setRepoUrl(e.target.value)}
                    />
                    <Button onClick={handleScan} disabled={scanning}>
                      {scanning ? 'Scanning...' : 'Start Scan'}
                    </Button>
                  </div>
                </div>
                {scanResults && (
                  <div className="pt-4">
                    <h3 className="text-lg font-semibold mb-2">Security Issues Found</h3>
                    <pre className="bg-gray-50 border rounded p-3 max-h-64 overflow-auto text-sm">
                      {JSON.stringify(
                        {
                          measures: scanResults?.measures?.component?.measures,
                          totalIssues: scanResults?.issues?.total,
                          facets: scanResults?.issues?.facets,
                        },
                        null,
                        2
                      )}
                    </pre>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
};

export default Dashboard;