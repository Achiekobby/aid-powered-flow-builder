import React from "react";
import { useAppSelector } from "../../hooks/useAppSelector";
import { Plus, BarChart3, Smartphone, Settings } from "lucide-react";
import DashboardLayout from "../../components/Layout/DashboardLayout";

const Dashboard = () => {
  const { user } = useAppSelector((state) => state.auth);

  const dashboardStats = [
    {
      title: "Active USSD Apps",
      value: "3",
      icon: Smartphone,
      color: "text-blue-600",
      bgColor: "bg-gradient-to-br from-blue-50 to-indigo-50",
      borderColor: "border-blue-200",
      change: "+12%",
      changeType: "positive"
    },
    {
      title: "Total Sessions",
      value: "1,247",
      icon: BarChart3,
      color: "text-emerald-600",
      bgColor: "bg-gradient-to-br from-emerald-50 to-green-50",
      borderColor: "border-emerald-200",
      change: "+8.2%",
      changeType: "positive"
    },
    {
      title: "Success Rate",
      value: "98.5%",
      icon: BarChart3,
      color: "text-purple-600",
      bgColor: "bg-gradient-to-br from-purple-50 to-violet-50",
      borderColor: "border-purple-200",
      change: "+2.1%",
      changeType: "positive"
    },
  ];

  const quickActions = [
    {
      title: "Create New USSD App",
      description: "Build a new USSD application from scratch",
      icon: Plus,
      color: "text-emerald-600",
      bgColor: "bg-gradient-to-br from-emerald-50 to-green-50",
      borderColor: "border-emerald-200",
      href: "#",
    },
    {
      title: "View Analytics",
      description: "Check your app performance and user insights",
      icon: BarChart3,
      color: "text-blue-600",
      bgColor: "bg-gradient-to-br from-blue-50 to-indigo-50",
      borderColor: "border-blue-200",
      href: "#",
    },
    {
      title: "Manage Settings",
      description: "Update your account and app configurations",
      icon: Settings,
      color: "text-purple-600",
      bgColor: "bg-gradient-to-br from-purple-50 to-violet-50",
      borderColor: "border-purple-200",
      href: "#",
    },
  ];

  return (
    <DashboardLayout>
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-emerald-800 to-gray-900 bg-clip-text text-transparent mb-2">
          Welcome back, {user?.name?.split(' ')[0] || 'User'}! 👋
        </h1>
        <p className="text-gray-600 text-lg">
          Here's what's happening with your USSD applications today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {dashboardStats.map((stat, index) => (
          <div
            key={index}
            className={`bg-white rounded-2xl p-6 shadow-lg border ${stat.borderColor} hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</p>
                <div className="flex items-center">
                  <span className={`text-xs font-semibold ${
                    stat.changeType === 'positive' ? 'text-emerald-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                  <span className="text-xs text-gray-500 ml-1">from last month</span>
                </div>
              </div>
              <div className={`w-14 h-14 ${stat.bgColor} rounded-xl flex items-center justify-center border ${stat.borderColor}`}>
                <stat.icon className={`w-7 h-7 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action, index) => (
            <div
              key={index}
              className={`bg-white rounded-2xl p-6 shadow-lg border ${action.borderColor} hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group`}
            >
              <div className={`w-14 h-14 ${action.bgColor} rounded-xl flex items-center justify-center border ${action.borderColor} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <action.icon className={`w-7 h-7 ${action.color}`} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{action.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{action.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-200">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center shadow-lg">
              <Plus className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900">New USSD app created</p>
              <p className="text-sm text-gray-600">Customer Service App • 2 hours ago</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center shadow-lg">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900">Analytics updated</p>
              <p className="text-sm text-gray-600">Payment App • 5 hours ago</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl border border-purple-200">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-violet-500 rounded-full flex items-center justify-center shadow-lg">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900">Settings modified</p>
              <p className="text-sm text-gray-600">Account settings • 1 day ago</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard; 