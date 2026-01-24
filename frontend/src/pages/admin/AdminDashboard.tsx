import { useEffect, useState, useMemo } from 'react';
import { adminService, AdminStats, User, Analytics } from '../../services/adminService';
import { Skeleton } from '../../components/common/Skeleton';
import Button from '../../components/ui/button/Button';
import { TrashBinIcon, UserIcon, TaskIcon, CheckCircleIcon, DollarLineIcon, PencilIcon, AngleLeftIcon, AngleRightIcon, ChatIcon } from '../../icons';
import { formatIndonesianDate } from '../../utils/date';
import { formatCurrency } from '../../utils/currency';
import ConfirmDeleteModal from '../../components/common/ConfirmDeleteModal';
import PageMeta from '../../components/common/PageMeta';

interface ActiveUser {
  user: User;
  sessions: Array<{
    ip_address: string;
    location: string | null;
    latitude: number | null;
    longitude: number | null;
    user_agent: string;
    last_activity: string;
  }>;
  total_sessions: number;
  last_activity: string;
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; user: User | null }>({ open: false, user: null });
  const [editModal, setEditModal] = useState<{ open: boolean; user: User | null }>({ open: false, user: null });
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editIsAdmin, setEditIsAdmin] = useState(false);
  const [editStorageLimit, setEditStorageLimit] = useState<number>(50); // In MB
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([]);
  const [showActiveUsers, setShowActiveUsers] = useState(false);
  const [sortField] = useState<'name' | 'email' | 'created_at' | null>(null);
  const [sortDirection] = useState<'asc' | 'desc'>('asc');
  const [total, setTotal] = useState(0);
  const [perPage, setPerPage] = useState(15);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [feedbackPage, setFeedbackPage] = useState(1);
  const [feedbackPerPage, setFeedbackPerPage] = useState(10);
  const [feedbackTotalPages, setFeedbackTotalPages] = useState(1);
  const [feedbackTotal, setFeedbackTotal] = useState(0);
  const [deleteFeedbackModal, setDeleteFeedbackModal] = useState<{ open: boolean; id: number | null }>({ open: false, id: null });
  const [deletingFeedback, setDeletingFeedback] = useState(false);
  const [activeTab, setActiveTab] = useState<'users' | 'feedbacks'>('users');

  const loadFeedbacks = async (page: number = 1, currentPerPage: number = feedbackPerPage) => {
    try {
      const data = await adminService.getFeedbacks(page, currentPerPage);
      setFeedbacks(data.data);
      setFeedbackPage(data.current_page);
      setFeedbackTotalPages(data.last_page);
      setFeedbackTotal(data.total);
    } catch (error) {
      console.error('Error loading feedbacks:', error);
    }
  };

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const [statsData, usersData, analyticsData, activeUsersData, feedbackData] = await Promise.all([
        adminService.getDashboard(),
        adminService.getUsers(1, search, perPage),
        adminService.getAnalytics(),
        adminService.getActiveUsers().catch(() => ({ active_users: [], total: 0 })),
        adminService.getFeedbacks(1, feedbackPerPage),
      ]);
      setStats(statsData);
      setUsers(usersData.data);
      setCurrentPage(usersData.current_page);
      setTotalPages(usersData.last_page);
      setTotal(usersData.total);
      setAnalytics(analyticsData);
      setActiveUsers(activeUsersData.active_users || []);

      setFeedbacks(feedbackData.data);
      setFeedbackPage(feedbackData.current_page);
      setFeedbackTotalPages(feedbackData.last_page);
      setFeedbackTotal(feedbackData.total);
    } catch (error) {
      console.error('Error loading admin dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
    const interval = setInterval(() => {
      adminService.getActiveUsers()
        .then((data) => setActiveUsers(data.active_users || []))
        .catch(() => { });
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = async () => {
    try {
      setCurrentPage(1);
      const usersData = await adminService.getUsers(1, search, perPage);
      setUsers(usersData.data);
      setCurrentPage(usersData.current_page);
      setTotalPages(usersData.last_page);
      setTotal(usersData.total);
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  const handlePerPageChange = async (newPerPage: number) => {
    setPerPage(newPerPage);
    setCurrentPage(1);
    try {
      const usersData = await adminService.getUsers(1, search, newPerPage);
      setUsers(usersData.data);
      setCurrentPage(usersData.current_page);
      setTotalPages(usersData.last_page);
      setTotal(usersData.total);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const handleFeedbackPerPageChange = async (newPerPage: number) => {
    setFeedbackPerPage(newPerPage);
    setFeedbackPage(1);
    await loadFeedbacks(1, newPerPage);
  };



  const loadPage = async (page: number) => {
    try {
      const usersData = await adminService.getUsers(page, search, perPage);
      setUsers(usersData.data);
      setCurrentPage(usersData.current_page);
      setTotalPages(usersData.last_page);
      setTotal(usersData.total);
    } catch (error) {
      console.error('Error loading page:', error);
    }
  };



  const sortedUsers = [...users].sort((a, b) => {
    if (!sortField) return 0;
    let aVal: any = a[sortField];
    let bVal: any = b[sortField];
    if (sortField === 'created_at') {
      aVal = new Date(aVal).getTime();
      bVal = new Date(bVal).getTime();
    } else {
      aVal = String(aVal).toLowerCase();
      bVal = String(bVal).toLowerCase();
    }
    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });


  const handleEdit = (user: User) => {
    setEditModal({ open: true, user });
    setEditName(user.name);
    setEditEmail(user.email);
    setEditPassword('');
    setEditIsAdmin(user.is_admin || false);
    setEditStorageLimit(user.storage_limit ? Math.round(user.storage_limit / 1024 / 1024) : 50);
  };

  const handleSaveEdit = async () => {
    if (!editModal.user) return;
    try {
      setSaving(true);
      await adminService.updateUser(editModal.user.id, {
        name: editName,
        email: editEmail,
        is_admin: editIsAdmin,
        storage_limit: editStorageLimit * 1024 * 1024, // Convert MB to bytes
        ...(editPassword && { password: editPassword })
      });
      setEditModal({ open: false, user: null });
      await loadDashboard();
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Failed to update user');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.user) return;
    try {
      setDeleting(true);
      await adminService.deleteUser(deleteModal.user.id);
      setDeleteModal({ open: false, user: null });
      await loadDashboard();
    } catch (error) {
      console.error('Error deleting user:', error);
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteFeedback = async () => {
    if (!deleteFeedbackModal.id) return;
    try {
      setDeletingFeedback(true);
      await adminService.deleteFeedback(deleteFeedbackModal.id);
      setDeleteFeedbackModal({ open: false, id: null });
      await loadFeedbacks(feedbackPage);
    } catch (error) {
      console.error('Error deleting feedback:', error);
    } finally {
      setDeletingFeedback(false);
    }
  };



  if (loading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-32 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageMeta
        title="Admin Dashboard - 26-step"
        description="Manage and analyze users and platform data"
      />
      {/* Header & Tabs */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">Manage and analyze users and platform data</p>
        </div>
        <div className="flex rounded-xl bg-gray-100 p-1 dark:bg-gray-800">
          <button onClick={() => setActiveTab('users')} className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${activeTab === 'users' ? 'bg-white text-indigo-600 shadow-sm dark:bg-gray-700 dark:text-indigo-400' : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'}`}><UserIcon className="h-4 w-4" /> Users</button>
          <button onClick={() => setActiveTab('feedbacks')} className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${activeTab === 'feedbacks' ? 'bg-white text-indigo-600 shadow-sm dark:bg-gray-700 dark:text-indigo-400' : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'}`}><ChatIcon className="h-4 w-4" /> Feedbacks {feedbackTotal > 0 && <span className="ml-1 inline-flex items-center justify-center rounded-full bg-indigo-100 px-1.5 py-0.5 text-[10px] font-bold text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">{feedbackTotal}</span>}</button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6 dark:border-blue-800 dark:bg-blue-950/30">
          <div className="flex items-center justify-between mb-2"><UserIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" /><span className="text-xs text-blue-600">Total Users</span></div>
          <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">{stats?.users.total || 0}</p>
          <p className="mt-1 text-xs text-blue-600">{stats?.users.new_this_month || 0} new this month</p>
        </div>
        <div className="rounded-2xl border border-green-200 bg-green-50 p-6 dark:border-green-800 dark:bg-green-950/30">
          <div className="flex items-center justify-between mb-2"><TaskIcon className="h-6 w-6 text-green-600 dark:text-green-400" /><span className="text-xs text-green-600">Total Tasks</span></div>
          <p className="text-3xl font-bold text-green-900 dark:text-green-100">{stats?.tasks.total || 0}</p>
          <p className="mt-1 text-xs text-green-600">{stats?.tasks.completed || 0} completed</p>
        </div>
        <div className="rounded-2xl border border-purple-200 bg-purple-50 p-6 dark:border-purple-800 dark:bg-purple-950/30">
          <div className="flex items-center justify-between mb-2"><CheckCircleIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" /><span className="text-xs text-purple-600">Total Habits</span></div>
          <p className="text-3xl font-bold text-purple-900 dark:text-purple-100">{stats?.habits.total || 0}</p>
          <p className="mt-1 text-xs text-purple-600">{stats?.habits.active || 0} active</p>
        </div>
        <div className="rounded-2xl border border-orange-200 bg-orange-50 p-6 dark:border-orange-800 dark:bg-orange-950/30">
          <div className="flex items-center justify-between mb-2"><DollarLineIcon className="h-6 w-6 text-orange-600 dark:text-orange-400" /><span className="text-xs text-orange-600">Transactions</span></div>
          <p className="text-3xl font-bold text-orange-900 dark:text-orange-100">{stats?.transactions.total || 0}</p>
          <p className="mt-1 text-xs text-orange-600">{formatCurrency(stats?.transactions.income || 0, true)} income</p>
        </div>
      </div>

      {/* Active Users Section */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
        <div className="mb-4 flex items-center justify-between">
          <div><h2 className="text-xl font-bold text-gray-900 dark:text-white">Active Users ({activeUsers.length})</h2><p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Recent user activity</p></div>
          <Button onClick={() => setShowActiveUsers(!showActiveUsers)} size="sm" variant="outline">{showActiveUsers ? 'Hide' : 'Show'}</Button>
        </div>
        {showActiveUsers && (
          <div className="space-y-4">
            {activeUsers.length === 0 ? <p className="text-center text-gray-500 py-8">No active users</p> : activeUsers.map((activeUser) => (
              <div key={activeUser.user.id} className="rounded-lg border border-gray-200 bg-gray-50 p-5 dark:border-gray-700 dark:bg-gray-700/50">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-purple-500 text-white font-semibold text-sm">{activeUser.user.name?.charAt(0).toUpperCase() || 'U'}</div>
                    <div><p className="font-semibold text-gray-900 dark:text-white">{activeUser.user.name}</p><p className="text-sm text-gray-600 dark:text-gray-400">{activeUser.user.email}</p></div>
                  </div>
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">{activeUser.total_sessions} sessions</span>
                </div>
                <div className="space-y-2">
                  {activeUser.sessions.map((session, idx) => (
                    <div key={idx} className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-2">
                      <span>IP: {session.ip_address}</span> | <span>Active: {formatIndonesianDate(session.last_activity)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {activeTab === 'users' ? (
        <div className="rounded-2xl border border-gray-200 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-800">
          <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-700 dark:bg-gray-800">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div><h2 className="text-xl font-bold text-gray-900 dark:text-white">Users Management</h2><p className="text-sm text-gray-600">Total {total} users</p></div>
              <div className="flex gap-3">
                <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSearch()} className="rounded-lg border border-gray-300 px-3 py-2 text-sm dark:bg-gray-700 dark:text-white" />
                <Button onClick={handleSearch} size="sm">Search</Button>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr className="text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Joined</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {sortedUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">{user.name.charAt(0)}</div>
                        <div><div className="font-medium text-gray-900 dark:text-white">{user.name}</div><div className="text-xs text-gray-500">{user.email}</div></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{formatIndonesianDate(user.created_at)}</td>
                    <td className="px-6 py-4"><span className={`rounded-full px-2 py-0.5 text-xs ${user.is_admin ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}`}>{user.is_admin ? 'Admin' : 'User'}</span></td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => handleEdit(user)} className="p-1 text-blue-600 hover:text-blue-800"><PencilIcon className="h-4 w-4" /></button>
                      <button onClick={() => setDeleteModal({ open: true, user })} className="ml-2 p-1 text-red-600 hover:text-red-800"><TrashBinIcon className="h-4 w-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {total > 0 && (
            <div className="px-6 py-4 flex flex-wrap items-center justify-between gap-3 text-sm text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <span>Rows per page</span>
                <select
                  value={perPage}
                  onChange={(e) => handlePerPageChange(Number(e.target.value))}
                  className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                >
                  {[5, 10, 15, 20, 50, 100].map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-3">
                <button
                  className="rounded-md border border-gray-300 px-3 py-1 disabled:opacity-50 dark:border-gray-700 flex items-center gap-1"
                  onClick={() => loadPage(currentPage - 1)}
                  disabled={currentPage <= 1}
                >
                  <AngleLeftIcon className="h-4 w-4" /> Prev
                </button>
                <div className="hidden sm:block">
                  Page <span className="font-semibold text-gray-900 dark:text-white">{currentPage}</span> of <span className="font-semibold text-gray-900 dark:text-white">{totalPages}</span>
                </div>
                <button
                  className="rounded-md border border-gray-300 px-3 py-1 disabled:opacity-50 dark:border-gray-700 flex items-center gap-1"
                  onClick={() => loadPage(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                >
                  Next <AngleRightIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-2xl border border-gray-200 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-800">
          <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-700 dark:bg-gray-800"><h2 className="text-xl font-bold dark:text-white">Feedbacks</h2></div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-900 font-semibold uppercase text-xs text-gray-700 dark:text-gray-300">
                <tr className="text-left"><th className="px-6 py-4">User</th><th className="px-6 py-4">Subject</th><th className="px-6 py-4">Message</th><th className="px-6 py-4 text-right">Actions</th></tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {feedbacks.length === 0 ? <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">No feedbacks</td></tr> : feedbacks.map((fb) => (
                  <tr key={fb.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4"><div><div className="font-medium dark:text-white">{fb.name}</div><div className="text-xs text-gray-500">{fb.email}</div></div></td>
                    <td className="px-6 py-4 font-medium dark:text-gray-300">{fb.subject}</td>
                    <td className="px-6 py-4 dark:text-gray-400 max-w-xs truncate" title={fb.message}>{fb.message}</td>
                    <td className="px-6 py-4 text-right"><button onClick={() => setDeleteFeedbackModal({ open: true, id: fb.id })} className="text-red-600 hover:text-red-800"><TrashBinIcon className="h-4 w-4" /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {feedbackTotal > 0 && (
            <div className="px-6 py-4 flex flex-wrap items-center justify-between gap-3 text-sm text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <span>Rows per page</span>
                <select
                  value={feedbackPerPage}
                  onChange={(e) => handleFeedbackPerPageChange(Number(e.target.value))}
                  className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                >
                  {[5, 10, 15, 20, 50, 100].map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-3">
                <button
                  className="rounded-md border border-gray-300 px-3 py-1 disabled:opacity-50 dark:border-gray-700 flex items-center gap-1"
                  onClick={() => loadFeedbacks(feedbackPage - 1)}
                  disabled={feedbackPage <= 1}
                >
                  <AngleLeftIcon className="h-4 w-4" /> Prev
                </button>
                <div className="hidden sm:block">
                  Page <span className="font-semibold text-gray-900 dark:text-white">{feedbackPage}</span> of <span className="font-semibold text-gray-900 dark:text-white">{feedbackTotalPages}</span>
                </div>
                <button
                  className="rounded-md border border-gray-300 px-3 py-1 disabled:opacity-50 dark:border-gray-700 flex items-center gap-1"
                  onClick={() => loadFeedbacks(feedbackPage + 1)}
                  disabled={feedbackPage >= feedbackTotalPages}
                >
                  Next <AngleRightIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      {editModal.open && editModal.user && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800">
            <h2 className="text-xl font-bold mb-4 dark:text-white">Edit User</h2>
            <div className="space-y-4">
              <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full border rounded-lg px-3 py-2 dark:bg-gray-700 dark:text-white" placeholder="Name" />
              <input type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} className="w-full border rounded-lg px-3 py-2 dark:bg-gray-700 dark:text-white" placeholder="Email" />
              <input type="password" value={editPassword} onChange={(e) => setEditPassword(e.target.value)} className="w-full border rounded-lg px-3 py-2 dark:bg-gray-700 dark:text-white" placeholder="Password (blank to keep)" />

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Storage Limit (MB)
                </label>
                <input
                  type="number"
                  min="0"
                  value={editStorageLimit}
                  onChange={(e) => setEditStorageLimit(parseInt(e.target.value) || 0)}
                  className="w-full border rounded-lg px-3 py-2 dark:bg-gray-700 dark:text-white"
                  placeholder="Storage Limit (MB)"
                />
              </div>

              <label className="flex items-center gap-2 dark:text-gray-300"><input type="checkbox" checked={editIsAdmin} onChange={(e) => setEditIsAdmin(e.target.checked)} /> Admin</label>
            </div>
            <div className="mt-6 flex justify-end gap-3"><Button onClick={() => setEditModal({ open: false, user: null })} variant="outline">Cancel</Button><Button onClick={handleSaveEdit} disabled={saving}>Save</Button></div>
          </div>
        </div>
      )}

      <ConfirmDeleteModal isOpen={deleteModal.open} onClose={() => setDeleteModal({ open: false, user: null })} onConfirm={handleDelete} isLoading={deleting} title="Delete User" message={`Delete ${deleteModal.user?.name}?`} />
      <ConfirmDeleteModal isOpen={deleteFeedbackModal.open} onClose={() => setDeleteFeedbackModal({ open: false, id: null })} onConfirm={handleDeleteFeedback} isLoading={deletingFeedback} title="Delete Feedback" message="Delete this feedback?" />
      {analytics && <div className="hidden">{analytics.user_registrations.length}</div>}
    </div>
  );
}
