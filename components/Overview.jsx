"use client";

import { useState, useEffect } from "react";
import { db } from "../config/firebase";
import {
  collection,
  query,
  onSnapshot,
  orderBy,
  limit,
  where,
} from "firebase/firestore";
import {
  TrendingUp,
  Package,
  Mail,
  ShoppingBag,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  ChevronRight,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Overview() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalSales: 0,
    pendingOrders: 0,
    unseenInquiries: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Fetch Total Products
    const unsubscribeProducts = onSnapshot(
      collection(db, "products"),
      (snapshot) => {
        setStats((prev) => ({ ...prev, totalProducts: snapshot.size }));
      },
    );

    // 2. Fetch Pending Orders Count
    const qPending = query(
      collection(db, "orders"),
      where("status", "==", "pending"),
    );
    const unsubscribePending = onSnapshot(qPending, (snapshot) => {
      setStats((prev) => ({ ...prev, pendingOrders: snapshot.size }));
    });

    // 3. Fetch Unseen Inquiries Count
    const qUnseen = query(
      collection(db, "contacts"),
      where("isSeen", "==", false),
    );
    const unsubscribeUnseen = onSnapshot(qUnseen, (snapshot) => {
      setStats((prev) => ({ ...prev, unseenInquiries: snapshot.size }));
    });

    // 4. Fetch All Orders for Total Sales and Chart
    const qOrders = query(
      collection(db, "orders"),
      orderBy("createdAt", "desc"),
    );
    const unsubscribeOrders = onSnapshot(qOrders, (snapshot) => {
      const orders = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Calculate Total Sales (PKR)
      const totalSales = orders.reduce(
        (sum, order) => sum + (order.totalAmountPKR || 0),
        0,
      );

      // Prepare Recent Orders (Top 5)
      setRecentOrders(orders.slice(0, 5));

      // Prepare Chart Data (Last 7 Days)
      const dailyData = {};
      const now = new Date();
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(now.getDate() - i);
        const dateStr = d.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
        dailyData[dateStr] = 0;
      }

      orders.forEach((order) => {
        if (order.createdAt) {
          const date = order.createdAt.toDate
            ? order.createdAt.toDate()
            : new Date(order.createdAt);
          const dateStr = date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          });
          if (dailyData[dateStr] !== undefined) {
            dailyData[dateStr] += order.totalAmountPKR || 0;
          }
        }
      });

      const chartArray = Object.entries(dailyData).map(([name, sales]) => ({
        name,
        sales,
      }));

      setStats((prev) => ({ ...prev, totalSales }));
      setChartData(chartArray);
      setLoading(false);
    });

    return () => {
      unsubscribeProducts();
      unsubscribePending();
      unsubscribeUnseen();
      unsubscribeOrders();
    };
  }, []);

  const statCards = [
    {
      title: "Total Sales",
      value: `PKR ${stats.totalSales.toLocaleString()}`,
      icon: <TrendingUp className="h-6 w-6 text-emerald-400" />,
      color: "bg-emerald-500/10 border-emerald-500/20",
      textColor: "text-emerald-400",
    },
    {
      title: "Active Orders",
      value: stats.pendingOrders,
      icon: <ShoppingBag className="h-6 w-6 text-[#fa1a00]" />,
      color: "bg-[#fa1a00]/10 border-[#fa1a00]/20",
      textColor: "text-[#fa1a00]",
    },
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: <Package className="h-6 w-6 text-blue-400" />,
      color: "bg-blue-500/10 border-blue-500/20",
      textColor: "text-blue-400",
    },
    {
      title: "Unseen Inquiries",
      value: stats.unseenInquiries,
      icon: <Mail className="h-6 w-6 text-amber-400" />,
      color: "bg-amber-500/10 border-amber-500/20",
      textColor: "text-amber-400",
    },
  ];

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F8FAFC]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-[#fa1a00]" />
          <span className="font-bold text-slate-500">Loading Dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tight">
          Dashboard Overview
        </h2>
        <p className="mt-1 font-medium text-slate-500">
          Real-time metrics and business growth insights.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className={`group relative overflow-hidden rounded-3xl border ${stat.color} bg-white p-6 shadow-sm transition-all hover:shadow-xl`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-slate-400">
                  {stat.title}
                </p>
                <h3 className="mt-2 text-2xl font-black text-slate-800">
                  {stat.value}
                </h3>
              </div>
              <div className={`rounded-2xl p-3 ${stat.color}`}>{stat.icon}</div>
            </div>
            <div className="mt-6 flex items-center text-[10px] font-bold uppercase tracking-widest text-slate-400">
              <span className={`flex items-center gap-1 ${stat.textColor}`}>
                Live Feed <ArrowUpRight size={14} />
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Sales Chart */}
        <div className="lg:col-span-2 rounded-[2.5rem] bg-[#0b3a4c] p-8 shadow-2xl overflow-hidden relative">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-black text-white uppercase tracking-tight">
                Sales Trend
              </h3>
              <p className="text-xs font-bold text-white/40 uppercase tracking-widest mt-1">
                Last 7 Days Revenue
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-2 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-[#fa1a00] animate-pulse" />
              <span className="text-[10px] font-black text-white uppercase tracking-widest leading-none">
                Realtime
              </span>
            </div>
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#fa1a00" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#fa1a00" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="rgba(255,255,255,0.05)"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "rgba(255,255,255,0.4)",
                    fontSize: 10,
                    fontWeight: "bold",
                  }}
                  dy={10}
                />
                <YAxis hide={true} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0b3a4c",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "16px",
                    color: "white",
                  }}
                  itemStyle={{ color: "#fa1a00", fontWeight: "bold" }}
                />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#fa1a00"
                  strokeWidth={4}
                  fillOpacity={1}
                  fill="url(#colorSales)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Orders Side Feed */}
        <div className="rounded-[2.5rem] border border-slate-200 bg-white shadow-xl overflow-hidden flex flex-col">
          <div className="p-8 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">
              Recent Orders
            </h3>
            <ShoppingBag className="text-[#fa1a00]" size={20} />
          </div>
          <div className="flex-1 overflow-y-auto">
            {recentOrders.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 p-12 text-slate-300">
                <Clock size={40} />
                <span className="text-sm font-bold uppercase tracking-wider">
                  No Orders Yet
                </span>
              </div>
            ) : (
              recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="p-6 border-b border-slate-50 hover:bg-slate-50 transition-colors group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-400 group-hover:bg-[#fa1a00] group-hover:text-white transition-all">
                        {order.customerDetails?.fullName?.charAt(0) || "U"}
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-800 uppercase tracking-tight leading-none">
                          {order.customerDetails?.fullName || "Unknwon User"}
                        </p>
                        <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">
                          {order.items?.length || 0} Items •{" "}
                          {order.paymentMethod || "COD"}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-slate-900 leading-none">
                        PKR {order.totalAmountPKR?.toLocaleString()}
                      </p>
                      <p
                        className={`text-[9px] font-black mt-1 uppercase tracking-widest ${order.status === "accepted" ? "text-emerald-500" : "text-[#fa1a00]"}`}
                      >
                        {order.status || "Pending"}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          <button className="w-full p-4 bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-t border-slate-100 hover:bg-slate-100 transition-all flex items-center justify-center gap-2">
            View All Orders <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
