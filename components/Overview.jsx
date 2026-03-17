import { TrendingUp, Package, Mail } from "lucide-react";

export default function Overview() {
  const stats = [
    {
      title: "Total Products",
      value: "2,543",
      change: "+12.5%",
      icon: <Package className="w-5 h-5 text-[#fa1a00]" />,
      positive: true,
    },
    {
      title: "Total Sales",
      value: "$45,231.89",
      change: "+24.1%",
      icon: <TrendingUp className="w-5 h-5 text-emerald-600" />,
      positive: true,
    },
    {
      title: "Pending Inquiries",
      value: "14",
      change: "-5.2%",
      icon: <Mail className="w-5 h-5 text-amber-600" />,
      positive: false,
    },
  ];

  const recentActivity = [
    { id: 1, user: "Sarah Jenkins", action: "Updated product SKU-1029", time: "2 hours ago" },
    { id: 2, user: "Mike Ross", action: "Resolved inquiry #4920", time: "4 hours ago" },
    { id: 3, user: "Elena Gilbert", action: "Added new product 'Wireless Earbuds'", time: "5 hours ago" },
    { id: 4, user: "System", action: "Automated backup completed", time: "12 hours ago" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-800">Dashboard Overview</h2>
        <p className="text-slate-500 mt-1">Welcome back, Admin. Here's what's happening today.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                <h3 className="text-2xl font-bold text-slate-800 mt-1">{stat.value}</h3>
              </div>
              <div className="p-2 bg-slate-50 rounded-lg">{stat.icon}</div>
            </div>
            <div className="mt-4 flex items-center">
              <span className={`text-sm font-medium ${stat.positive ? 'text-emerald-600' : 'text-red-500'}`}>
                {stat.change}
              </span>
              <span className="text-sm text-slate-500 ml-2">vs last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
          <h3 className="font-semibold text-slate-800">Recent Activity</h3>
        </div>
        <div className="divide-y divide-slate-100">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="px-6 py-4 flex items-center gap-4 hover:bg-slate-50 transition-colors">
              <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-[#fa1a00] font-semibold text-xs">
                {activity.user.charAt(0)}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-800">
                  <span className="font-semibold">{activity.user}</span> {activity.action}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
