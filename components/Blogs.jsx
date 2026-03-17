import {
  FileText,
  MoreHorizontal,
  Edit2,
  Trash2,
  Plus,
  Leaf,
  Package,
  Shield,
  Zap,
  Star,
  Info,
  Calendar,
  Clock,
  Tag,
} from "lucide-react";
import { useState, useEffect } from "react";
import { db } from "../config/firebase";
import {
  collection,
  query,
  onSnapshot,
  orderBy,
  doc,
  deleteDoc,
} from "firebase/firestore";
import AddBlogModal from "./AddBlogModal";

const ICON_MAP = {
  Leaf: Leaf,
  Package: Package,
  Shield: Shield,
  Zap: Zap,
  Star: Star,
  Info: Info,
};

export default function Blogs() {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);

  useEffect(() => {
    const q = query(collection(db, "blogs"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const posts = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setBlogPosts(posts);
        setLoading(false);
      },
      (err) => {
        console.error("Firestore error:", err);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  const handleEdit = (post) => {
    setEditingPost(post);
    setIsModalOpen(true);
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        await deleteDoc(doc(db, "blogs", id));
        alert("Post deleted successfully!");
      } catch (err) {
        console.error("Error deleting post:", err);
        alert("Failed to delete post.");
      }
    }
  };

  const renderIcon = (iconName) => {
    const IconComponent = ICON_MAP[iconName] || FileText;
    return <IconComponent size={16} />;
  };

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
        <button
          onClick={() => {
            setEditingPost(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 rounded-lg bg-[#fa1a00] px-4 py-2 font-medium text-white shadow-sm transition-colors hover:bg-[#d41600]"
        >
          <Plus size={18} />
          Create New Post
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-sm font-medium text-slate-500">
                <th className="px-6 py-4">Image</th>
                <th className="px-6 py-4">Title & Excerpt</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-2">
                      <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#fa1a00]" />
                      <span>Loading posts...</span>
                    </div>
                  </td>
                </tr>
              ) : blogPosts.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-2">
                      <FileText size={40} className="text-slate-200" />
                      <span>No blog posts found.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                blogPosts.map((post) => (
                  <tr
                    key={post.id}
                    className="group transition-colors hover:bg-slate-50"
                  >
                    <td className="px-6 py-4">
                      <div className="h-12 w-16 overflow-hidden rounded-lg border border-slate-100 bg-slate-50">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-md">
                        <div className="font-bold text-slate-800 line-clamp-1">
                          {post.title}
                        </div>
                        <div className="mt-0.5 text-xs text-slate-500 line-clamp-1">
                          {post.excerpt}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div
                          className={`flex h-6 w-6 items-center justify-center rounded bg-gradient-to-br ${post.color} text-white`}
                        >
                          {renderIcon(post.iconName)}
                        </div>
                        <span className="text-sm font-medium text-slate-600">
                          {post.category}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col text-xs text-slate-500">
                        <div className="flex items-center gap-1 font-medium text-slate-700">
                          <Calendar size={12} />
                          {post.date}
                        </div>
                        <div className="mt-1 flex items-center gap-1">
                          <Clock size={12} />
                          {post.readTime}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                        <button
                          onClick={() => handleEdit(post)}
                          className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-slate-50 hover:text-[#fa1a00]"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(post.id, post.title)}
                          className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!loading && blogPosts.length > 0 && (
          <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-4 text-sm text-slate-500">
            <span>Showing {blogPosts.length} entries</span>
          </div>
        )}
      </div>

      <AddBlogModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        post={editingPost}
      />
    </div>
  );
}
