import { Search, Filter, MoreHorizontal } from "lucide-react";

export default function Inquiries() {
  const inquiries = [
    {
      id: "INQ-1042",
      customer: "Alice Johnson",
      email: "alice.j@example.com",
      subject: "Question regarding bulk order pricing",
      date: "Oct 24, 2023",
      status: "New",
      priority: "High",
    },
    {
      id: "INQ-1041",
      customer: "Bob Smith",
      email: "bob.smith@company.com",
      subject: "Shipping delay for order #88492",
      date: "Oct 23, 2023",
      status: "In Progress",
      priority: "Medium",
    },
    {
      id: "INQ-1040",
      customer: "Charlie Davis",
      email: "cdavis@mail.net",
      subject: "Product dimensions clarification",
      date: "Oct 22, 2023",
      status: "Resolved",
      priority: "Low",
    },
    {
      id: "INQ-1039",
      customer: "Diana Prince",
      email: "diana.p@world.org",
      subject: "Request for custom integration",
      date: "Oct 21, 2023",
      status: "New",
      priority: "High",
    },
    {
      id: "INQ-1038",
      customer: "Evan Wright",
      email: "evan.w@startup.io",
      subject: "Refund request",
      date: "Oct 20, 2023",
      status: "Resolved",
      priority: "High",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-semibold text-slate-800">
            Customer Inquiries
          </h2>
          <p className="mt-1 text-slate-500">
            Manage and respond to customer questions and issues.
          </p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search inquiries..."
              className="w-full rounded-lg border border-slate-200 py-2 pr-4 pl-9 text-sm focus:ring-2 focus:ring-[#fa1a00] focus:outline-none sm:w-64"
            />
          </div>
          <button className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50">
            <Filter className="h-4 w-4" />
            Filter
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <ul className="divide-y divide-slate-100">
          {inquiries.map((inquiry) => (
            <li
              key={inquiry.id}
              className="group flex cursor-pointer flex-col gap-4 p-6 transition-colors hover:bg-slate-50 sm:flex-row sm:items-center"
            >
              <div className="flex-1">
                <div className="mb-1 flex items-center gap-3">
                  <span className="text-sm font-semibold text-slate-800">
                    {inquiry.customer}
                  </span>
                  <span className="text-xs text-slate-500">
                    {inquiry.email}
                  </span>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-400">
                    {inquiry.id}
                  </span>
                </div>
                <p className="text-base font-medium text-slate-700">
                  {inquiry.subject}
                </p>
              </div>

              <div className="mt-4 flex items-center gap-4 sm:mt-0 sm:gap-6">
                <div className="flex flex-col gap-2 sm:items-end">
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-md px-2 py-1 text-xs font-medium ${
                        inquiry.status === "New"
                          ? "bg-red-50 text-[#fa1a00]"
                          : inquiry.status === "In Progress"
                            ? "bg-amber-50 text-amber-700"
                            : "bg-emerald-50 text-emerald-700"
                      }`}
                    >
                      {inquiry.status}
                    </span>
                    <span
                      className={`rounded-md border px-2 py-1 text-xs font-medium ${
                        inquiry.priority === "High"
                          ? "border-red-200 bg-red-50 text-red-700"
                          : inquiry.priority === "Medium"
                            ? "border-amber-200 bg-amber-50 text-amber-700"
                            : "border-slate-200 bg-slate-50 text-slate-600"
                      }`}
                    >
                      {inquiry.priority}
                    </span>
                  </div>
                  <span className="text-xs whitespace-nowrap text-slate-500">
                    {inquiry.date}
                  </span>
                </div>
                <button className="rounded-lg p-2 text-slate-400 transition-colors group-hover:opacity-100 hover:bg-red-50 hover:text-[#fa1a00] sm:opacity-0">
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
