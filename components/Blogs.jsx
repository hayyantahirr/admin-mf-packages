import { FileText, MoreHorizontal, Edit2, Trash2, Plus } from "lucide-react";

export default function Blogs() {
  const blogPosts = [
    {
      id: 1,
      title: "10 Tips for Better Product Management",
      author: "Sarah Jenkins",
      date: "Oct 24, 2023",
      status: "Published",
      views: "1.2k",
    },

    {
      id: 2,
      title: "Understanding Customer Inquiries",
      author: "Mike Ross",
      date: "Oct 22, 2023",
      status: "Draft",
      views: "0",
    },
    {
      id: 3,
      title: "The Future of MF-Packages",
      author: "Elena Gilbert",
      date: "Oct 20, 2023",
      status: "Published",
      views: "856",
    },
    {
      id: 4,
      title: "Optimizing Your Admin Dashboard",
      author: "Admin",
      date: "Oct 18, 2023",
      status: "Published",
      views: "2.5k",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <h2 className="text-2xl font-semibold text-slate-800">
            Blog Management
          </h2>
          <p className="mt-1 text-slate-500">
            Create, edit, and manage your website articles.
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-[#fa1a00] px-4 py-2 font-medium text-white shadow-sm transition-colors hover:bg-[#d41600]">
          <Plus size={18} />
          Create New Post
        </button>
      </div>

      <div className="auto-cols-auto overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-sm font-medium text-slate-500">
                <th className="px-6 py-4 whitespace-nowrap">Title</th>
                <th className="px-6 py-4 whitespace-nowrap">Author</th>
                <th className="px-6 py-4 whitespace-nowrap">Date</th>
                <th className="px-6 py-4 whitespace-nowrap">Status</th>
                <th className="px-6 py-4 whitespace-nowrap">Views</th>
                <th className="px-6 py-4 text-right whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {blogPosts.map((post) => (
                <tr
                  key={post.id}
                  className="group transition-colors hover:bg-slate-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="max-w-xs truncate font-medium text-slate-800">
                      {post.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm whitespace-nowrap text-slate-500">
                    {post.author}
                  </td>
                  <td className="px-6 py-4 text-sm whitespace-nowrap text-slate-500">
                    {post.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        post.status === "Published"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-slate-100 text-slate-800"
                      }`}
                    >
                      {post.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm whitespace-nowrap text-slate-500">
                    {post.views}
                  </td>
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                      <button className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-[#fa1a00]">
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination placeholder */}
        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-4 text-sm text-slate-500">
          <span>Showing 1 to 4 of 4 entries</span>
          <div className="flex gap-1">
            <button className="cursor-not-allowed rounded border border-slate-200 bg-white px-3 py-1 text-slate-400">
              Previous
            </button>
            <button className="rounded border border-[#fa1a00] bg-[#fa1a00] px-3 py-1 text-white">
              1
            </button>
            <button className="cursor-not-allowed rounded border border-slate-200 bg-white px-3 py-1 text-slate-400">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
