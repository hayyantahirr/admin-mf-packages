import { LayoutDashboard, Package, Mail, X, FileText } from "lucide-react";
import Image from "next/image";

export default function Sidebar({ activeTab, setActiveTab, isOpen, setIsOpen }) {
  const navItems = [
    { label: "Overview", icon: <LayoutDashboard size={20} />, id: "overview" },
    { label: "Product Management", icon: <Package size={20} />, id: "products" },
    { label: "Blogs", icon: <FileText size={20} />, id: "blogs" },
    { label: "Inquiries", icon: <Mail size={20} />, id: "inquiries" },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div className={`w-64 h-screen bg-[#0b3a4c] text-white flex flex-col fixed left-0 top-0 z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        {/* Logo & Close Button */}
        <div className="p-6 text-2xl font-bold border-b border-[#ffffff1a] flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="relative w-8 h-8">
               <Image src="/logo.png" alt="MF-Packages Logo" fill className="object-contain" />
             </div>
            <span className="text-lg">MF-Packages</span>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-2 text-slate-300 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 py-6 px-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
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
