import { useEffect, useState, useMemo } from 'react';
import { adminService, AdminStats, User, Analytics } from '../../services/adminService';
import { Skeleton } from '../../components/common/Skeleton';
import Button from '../../components/ui/button/Button';
import { TrashBinIcon, EyeIcon, UserIcon, TaskIcon, TargetIcon, CheckCircleIcon, DollarLineIcon, PencilIcon, CloseIcon, AngleLeftIcon, AngleRightIcon, SearchIcon } from '../../icons';
import { formatIndonesianDate } from '../../utils/date';
import ConfirmDeleteModal from '../../components/common/ConfirmDeleteModal';
import UserLocationMap from '../../components/admin/UserLocationMap';

interface ActiveUser {
  user: User;
  sessions: Array<{
    ip_address: string;
    location: string;
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
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([]);
  const [showActiveUsers, setShowActiveUsers] = useState(false);
  const [sortField, setSortField] = useState<'name' | 'email' | 'created_at' | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [total, setTotal] = useState(0);
  const [perPage, setPerPage] = useState(15);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const [statsData, usersData, analyticsData, activeUsersData] = await Promise.all([
        adminService.getDashboard(),
        adminService.getUsers(1, search, perPage),
        adminService.getAnalytics(),
        adminService.getActiveUsers().catch(() => ({ active_users: [], total: 0 })),
      ]);
      setStats(statsData);
      setUsers(usersData.data);
      setCurrentPage(usersData.current_page);
      setTotalPages(usersData.last_page);
      setTotal(usersData.total);
      setAnalytics(analyticsData);
      setActiveUsers(activeUsersData.active_users || []);
    } catch (error) {
      console.error('Error loading admin dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
    // Refresh active users every 30 seconds
    const interval = setInterval(() => {
      adminService.getActiveUsers()
        .then((data) => setActiveUsers(data.active_users || []))
        .catch(() => {});
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

  const handleSort = (field: 'name' | 'email' | 'created_at') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
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

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
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

  // Prepare user locations for map
  const userLocations = useMemo(() => {
    const allLocations: Array<{
      latitude: number | null;
      longitude: number | null;
      location: string;
      user_name: string;
      user_email: string;
    }> = [];
    activeUsers.forEach((activeUser) => {
      activeUser.sessions.forEach((session) => {
        if (session.latitude && session.longitude) {
          allLocations.push({
            latitude: session.latitude,
            longitude: session.longitude,
            location: session.location,
            user_name: activeUser.user.name,
            user_email: activeUser.user.email,
          });
        }
      });
    });
    return allLocations;
  }, [activeUsers]);

  const handleEdit = (user: User) => {
    setEditModal({ open: true, user });
    setEditName(user.name);
    setEditEmail(user.email);
    setEditPassword('');
    setEditIsAdmin(user.is_admin || false);
  };

  const handleSaveEdit = async () => {
    if (!editModal.user) return;
    try {
      setSaving(true);
      const data: any = { name: editName, email: editEmail, is_admin: editIsAdmin };
      if (editPassword) {
        data.password = editPassword;
      }
      await adminService.updateUser(editModal.user.id, data);
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">Manage and analyze users and platform data</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6 dark:border-blue-800 dark:bg-blue-950/30">
          <div className="flex items-center justify-between mb-2">
            <UserIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <span className="text-xs text-blue-600 dark:text-blue-400">Total Users</span>
          </div>
          <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">{stats?.users.total || 0}</p>
          <p className="mt-1 text-xs text-blue-600 dark:text-blue-400">
            {stats?.users.new_this_month || 0} new this month
          </p>
        </div>

        <div className="rounded-2xl border border-green-200 bg-green-50 p-6 dark:border-green-800 dark:bg-green-950/30">
          <div className="flex items-center justify-between mb-2">
            <TaskIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
            <span className="text-xs text-green-600 dark:text-green-400">Total Tasks</span>
          </div>
          <p className="text-3xl font-bold text-green-900 dark:text-green-100">{stats?.tasks.total || 0}</p>
          <p className="mt-1 text-xs text-green-600 dark:text-green-400">
            {stats?.tasks.completed || 0} completed
          </p>
        </div>

        <div className="rounded-2xl border border-purple-200 bg-purple-50 p-6 dark:border-purple-800 dark:bg-purple-950/30">
          <div className="flex items-center justify-between mb-2">
            <CheckCircleIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            <span className="text-xs text-purple-600 dark:text-purple-400">Total Habits</span>
          </div>
          <p className="text-3xl font-bold text-purple-900 dark:text-purple-100">{stats?.habits.total || 0}</p>
          <p className="mt-1 text-xs text-purple-600 dark:text-purple-400">
            {stats?.habits.active || 0} active
          </p>
        </div>

        <div className="rounded-2xl border border-orange-200 bg-orange-50 p-6 dark:border-orange-800 dark:bg-orange-950/30">
          <div className="flex items-center justify-between mb-2">
            <DollarLineIcon className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            <span className="text-xs text-orange-600 dark:text-orange-400">Transactions</span>
          </div>
          <p className="text-3xl font-bold text-orange-900 dark:text-orange-100">{stats?.transactions.total || 0}</p>
          <p className="mt-1 text-xs text-orange-600 dark:text-orange-400">
            {formatCurrency(stats?.transactions.income || 0)} income
          </p>
        </div>
      </div>

      {/* User Locations Map */}
      <UserLocationMap users={userLocations} />

      {/* Active Users Section */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Active Users ({activeUsers.length})
            </h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Users who have logged in within the last hour with their location information
            </p>
          </div>
          <Button
            onClick={() => setShowActiveUsers(!showActiveUsers)}
            size="sm"
            variant="outline"
          >
            {showActiveUsers ? 'Hide' : 'Show'}
          </Button>
        </div>
        {showActiveUsers && (
          <div className="space-y-4">
            {activeUsers.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400 py-8">No active users at the moment</p>
            ) : (
              activeUsers.map((activeUser) => (
                <div
                  key={activeUser.user.id}
                  className="rounded-lg border border-gray-200 bg-gray-50 p-5 dark:border-gray-700 dark:bg-gray-700/50 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-purple-500 text-white font-semibold text-sm">
                        {activeUser.user.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{activeUser.user.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{activeUser.user.email}</p>
                      </div>
                    </div>
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800 dark:bg-green-500/20 dark:text-green-400">
                      {activeUser.total_sessions} session{activeUser.total_sessions > 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-2">
                      Login Sessions:
                    </p>
                    {activeUser.sessions.map((session, idx) => (
                      <div
                        key={idx}
                        className="rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-600 dark:bg-gray-800/50"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2 text-sm text-gray-900 dark:text-white">
                              <svg
                                className="h-4 w-4 text-blue-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                              </svg>
                              <span className="font-medium">{session.location || 'Location Unknown'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                              <svg
                                className="h-3.5 w-3.5 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                                />
                              </svg>
                              <span>IP: {session.ip_address}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500 mt-1">
                              <svg
                                className="h-3.5 w-3.5 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              <span>Last activity: {formatIndonesianDate(session.last_activity)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Users List */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-800">
        <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 dark:border-gray-700 dark:from-gray-800 dark:to-gray-800/50">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Users Management</h2>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Total {total} users found
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative flex-1 sm:w-64">
                <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full rounded-lg border border-gray-300 bg-white pl-10 pr-3 py-2 text-sm text-gray-900 transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <Button onClick={handleSearch} size="sm">Search</Button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th className="px-6 py-4 text-left">
                  <button
                    onClick={() => handleSort('name')}
                    className="group flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-700 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                  >
                    Name
                    {sortField === 'name' && (
                      <span className="text-indigo-600 dark:text-indigo-400">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </button>
                </th>
                <th className="px-6 py-4 text-left">
                  <button
                    onClick={() => handleSort('email')}
                    className="group flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-700 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                  >
                    Email
                    {sortField === 'email' && (
                      <span className="text-indigo-600 dark:text-indigo-400">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </button>
                </th>
                <th className="px-6 py-4 text-left">
                  <button
                    onClick={() => handleSort('created_at')}
                    className="group flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-700 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                  >
                    Joined
                    {sortField === 'created_at' && (
                      <span className="text-indigo-600 dark:text-indigo-400">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </button>
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                  Role
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
              {sortedUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    No users found
                  </td>
                </tr>
              ) : (
                sortedUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="group transition-all hover:bg-indigo-50/50 dark:hover:bg-gray-700/30"
                  >
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 text-sm font-semibold text-white">
                          {user.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white">{user.name}</span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {user.email}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {formatIndonesianDate(user.created_at)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {user.is_admin ? (
                        <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800 dark:bg-purple-500/20 dark:text-purple-300">
                          Admin
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-500/20 dark:text-gray-300">
                          User
                        </span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(user)}
                          className="rounded-lg p-2 text-indigo-600 transition-all hover:bg-indigo-100 hover:scale-110 dark:text-indigo-400 dark:hover:bg-indigo-500/20"
                          title="Edit User"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteModal({ open: true, user })}
                          className="rounded-lg p-2 text-red-600 transition-all hover:bg-red-100 hover:scale-110 dark:text-red-400 dark:hover:bg-red-500/20"
                          title="Delete User"
                        >
                          <TrashBinIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {(
          <div className="border-t border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-700 dark:bg-gray-900/50">
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <div className="flex items-center gap-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Showing page <span className="font-medium text-gray-900 dark:text-white">{currentPage}</span> of{' '}
                  <span className="font-medium text-gray-900 dark:text-white">{totalPages}</span>
                </p>
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600 dark:text-gray-400">Per page:</label>
                  <select
                    value={perPage}
                    onChange={(e) => handlePerPageChange(Number(e.target.value))}
                    className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  >
                    <option value={10}>10</option>
                    <option value={15}>15</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => loadPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-all disabled:cursor-not-allowed disabled:opacity-50 hover:bg-gray-50 hover:border-indigo-500 hover:text-indigo-600 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:border-indigo-500 dark:hover:text-indigo-400"
                >
                  <AngleLeftIcon className="h-4 w-4" />
                </button>
                
                {getPageNumbers().map((page, idx) => (
                  <button
                    key={idx}
                    onClick={() => typeof page === 'number' && loadPage(page)}
                    disabled={page === '...' || page === currentPage}
                    className={`min-w-[2.5rem] rounded-lg border px-3 py-2 text-sm font-medium transition-all disabled:cursor-default ${
                      page === currentPage
                        ? 'border-indigo-500 bg-indigo-600 text-white'
                        : page === '...'
                        ? 'border-transparent bg-transparent text-gray-400'
                        : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-indigo-500 hover:text-indigo-600 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => loadPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-all disabled:cursor-not-allowed disabled:opacity-50 hover:bg-gray-50 hover:border-indigo-500 hover:text-indigo-600 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:border-indigo-500 dark:hover:text-indigo-400"
                >
                  <AngleRightIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Edit User Modal */}
      {editModal.open && editModal.user && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-xl dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Edit User</h2>
              <button
                onClick={() => setEditModal({ open: false, user: null })}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password (leave blank to keep current)
                </label>
                <input
                  type="password"
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="is_admin"
                  checked={editIsAdmin}
                  onChange={(e) => setEditIsAdmin(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700"
                />
                <label htmlFor="is_admin" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Make this user an admin
                </label>
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <Button onClick={handleSaveEdit} disabled={saving || !editName.trim() || !editEmail.trim()} className="grow">
                {saving ? 'Saving...' : 'Save'}
              </Button>
              <Button
                onClick={() => setEditModal({ open: false, user: null })}
                variant="outline"
                className="grow"
                disabled={saving}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      <ConfirmDeleteModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, user: null })}
        onConfirm={handleDelete}
        isLoading={deleting}
        title="Delete User"
        message={`Are you sure you want to delete user "${deleteModal.user?.name}"? This action cannot be undone and will delete all associated data.`}
      />
    </div>
  );
}
