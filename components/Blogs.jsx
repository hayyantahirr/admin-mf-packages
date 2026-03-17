import { FileText, MoreHorizontal, Edit2, Trash2, Plus } from "lucide-react";

export default function Blogs() {
  const blogPosts = [
    { 
      id: 1, 
      title: "10 Tips for Better Product Management", 
      author: "Sarah Jenkins", 
      date: "Oct 24, 2023", 
      status: "Published", 
      views: "1.2k" 
    },
    { 
      id: 2, 
      title: "Understanding Customer Inquiries", 
      author: "Mike Ross", 
      date: "Oct 22, 2023", 
      status: "Draft", 
      views: "0" 
    },
    { 
      id: 3, 
      title: "The Future of MF-Packages", 
      author: "Elena Gilbert", 
      date: "Oct 20, 2023", 
      status: "Published", 
      views: "856" 
    },
    { 
      id: 4, 
      title: "Optimizing Your Admin Dashboard", 
      author: "Admin", 
      date: "Oct 18, 2023", 
      status: "Published", 
      views: "2.5k" 
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-2xl font-semibold text-slate-800">Blog Management</h2>
          <p className="text-slate-500 mt-1">Create, edit, and manage your website articles.</p>
        </div>
        <button className="bg-[#fa1a00] hover:bg-[#d41600] text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm flex items-center gap-2">
          <Plus size={18} />
          Create New Post
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden auto-cols-auto">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-sm font-medium text-slate-500">
                <th className="px-6 py-4 whitespace-nowrap">Title</th>
                <th className="px-6 py-4 whitespace-nowrap">Author</th>
                <th className="px-6 py-4 whitespace-nowrap">Date</th>
                <th className="px-6 py-4 whitespace-nowrap">Status</th>
                <th className="px-6 py-4 whitespace-nowrap">Views</th>
                <th className="px-6 py-4 whitespace-nowrap text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {blogPosts.map((post) => (
                <tr key={post.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-slate-800 max-w-xs truncate">{post.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-slate-500 text-sm">{post.author}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-slate-500 text-sm">{post.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        post.status === "Published"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-slate-100 text-slate-800"
                      }`}
                    >
                      {post.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-slate-500 text-sm">{post.views}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 text-slate-400 hover:text-[#fa1a00] rounded-md hover:bg-red-50 transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination placeholder */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-sm text-slate-500">
            <span>Showing 1 to 4 of 4 entries</span>
            <div className="flex gap-1">
                <button className="px-3 py-1 border border-slate-200 rounded bg-white text-slate-400 cursor-not-allowed">Previous</button>
                <button className="px-3 py-1 border border-[#fa1a00] rounded bg-[#fa1a00] text-white">1</button>
                <button className="px-3 py-1 border border-slate-200 rounded bg-white text-slate-400 cursor-not-allowed">Next</button>
            </div>
        </div>
      </div>
    </div>
  );
}
