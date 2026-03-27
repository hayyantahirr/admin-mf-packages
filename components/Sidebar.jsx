import { LayoutDashboard, Package, Mail, X, FileText, ShoppingBag } from "lucide-react";
import Image from "next/image";

export default function Sidebar({
  activeTab,
  setActiveTab,
  isOpen,
  setIsOpen,
}) {
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
    },
    { label: "Blogs", icon: <FileText size={20} />, id: "blogs" },
    { label: "Inquiries", icon: <Mail size={20} />, id: "inquiries" },
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
        <nav className="flex-1 px-4 py-6">
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
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}
