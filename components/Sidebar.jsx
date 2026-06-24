import { LayoutDashboard, Package, Mail, X, FileText, ShoppingBag, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { db } from "../config/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import Image from "next/image";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";

export default function Sidebar({
  activeTab,
  setActiveTab,
  isOpen,
  setIsOpen,
}) {
  const [pendingOrders, setPendingOrders] = useState(0);
  const [unseenInquiries, setUnseenInquiries] = useState(0);
  const { logout, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // ... items from original 17-39 ...
    const ordersQuery = query(
      collection(db, "orders"),
      where("status", "==", "Pending")
    );
    const unsubscribeOrders = onSnapshot(ordersQuery, (snapshot) => {
      setPendingOrders(snapshot.size);
    });

    const inquiriesQuery = query(
      collection(db, "contacts")
    );
    const unsubscribeInquiries = onSnapshot(inquiriesQuery, (snapshot) => {
      const unseenCount = snapshot.docs.filter((doc) => doc.data().isSeen !== true).length;
      setUnseenInquiries(unseenCount);
    });

    return () => {
      unsubscribeOrders();
      unsubscribeInquiries();
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const navItems = [
    { label: "Overview", icon: <LayoutDashboard size={20} />, id: "overview" },
    {
      label: "Product Management",
      icon: <Package size={20} />,
      id: "products",
    },
    {
      label: "Orders",
      icon: <ShoppingBag size={20} />,
      id: "orders",
      badge: pendingOrders,
    },
    { label: "Blogs", icon: <FileText size={20} />, id: "blogs" },
    {
      label: "Inquiries",
      icon: <Mail size={20} />,
      id: "inquiries",
      badge: unseenInquiries,
    },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 left-0 z-50 flex h-screen w-64 transform flex-col bg-[#0b3a4c] text-white transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo & Close Button */}
        <div className="flex items-center justify-between border-b border-[#ffffff1a] p-6 text-2xl font-bold">
          <div className="flex items-center gap-3">
            <div className="relative h-8 w-8">
              <Image
                src="/logo.png"
                alt="MF-Packages Logo"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-lg">MF-Packages</span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 text-slate-300 transition-colors hover:text-white lg:hidden"
          >
            <X size={24} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto no-scrollbar">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsOpen(false);
                  }}
                  className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 transition-colors ${
                    activeTab === item.id
                      ? "bg-[#fa1a00] text-white shadow-lg"
                      : "text-slate-300 hover:bg-[#ffffff0d] hover:text-white"
                  }`}
                >
                  {item.icon}
                  <span className="font-medium flex-1 text-left">{item.label}</span>
                  {item.badge > 0 && (
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-black text-white shadow-lg ring-2 ring-[#0b3a4c]">
                      {item.badge}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Profile & Logout Section */}
        <div className="border-t border-[#ffffff1a] p-4 space-y-4">
          <div className="px-4 py-2">
            <p className="text-[10px] font-black uppercase tracking-widest text-[#fa1a00]">Logged in as</p>
            <p className="truncate text-sm font-bold text-white/80">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl bg-white/5 px-4 py-3 text-sm font-bold text-red-400 transition-all hover:bg-red-500/10 hover:text-red-500"
          >
            <LogOut size={20} />
            <span>Logout Session</span>
          </button>
        </div>
      </div>
    </>
  );
}
