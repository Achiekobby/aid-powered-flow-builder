import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { logout } from "../../store/slices/authSlice";
import { LogOut, User, Settings, Plus, BarChart3, Smartphone } from "lucide-react";

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const dashboardStats = [
    {
      title: "Active USSD Apps",
      value: "3",
      icon: Smartphone,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Total Sessions",
      value: "1,247",
      icon: BarChart3,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Success Rate",
      value: "98.5%",
      icon: BarChart3,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  const quickActions = [
    {
      title: "Create New USSD App",
      description: "Build a new USSD application from scratch",
      icon: Plus,
      color: "text-green-600",
      bgColor: "bg-green-50",
      href: "#",
    },
    {
      title: "View Analytics",
      description: "Check your app performance and user insights",
      icon: BarChart3,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      href: "#",
    },
    {
      title: "Manage Settings",
      description: "Update your account and app configurations",
      icon: Settings,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      href: "#",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">U</span>
              </div>
              <span className="ml-3 text-xl font-bold text-gray-900">
                USSD Builder Dashboard
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {user?.firstName} {user?.lastName}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.firstName}! 👋
          </h1>
          <p className="text-gray-600">
            Here's what's happening with your USSD applications today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {dashboardStats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 hover:-translate-y-1 cursor-pointer"
              >
                <div className={`w-12 h-12 ${action.bgColor} rounded-xl flex items-center justify-center mb-4`}>
                  <action.icon className={`w-6 h-6 ${action.color}`} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{action.title}</h3>
                <p className="text-gray-600 text-sm">{action.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Plus className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">New USSD app created</p>
                <p className="text-sm text-gray-500">Customer Service App • 2 hours ago</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Analytics updated</p>
                <p className="text-sm text-gray-500">Payment App • 5 hours ago</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Settings className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Settings modified</p>
                <p className="text-sm text-gray-500">Account settings • 1 day ago</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard; 