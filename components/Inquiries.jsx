import { Search, Filter, MoreHorizontal } from "lucide-react";

export default function Inquiries() {
  const inquiries = [
    { id: "INQ-1042", customer: "Alice Johnson", email: "alice.j@example.com", subject: "Question regarding bulk order pricing", date: "Oct 24, 2023", status: "New", priority: "High" },
    { id: "INQ-1041", customer: "Bob Smith", email: "bob.smith@company.com", subject: "Shipping delay for order #88492", date: "Oct 23, 2023", status: "In Progress", priority: "Medium" },
    { id: "INQ-1040", customer: "Charlie Davis", email: "cdavis@mail.net", subject: "Product dimensions clarification", date: "Oct 22, 2023", status: "Resolved", priority: "Low" },
    { id: "INQ-1039", customer: "Diana Prince", email: "diana.p@world.org", subject: "Request for custom integration", date: "Oct 21, 2023", status: "New", priority: "High" },
    { id: "INQ-1038", customer: "Evan Wright", email: "evan.w@startup.io", subject: "Refund request", date: "Oct 20, 2023", status: "Resolved", priority: "High" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-2xl font-semibold text-slate-800">Customer Inquiries</h2>
          <p className="text-slate-500 mt-1">Manage and respond to customer questions and issues.</p>
        </div>
        <div className="flex gap-3">
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input 
                    type="text" 
                    placeholder="Search inquiries..." 
                    className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#fa1a00] w-full sm:w-64"
                />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                <Filter className="h-4 w-4" />
                Filter
            </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <ul className="divide-y divide-slate-100">
            {inquiries.map((inquiry) => (
                <li key={inquiry.id} className="p-6 hover:bg-slate-50 transition-colors cursor-pointer group flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                            <span className="text-sm font-semibold text-slate-800">{inquiry.customer}</span>
                            <span className="text-xs text-slate-500">{inquiry.email}</span>
                            <span className="text-xs text-slate-400 px-2 py-0.5 bg-slate-100 rounded-full">{inquiry.id}</span>
                        </div>
                        <p className="text-base text-slate-700 font-medium">{inquiry.subject}</p>
                    </div>
                    
                    <div className="flex items-center gap-4 sm:gap-6 mt-4 sm:mt-0">
                        <div className="flex flex-col sm:items-end gap-2">
                             <div className="flex items-center gap-2">
                                <span className={`text-xs px-2 py-1 rounded-md font-medium ${
                                    inquiry.status === "New" ? "bg-red-50 text-[#fa1a00]" :
                                    inquiry.status === "In Progress" ? "bg-amber-50 text-amber-700" :
                                    "bg-emerald-50 text-emerald-700"
                                }`}>
                                    {inquiry.status}
                                </span>
                                 <span className={`text-xs px-2 py-1 rounded-md font-medium border ${
                                     inquiry.priority === "High" ? "border-red-200 text-red-700 bg-red-50" :
                                     inquiry.priority === "Medium" ? "border-amber-200 text-amber-700 bg-amber-50" :
                                     "border-slate-200 text-slate-600 bg-slate-50"
                                 }`}>
                                     {inquiry.priority}
                                 </span>
                             </div>
                            <span className="text-xs text-slate-500 whitespace-nowrap">{inquiry.date}</span>
                        </div>
                        <button className="p-2 text-slate-400 hover:text-[#fa1a00] hover:bg-red-50 rounded-lg transition-colors sm:opacity-0 group-hover:opacity-100">
                            <MoreHorizontal className="h-5 w-5" />
                        </button>
                    </div>
                </li>
            ))}
        </ul>
      </div>
    </div>
  );
}
