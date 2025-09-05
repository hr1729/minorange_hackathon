import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "../components/shadcn/Card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { format, subDays } from 'date-fns';

const generateTimelineData = () => {
  return Array.from({ length: 30 }, (_, i) => ({
    date: format(subDays(new Date(), 29 - i), 'MMM dd'),
    scans: Math.floor(Math.random() * 50) + 10,
    issues: Math.floor(Math.random() * 30),
    fixed: Math.floor(Math.random() * 20),
  }));
};

const issueTypes = [
  { name: 'SQL Injection', value: 25 },
  { name: 'XSS', value: 35 },
  { name: 'CSRF', value: 15 },
  { name: 'Auth Issues', value: 20 },
  { name: 'Other', value: 5 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const Analytics = () => {
  const timelineData = generateTimelineData();

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Security Analytics</h1>

      {/* Timeline Chart */}
      <Card>
        <CardHeader>
          <CardTitle>30-Day Security Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="scans"
                  stroke="#2563eb"
                  name="Scans"
                />
                <Line
                  type="monotone"
                  dataKey="issues"
                  stroke="#dc2626"
                  name="Issues"
                />
                <Line
                  type="monotone"
                  dataKey="fixed"
                  stroke="#16a34a"
                  name="Fixed"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Issue Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Issue Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={issueTypes}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {issueTypes.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Summary Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Key Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <span className="font-medium">Average Issues per Scan</span>
                <span className="text-lg font-bold">4.2</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <span className="font-medium">Resolution Rate</span>
                <span className="text-lg font-bold text-green-600">78%</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <span className="font-medium">Critical Issues</span>
                <span className="text-lg font-bold text-red-600">12</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <span className="font-medium">Total Scans</span>
                <span className="text-lg font-bold">1,234</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
