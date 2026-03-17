import { Search, Bell, User, Menu } from "lucide-react";

export default function Header({ setIsOpen }) {
  return (
    <header className="h-20 bg-white border-b border-slate-200 px-4 md:px-8 flex items-center justify-between sticky top-0 z-10 shadow-sm">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setIsOpen(true)}
          className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <Menu className="h-6 w-6" />
        </button>
        
        {/* Search Bar */}
        <div className="relative w-40 sm:w-64 md:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-md leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#fa1a00] focus:border-[#fa1a00] sm:text-sm transition-colors"
            placeholder="Search..."
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3 md:gap-6">
        <button className="text-slate-400 hover:text-slate-600 relative">
          <Bell className="h-6 w-6" />
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-[#fa1a00] ring-2 ring-white"></span>
        </button>
        <div className="flex items-center gap-3 border-l border-slate-200 pl-4 md:pl-6 cursor-pointer">
          <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-red-50 flex items-center justify-center text-[#fa1a00]">
            <User className="h-5 w-5" />
          </div>
          <div className="hidden sm:block text-sm">
            <p className="font-medium text-slate-700">Admin User</p>
            <p className="text-slate-500">Administrator</p>
          </div>
        </div>
      </div>
    </header>
  );
}
