import { TrendingUp, Package, Mail } from "lucide-react";

export default function Overview() {
  const stats = [
    {
      title: "Total Products",
      value: "2,543",
      change: "+12.5%",
      icon: <Package className="h-5 w-5 text-[#fa1a00]" />,
      positive: true,
    },
    {
      title: "Total Sales",
      value: "$45,231.89",
      change: "+24.1%",
      icon: <TrendingUp className="h-5 w-5 text-emerald-600" />,
      positive: true,
    },
    {
      title: "Pending Inquiries",
      value: "14",
      change: "-5.2%",
      icon: <Mail className="h-5 w-5 text-amber-600" />,
      positive: false,
    },
  ];

  const recentActivity = [
    {
      id: 1,
      user: "Sarah Jenkins",
      action: "Updated product SKU-1029",
      time: "2 hours ago",
    },
    {
      id: 2,
      user: "Mike Ross",
      action: "Resolved inquiry #4920",
      time: "4 hours ago",
    },
    {
      id: 3,
      user: "Elena Gilbert",
      action: "Added new product 'Wireless Earbuds'",
      time: "5 hours ago",
    },
    {
      id: 4,
      user: "System",
      action: "Automated backup completed",
      time: "12 hours ago",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-800">
          Dashboard Overview
        </h2>
        <p className="mt-1 text-slate-500">
          Welcome back, Admin. Here's what's happening today.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="flex flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  {stat.title}
                </p>
                <h3 className="mt-1 text-2xl font-bold text-slate-800">
                  {stat.value}
                </h3>
              </div>
              <div className="rounded-lg bg-slate-50 p-2">{stat.icon}</div>
            </div>
            <div className="mt-4 flex items-center">
              <span
                className={`text-sm font-medium ${stat.positive ? "text-emerald-600" : "text-red-500"}`}
              >
                {stat.change}
              </span>
              <span className="ml-2 text-sm text-slate-500">vs last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
          <h3 className="font-semibold text-slate-800">Recent Activity</h3>
        </div>
        <div className="divide-y divide-slate-100">
          {recentActivity.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-slate-50"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-50 text-xs font-semibold text-[#fa1a00]">
                {activity.user.charAt(0)}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-800">
                  <span className="font-semibold">{activity.user}</span>{" "}
                  {activity.action}
                </p>
                <p className="mt-0.5 text-xs text-slate-500">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
