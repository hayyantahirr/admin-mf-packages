"use client";

import { useState, useEffect } from "react";
import { db } from "../config/firebase";
import {
  collection,
  query,
  onSnapshot,
  orderBy,
  doc,
  updateDoc,
} from "firebase/firestore";
import {
  ShoppingBag,
  User,
  MapPin,
  Mail,
  Phone,
  MessageCircle,
  Package,
  Clock,
  Check,
  X,
  CreditCard,
} from "lucide-react";

export default function OrdersDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const orderList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOrders(orderList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-4 text-slate-400">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-[#fa1a00]" />
        <span className="font-bold">Loading Realtime Orders...</span>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center text-slate-400 shadow-sm">
        <ShoppingBag size={64} className="text-slate-200" />
        <div>
          <h3 className="text-xl font-bold text-slate-800">
            No Orders Received Yet
          </h3>
          <p className="mt-2 text-slate-500">
            When customers place orders, they will appear here in realtime.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:flex-row sm:items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tight">
            Order Management
          </h2>
          <p className="mt-1 font-medium text-slate-500">
            Monitor and process incoming orders in realtime.
          </p>
        </div>
        <div className="flex items-center gap-3 rounded-2xl bg-[#0b3a4c] px-6 py-3 text-white shadow-xl">
          <ShoppingBag className="text-[#fa1a00]" size={24} />
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">
              Active Orders
            </span>
            <span className="text-2xl font-black">{orders.length}</span>
          </div>
        </div>
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 gap-6">
        {orders.map((order) => (
          <div
            key={order.id}
            className="group relative overflow-hidden rounded-4xl border border-white/10 bg-[#0b3a4c] shadow-2xl transition-all hover:border-[#fa1a00]/30"
          >
            {/* Status Bar */}
            <div className="flex items-center justify-between border-b border-white/5 bg-black/20 px-8 py-4">
              <div className="flex items-center gap-4">
                <span className="font-mono text-xs font-bold text-white/40 uppercase tracking-widest">
                  Order ID: {order.id.slice(0, 12).toUpperCase()}
                </span>
                <div className="flex items-center gap-2 rounded-full bg-[#fa1a00]/10 px-3 py-1 text-[10px] font-black text-[#fa1a00] uppercase tracking-widest border border-[#fa1a00]/20">
                  <Clock size={12} />
                  {formatDate(order.createdAt)}
                </div>
              </div>
              <div className="flex gap-2">
                <button className="flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-[10px] font-black text-white uppercase tracking-widest transition-all hover:bg-emerald-600 active:scale-95">
                  <Check size={14} />
                  Accept
                </button>
                <button className="flex items-center gap-2 rounded-xl bg-red-500 px-4 py-2 text-[10px] font-black text-white uppercase tracking-widest transition-all hover:bg-red-600 active:scale-95">
                  <X size={14} />
                  Reject
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Left Side: Customer Info */}
              <div className="border-r border-white/5 p-8">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fa1a00] text-white shadow-lg shadow-red-500/20">
                    <User size={20} />
                  </div>
                  <h4 className="text-sm font-black uppercase tracking-widest text-[#fa1a00]">
                    Customer Details
                  </h4>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="mt-1 text-[#CBD5E1]">
                      <User size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#CBD5E1]">
                        Full Name
                      </p>
                      <p className="text-lg font-bold text-white leading-none mt-1">
                        {order.customerDetails?.fullName || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="mt-1 text-[#CBD5E1]">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#CBD5E1]">
                        Shipping Address
                      </p>
                      <p className="text-sm font-medium text-white leading-relaxed mt-1">
                        {order.customerDetails?.address || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="mt-1 text-[#CBD5E1]">
                      <Mail size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#CBD5E1]">
                        Email Address
                      </p>
                      <p className="text-sm font-medium text-white mt-1">
                        {order.customerDetails?.email || "N/A"}
                      </p>
                    </div>
                  </div>

                  {/* Quick Action Contact Buttons */}
                  <div className="flex gap-4 pt-4">
                    <a
                      href={`tel:${order.customerDetails?.phone}`}
                      className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-white/5 border border-white/10 px-6 py-4 transition-all hover:bg-white/10 group/btn"
                    >
                      <Phone
                        size={20}
                        className="text-[#fa1a00] transition-transform group-hover/btn:scale-110"
                      />
                      <span className="text-[10px] font-black uppercase tracking-widest text-white">
                        Call Customer
                      </span>
                    </a>
                    <a
                      href={`https://wa.me/${order.customerDetails?.phone?.replace(/\+/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#25D366]/10 border border-[#25D366]/20 px-6 py-4 transition-all hover:bg-[#25D366]/20 group/btn"
                    >
                      <MessageCircle
                        size={20}
                        className="text-[#25D366] transition-transform group-hover/btn:scale-110"
                      />
                      <span className="text-[10px] font-black uppercase tracking-widest text-white">
                        WhatsApp
                      </span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Right Side: Cart Items */}
              <div className="flex flex-col bg-black/10 p-8">
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fa1a00]/10 text-[#fa1a00] border border-[#fa1a00]/20">
                      <Package size={20} />
                    </div>
                    <h4 className="text-sm font-black uppercase tracking-widest text-[#fa1a00]">
                      Ordered Items
                    </h4>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#CBD5E1]">
                    {order.items?.length || 0} Products
                  </span>
                </div>
 
                <div className="flex-1 space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {order.items?.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-4 rounded-2xl border border-white/5 bg-white/5 p-4 transition-all hover:bg-white/8"
                    >
                      <div className="h-16 w-16 overflow-hidden rounded-xl bg-white/10">
                        {item.mainImage ? (
                          <img
                            src={item.mainImage}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-white/10">
                            <Package size={24} />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-sm font-black text-white uppercase tracking-tight">
                           {item.size}CM - {item.name}
                        </p>
                        <div className="flex items-center gap-3 mt-1 text-[10px] font-bold uppercase tracking-widest text-[#CBD5E1]">
                          <span className="flex items-center gap-1">
                            <Clock size={10} />
                          </span>
                          <span className="h-1 w-1 rounded-full bg-[#fa1a00]" />
                          <span>Qty: {item.quantity}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black text-white">
                          Rs. {item.totalPrice.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Summary Footer */}
                <div className="mt-8 pt-6 border-t border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-[#CBD5E1]">
                        <CreditCard size={16} />
                      </div>
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#CBD5E1]">
                          Payment Method
                        </p>
                        <p className="text-xs font-black text-white uppercase tracking-widest">
                          {order.paymentMethod || "COD"}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#fa1a00]">
                        Grand Total
                      </p>
                      <p className="text-3xl font-black text-white tracking-tighter">
                        Rs. {order.totalAmount?.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
