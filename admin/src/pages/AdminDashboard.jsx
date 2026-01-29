import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  FileText,
  Lock,
  AlertCircle,
  Download,
  Calendar,
  Eye,
  EyeOff,
  Trash2
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { API_BASE } from '../lib/api';
import adminLogo from '../public/assets/logo.jpg';

const AdminDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalReports: 0,
    reportsThisWeek: 0,
    reportsByType: [],
    reportsByUniversity: [],
    recentReports: []
  });
  const [loading, setLoading] = useState(false);
  const [editState, setEditState] = useState({});
  const [savingId, setSavingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [allReports, setAllReports] = useState([]);
  const [allReportsLoading, setAllReportsLoading] = useState(false);
  const [reportFilters, setReportFilters] = useState({ status: 'all', university: 'all' });
  const [email, setEmail] = useState('');
  const [authToken, setAuthToken] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [adminInfo, setAdminInfo] = useState(null);

  // Simple password check (in production, use proper authentication)
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setAuthLoading(true);
    try {
      const response = await fetch(`${API_BASE}/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!response.ok) {
        let message = 'Invalid email or password';
        try {
          const data = await response.json();
          if (data && typeof data.message === 'string') {
            message = data.message;
          }
        } catch {
        }
        setError(message);
        return;
      }

      const data = await response.json();
      setIsAuthenticated(true);
      setAuthToken(data.token || '');
      setAdminInfo(data.admin || null);
      setError('');
      await fetchStatistics(data.token || '');
    } catch (err) {
      console.error('Error logging in:', err);
      setError('Failed to login');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAuthToken('');
    setAdminInfo(null);
    setPassword('');
    setEmail('');
  };

  const fetchStatistics = async (tokenOverride) => {
    const tokenToUse = tokenOverride || authToken;
    if (!tokenToUse) {
      setError('Not authenticated');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/admin/stats`, {
        headers: {
          Authorization: `Bearer ${tokenToUse}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to load statistics');
      }

      const data = await response.json();

      setStats({
        totalReports: data.totalReports || 0,
        reportsThisWeek: data.reportsThisWeek || 0,
        reportsByType: data.reportsByType || [],
        reportsByUniversity: data.reportsByUniversity || [],
        recentReports: data.recentReports || [],
      });

      const initialEditState = {};
      (data.recentReports || []).forEach((report) => {
        initialEditState[report.id] = {
          status: report.status || 'new',
          adminNotes: report.adminNotes || '',
        };
      });
      setEditState(initialEditState);
    } catch (error) {
      console.error('Error fetching statistics:', error);
      setError('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllReports = async (tokenOverride) => {
    const tokenToUse = tokenOverride || authToken;
    if (!tokenToUse) {
      setError('Not authenticated');
      return;
    }
    setAllReportsLoading(true);
    try {
      const response = await fetch(`${API_BASE}/admin/reports`, {
        headers: {
          Authorization: `Bearer ${tokenToUse}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to load reports');
      }
      const data = await response.json();
      setAllReports(data.reports || []);
    } catch (err) {
      console.error('Error fetching reports:', err);
      setError('Failed to load reports');
    } finally {
      setAllReportsLoading(false);
    }
  };

  const handleStatusChange = (reportId, value) => {
    setEditState((prev) => ({
      ...prev,
      [reportId]: {
        ...(prev[reportId] || {}),
        status: value,
      },
    }));
  };

  const handleNotesChange = (reportId, value) => {
    setEditState((prev) => ({
      ...prev,
      [reportId]: {
        ...(prev[reportId] || {}),
        adminNotes: value,
      },
    }));
  };

  const handleSaveReport = async (reportId) => {
    const current = editState[reportId];
    if (!current) return;
    setSavingId(reportId);
    setError('');
    try {
      const response = await fetch(`${API_BASE}/reports/${reportId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
        body: JSON.stringify({
          status: current.status,
          adminNotes: current.adminNotes,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update report');
      }

      await fetchStatistics();
    } catch (err) {
      console.error('Error updating report:', err);
      setError('Failed to update report');
    } finally {
      setSavingId(null);
    }
  };

  const handleDeleteReport = async (reportId) => {
    if (!authToken) {
      setError('Not authenticated');
      return;
    }

    const confirmed = window.confirm(
      'Are you sure you want to permanently delete this report? This action cannot be undone.'
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(reportId);
    setError('');

    try {
      const response = await fetch(`${API_BASE}/reports/${reportId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok && response.status !== 204) {
        throw new Error('Failed to delete report');
      }

      await fetchStatistics();
      await fetchAllReports();
    } catch (err) {
      console.error('Error deleting report:', err);
      setError('Failed to delete report');
    } finally {
      setDeletingId(null);
    }
  };

  const exportData = () => {
    const dataStr = JSON.stringify(stats, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `safecampus-report-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const exportAllReports = async () => {
    try {
      if (!allReports.length) {
        await fetchAllReports();
      }
      const dataStr = JSON.stringify(allReports, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
      const exportFileDefaultName = `safecampus-all-reports-${new Date().toISOString().split('T')[0]}.json`;
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    } catch (err) {
      console.error('Error exporting reports:', err);
      setError('Failed to export reports');
    }
  };

  const filteredReports = allReports.filter((report) => {
    const statusOk =
      reportFilters.status === 'all' || (report.status || 'new') === reportFilters.status;
    const universityValue = report.university || 'not_specified';
    const universityOk =
      reportFilters.university === 'all' || universityValue === reportFilters.university;
    return statusOk && universityOk;
  });

  const COLORS = ['#9333ea', '#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  useEffect(() => {
    if (isAuthenticated && authToken) {
      fetchAllReports();
    }
  }, [isAuthenticated, authToken]);

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto mt-16">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Lock className="h-12 w-12 text-purple-600" />
            </div>
            <CardTitle>Admin Access Required</CardTitle>
            <CardDescription>
              Please enter the admin password to view the dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter admin email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter admin password"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              {error && (
                <div className="text-red-600 text-sm flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {error}
                </div>
              )}
              <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={authLoading}>
                {authLoading ? 'Signing in...' : 'Access Dashboard'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img src={adminLogo} alt="SafeCampus KE logo" className="h-19 w-19 object-contain rounded" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">Aggregated statistics and insights</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={exportData} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Button onClick={exportAllReports} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export All Reports
          </Button>
          <Button onClick={handleLogout} variant="ghost">
            Logout
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
              <FileText className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalReports}</div>
            <p className="text-xs text-gray-600 mt-1">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">This Week</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.reportsThisWeek}</div>
            <p className="text-xs text-gray-600 mt-1">Last 7 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Incident Types</CardTitle>
              <BarChart3 className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.reportsByType.length}</div>
            <p className="text-xs text-gray-600 mt-1">Categories tracked</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Universities</CardTitle>
              <Users className="h-4 w-4 text-pink-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.reportsByUniversity.length}</div>
            <p className="text-xs text-gray-600 mt-1">Institutions reporting</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Reports by Type */}
        <Card>
          <CardHeader>
            <CardTitle>Reports by Type</CardTitle>
            <CardDescription>Distribution of incident types</CardDescription>
          </CardHeader>
          <CardContent>
            {stats.reportsByType.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.reportsByType}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#9333ea" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                No data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Reports by University */}
        <Card>
          <CardHeader>
            <CardTitle>Reports by University</CardTitle>
            <CardDescription>Geographic distribution</CardDescription>
          </CardHeader>
          <CardContent>
            {stats.reportsByUniversity.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={stats.reportsByUniversity}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name}: ${entry.value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {stats.reportsByUniversity.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                No data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Reports Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest reports (anonymized)</CardDescription>
        </CardHeader>
        <CardContent>
          {stats.recentReports.length > 0 ? (
            <div className="space-y-4">
              {stats.recentReports.map((report, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-purple-100 rounded">
                      <FileText className="h-4 w-4 text-purple-600" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium capitalize">
                        {report.type?.replace('-', ' ') || 'Unknown Type'}
                      </p>
                      <p className="text-sm text-gray-600">
                        {report.university ? report.university.toUpperCase() : 'University not specified'}
                      </p>
                      {report.platform && (
                        <p className="text-xs text-gray-500">
                          Platform: {report.platform}
                        </p>
                      )}
                      {report.description && (
                        <p className="text-sm text-gray-700 mt-1">
                          {report.description.length > 160
                            ? `${report.description.slice(0, 160)}...`
                            : report.description}
                        </p>
                      )}
                      {(() => {
                        const evidenceArray =
                          Array.isArray(report.evidenceUrls) && report.evidenceUrls.length > 0
                            ? report.evidenceUrls
                            : (report.evidenceUrl ? [report.evidenceUrl] : []);

                        if (!evidenceArray.length) return null;

                        if (evidenceArray.length === 1) {
                          return (
                            <a
                              href={evidenceArray[0]}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-purple-600 hover:underline"
                            >
                              View evidence
                            </a>
                          );
                        }

                        return (
                          <div className="flex flex-wrap gap-2 text-xs mt-1">
                            {evidenceArray.map((url, idx) => (
                              <a
                                key={idx}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-purple-600 hover:underline"
                              >
                                Evidence {idx + 1}
                              </a>
                            ))}
                          </div>
                        );
                      })()}
                      {(report.suspectName || report.suspectUsername || report.suspectContact) && (
                        <div className="mt-1 text-xs text-gray-600 space-y-0.5">
                          {report.suspectName && <p>Suspect name: {report.suspectName}</p>}
                          {report.suspectUsername && <p>Suspect username: {report.suspectUsername}</p>}
                          {report.suspectContact && <p>Suspect contact: {report.suspectContact}</p>}
                        </div>
                      )}
                      {(report.incidentDate || report.incidentLocation || report.witnesses || report.victimContact) && (
                        <div className="mt-1 text-xs text-gray-600 space-y-0.5">
                          {report.incidentDate && <p>Date: {report.incidentDate}</p>}
                          {report.incidentLocation && <p>Where: {report.incidentLocation}</p>}
                          {report.witnesses && <p>Witnesses: {report.witnesses.length > 120 ? `${report.witnesses.slice(0, 120)}...` : report.witnesses}</p>}
                          {report.victimContact && <p>Survivor contact: {report.victimContact}</p>}
                        </div>
                      )}
                      <div className="mt-2 space-y-2">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 space-y-1 sm:space-y-0">
                          <span className="text-xs text-gray-500">Status</span>
                          <select
                            className="border rounded px-2 py-1 text-xs text-gray-700 bg-white"
                            value={editState[report.id]?.status || report.status || 'new'}
                            onChange={(e) => handleStatusChange(report.id, e.target.value)}
                          >
                            <option value="new">New</option>
                            <option value="in_progress">In Progress</option>
                            <option value="resolved">Resolved</option>
                          </select>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Admin notes</p>
                          <textarea
                            className="w-full border rounded px-2 py-1 text-xs text-gray-700 bg-white resize-y min-h-[48px]"
                            value={editState[report.id]?.adminNotes ?? ''}
                            onChange={(e) => handleNotesChange(report.id, e.target.value)}
                          />
                        </div>
                        <div className="pt-1 flex flex-wrap gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleSaveReport(report.id)}
                            disabled={savingId === report.id}
                          >
                            {savingId === report.id ? 'Saving...' : 'Save'}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 border-red-300 hover:bg-red-50"
                            onClick={() => handleDeleteReport(report.id)}
                            disabled={deletingId === report.id}
                          >
                            {deletingId === report.id ? (
                              'Deleting...'
                            ) : (
                              <>
                                <Trash2 className="h-3 w-3 mr-1" />
                                Delete
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right text-sm text-gray-600">
                    {(() => {
                      const date = report.timestamp ? new Date(report.timestamp) : null;
                      return date && !Number.isNaN(date.getTime())
                        ? date.toLocaleDateString()
                        : 'Date unknown';
                    })()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No reports yet</p>
          )}
        </CardContent>
      </Card>

      {/* Privacy Notice */}
      <div className="bg-purple-50 p-4 rounded-lg">
        <div className="flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-purple-600 mt-0.5" />
          <div className="text-sm text-purple-900">
            <p className="font-medium mb-1">Privacy & Security Notice</p>
            <p>All data shown is aggregated and anonymized. Individual reporter identities are never stored or displayed.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
