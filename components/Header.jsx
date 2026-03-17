import { Search, Bell, User, Menu } from "lucide-react";

export default function Header({ setIsOpen }) {
  return (
    <header className="sticky top-0 z-10 flex h-20 items-center justify-between border-b border-slate-200 bg-white px-4 shadow-sm md:px-8">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsOpen(true)}
          className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 lg:hidden"
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Search Bar */}
        <div className="relative w-40 sm:w-64 md:w-96">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full rounded-md border border-slate-200 bg-slate-50 py-2 pr-3 pl-10 leading-5 placeholder-slate-400 transition-colors focus:border-[#fa1a00] focus:bg-white focus:ring-1 focus:ring-[#fa1a00] focus:outline-none sm:text-sm"
            placeholder="Search..."
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3 md:gap-6">
        <button className="relative text-slate-400 hover:text-slate-600">
          <Bell className="h-6 w-6" />
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-[#fa1a00] ring-2 ring-white"></span>
        </button>
        <div className="flex cursor-pointer items-center gap-3 border-l border-slate-200 pl-4 md:pl-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-50 text-[#fa1a00] md:h-10 md:w-10">
            <User className="h-5 w-5" />
          </div>
          <div className="hidden text-sm sm:block">
            <p className="font-medium text-slate-700">Admin User</p>
            <p className="text-slate-500">Administrator</p>
          </div>
        </div>
      </div>
    </header>
  );
}
