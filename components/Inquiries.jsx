import {
  Search,
  Filter,
  MoreHorizontal,
  User,
  Mail,
  MessageSquare,
  Clock,
  Phone,
  Trash2,
  Check,
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
  updateDoc,
} from "firebase/firestore";

export default function Inquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // We'll try "contacts" first since the user manually changed it,
    // but we'll add diagnostic logging.
    const q = query(collection(db, "contacts"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (snapshot.empty) {
          console.log("No documents found in 'contacts' collection.");
          // If "contacts" is empty, maybe try "contact"?
          // For now, just let it be empty and report it.
        }

        const inquiryList = snapshot.docs.map((doc) => {
          const data = doc.data();
          console.log("Inquiry Data:", data); // For debugging field names
          return {
            id: doc.id,
            ...data,
          };
        });
        setInquiries(inquiryList);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Firestore Error:", err);
        setError(err.message);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  const handleDelete = async (e, inquiryId, customerName) => {
    e.stopPropagation();
    const confirmDelete = window.confirm(
      `Are you sure you want to delete the inquiry from "${customerName}"?`,
    );

    if (confirmDelete) {
      try {
        await deleteDoc(doc(db, "contacts", inquiryId));
      } catch (err) {
        console.error("Error deleting inquiry:", err);
        alert("Failed to delete inquiry. Please try again.");
      }
    }
  };

  const handleStatusChange = async (inquiryId, status) => {
    try {
      await updateDoc(doc(db, "contacts", inquiryId), {
        isSeen: status === "seen",
      });
    } catch (err) {
      console.error("Error updating inquiry status:", err);
    }
  };

  const filteredInquiries = inquiries.filter((inquiry) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      inquiry.name?.toLowerCase().includes(searchLower) ||
      inquiry.email?.toLowerCase().includes(searchLower) ||
      inquiry.subject?.toLowerCase().includes(searchLower)
    );
  });

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-semibold text-slate-800">
            Customer Inquiries
          </h2>
          <p className="mt-1 text-slate-500">
            Manage and respond to customer messages from the website.
          </p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-slate-200 py-2 pr-4 pl-9 text-sm focus:ring-2 focus:ring-[#fa1a00] focus:outline-none focus:border-[#fa1a00] sm:w-64"
            />
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600">
            <span className="font-bold text-[#fa1a00]">{inquiries.length}</span>{" "}
            Total
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          <div className="flex items-center gap-2 font-bold">
            <span>Firestore Error:</span>
          </div>
          <p className="mt-1 text-sm">{error}</p>
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <ul className="divide-y divide-slate-100">
          {loading ? (
            <li className="p-12 text-center text-slate-400">
              <div className="flex flex-col items-center gap-2">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#fa1a00]" />
                <span>Loading inquiries...</span>
              </div>
            </li>
          ) : inquiries.length === 0 ? (
            <li className="p-12 text-center text-slate-400">
              <div className="flex flex-col items-center gap-2">
                <MessageSquare size={40} className="text-slate-200" />
                <span>
                  No inquiries found in collection "contacts".
                  <br />
                  <span className="text-xs">
                    Check if you should use singular "contact" instead.
                  </span>
                </span>
              </div>
            </li>
          ) : filteredInquiries.length === 0 ? (
            <li className="p-12 text-center text-slate-400">
              <div className="flex flex-col items-center gap-2">
                <Search size={40} className="text-slate-200" />
                <span>No inquiries match your search.</span>
              </div>
            </li>
          ) : (
            filteredInquiries.map((inquiry) => (
              <li
                key={inquiry.id}
                className="group flex flex-col gap-4 p-6 transition-colors hover:bg-slate-50 sm:flex-row sm:items-start"
              >
                <div className="flex-1 space-y-3">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                      <User size={16} className="text-slate-400" />
                      {inquiry.name}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Mail size={14} className="text-slate-400" />
                      {inquiry.email}
                    </div>
                    {inquiry.phone && (
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Phone size={14} className="text-slate-400" />
                        {inquiry.phone}
                      </div>
                    )}
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-mono text-slate-400">
                      {inquiry.id.slice(0, 8).toUpperCase()}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-700">
                      {inquiry.subject || "No Subject"}
                    </h4>
                    <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                      {inquiry.message}
                    </p>
                  </div>

                  {/* Contact Buttons */}
                  <div className="flex flex-wrap gap-2 pt-1 opacity-100 sm:opacity-0 transition-opacity group-hover:opacity-100">
                    <a
                      href={`mailto:${inquiry.email}`}
                      className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-[#fa1a00] transition-colors hover:bg-red-100"
                    >
                      <Mail size={14} />
                      Email Back
                    </a>
                    {inquiry.phone && (
                      <a
                        href={`tel:${inquiry.phone}`}
                        className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 transition-colors hover:bg-emerald-100"
                      >
                        <Phone size={14} />
                        Call Now
                      </a>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex shrink-0 flex-col gap-3 sm:mt-0 sm:items-end">
                  <div className="flex flex-wrap items-center gap-2">
                    {inquiry.isSeen !== true && (
                      <span className="rounded-md bg-red-600 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white animate-pulse">
                        New
                      </span>
                    )}
                    <div className="flex items-center gap-2">
                      <select
                        value={inquiry.isSeen === true ? "seen" : "unseen"}
                        onChange={(e) => handleStatusChange(inquiry.id, e.target.value)}
                        className={`rounded-lg border px-2.5 py-1.5 text-xs font-black uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-[#fa1a00] transition-colors cursor-pointer ${
                          inquiry.isSeen === true
                            ? "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100/70"
                            : "bg-red-50 border-red-200 text-[#fa1a00] hover:bg-red-100/70"
                        }`}
                      >
                        <option value="unseen">Unseen</option>
                        <option value="seen">Seen</option>
                      </select>
                      <button
                        onClick={(e) => handleDelete(e, inquiry.id, inquiry.name)}
                        title="Delete Inquiry"
                        className="rounded-lg bg-red-50 p-1.5 text-red-600 transition-colors hover:bg-[#fa1a00]/10 hover:text-[#fa1a00]"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold uppercase tracking-tight">
                    <Clock size={14} />
                    {formatDate(inquiry.createdAt)}
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
