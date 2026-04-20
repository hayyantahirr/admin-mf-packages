import { Edit2, Trash2, Plus, Package, Search, Copy } from "lucide-react";
import { useState, useEffect } from "react";
import AddProductModal from "./AddProductModal";
import ProductDetailsModal from "./ProductDetailsModal";
import { db } from "../config/firebase";
import {
  collection,
  query,
  onSnapshot,
  orderBy,
  doc,
  deleteDoc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

export default function ProductManagement() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const q = query(collection(db, "products"), orderBy("name", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const productList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.size?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Pagination Logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const handleEdit = (e, product) => {
    e.stopPropagation();
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleRowClick = (product) => {
    setSelectedProduct(product);
    setIsDetailsModalOpen(true);
  };

  const handleDelete = async (e, productId, productName) => {
    e.stopPropagation(); // Prevent opening the details modal

    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${productName}"? This action cannot be undone.`,
    );

    if (confirmDelete) {
      try {
        await deleteDoc(doc(db, "products", productId));
        // No need to manually update state as onSnapshot will handle it
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Failed to delete product. Please try again.");
      }
    }
  };

  const handleDuplicate = async (e, product) => {
    e.stopPropagation();

    // Create a new product object by spreading the original.
    // Using object spreading for the top-level ensures we clone primitives,
    // but nested maps like technicalSpecs, capacitySpecs, and materialStructure
    // must be explicitly spread to perform a shallow copy of their contents,
    // avoiding shared references that could lead to side effects during editing.
    const duplicateData = {
      ...product,
      name: `${product.name} (Copy)`,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      // Deep-copy nested objects to ensure the new product is independent
      technicalSpecs: product.technicalSpecs ? { ...product.technicalSpecs } : {},
      capacitySpecs: product.capacitySpecs ? { ...product.capacitySpecs } : {},
      materialStructure: product.materialStructure
        ? { ...product.materialStructure }
        : {},
      tieredPrices: product.tieredPrices ? { ...product.tieredPrices } : null,
      extraImages: product.extraImages ? [...product.extraImages] : [],
    };

    // Remove the Firestore ID from the data object so a new one is generated
    delete duplicateData.id;

    try {
      const docRef = await addDoc(collection(db, "products"), duplicateData);

      // Construct a full product object for the modal to use immediately
      const newProduct = {
        id: docRef.id,
        ...duplicateData,
      };

      // Automatically open the Edit Modal for the newly created "Copy"
      setSelectedProduct(newProduct);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error duplicating product:", error);
      alert("Failed to duplicate product. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <h2 className="text-2xl font-semibold text-slate-800">
            Product Management
          </h2>
          <p className="mt-1 text-slate-500">
            Manage your inventory, pricing, and product details.
          </p>
        </div>
        <button
          onClick={() => {
            setSelectedProduct(null);
            setIsModalOpen(true);
          }}
          className="flex items-center justify-center gap-2 rounded-lg bg-[#fa1a00] px-6 py-2.5 font-semibold text-white shadow-lg shadow-red-500/20 transition-all hover:bg-red-700 active:scale-95"
        >
          <Plus size={18} />
          Add New Product
        </button>
      </div>

      {/* Stats & Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative md:col-span-2">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search products by name , size or category ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-slate-800 outline-none transition-all focus:border-[#fa1a00] focus:ring-1 focus:ring-[#fa1a00]"
          />
        </div>
        <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-6 py-2.5 shadow-sm text-sm">
          <span className="text-slate-500">Total Products:</span>
          <span className="font-bold text-[#0b3a4c]">{products.length}</span>
        </div>
      </div>

      {/* Products Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4">Size</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-12 text-center text-slate-400"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#fa1a00]" />
                      <span>Loading products...</span>
                    </div>
                  </td>
                </tr>
              ) : paginatedProducts.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-12 text-center text-slate-400"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Package size={40} className="text-slate-200" />
                      <span>
                        {searchTerm
                          ? "No products match your search."
                          : "No products found."}
                      </span>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((product) => (
                  <tr
                    key={product.id}
                    onClick={() => handleRowClick(product)}
                    className="group cursor-pointer transition-colors hover:bg-slate-50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-slate-100 bg-slate-50">
                          {product.mainImage ? (
                            <img
                              src={product.mainImage}
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-slate-300">
                              <Package size={20} />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-800">
                            {product.name}
                          </div>
                          <div className="text-xs text-slate-400">
                            ID: {product.id.slice(0, 8)}...
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                        {product.category || "Uncategorized"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-800">
                        {product.useTieredPricing ? (
                          <div className="flex flex-col">
                            <span className="text-[10px] font-black text-[#fa1a00] uppercase tracking-widest">
                              Manual Tiered
                            </span>
                            <span>
                              Rs.{" "}
                              {product.tieredPrices?.[100]?.toLocaleString() ||
                                product.tieredPrices?.["100"]?.toLocaleString()}
                            </span>
                          </div>
                        ) : (
                          `Rs. ${product.price?.toLocaleString() || "0"}`
                        )}
                      </div>
                      {product.printingPrice && (
                        <div className="text-[10px] text-slate-400">
                          Print: Rs. {product.printingPrice}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`h-2 w-2 rounded-full ${product.inStock ? "bg-emerald-500" : "bg-red-500"}`}
                        />
                        <span className="text-sm font-medium text-slate-700">
                          {product.stockAmount || 0}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-black font-bold">
                      {product.size || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          title="Duplicate Product"
                          onClick={(e) => handleDuplicate(e, product)}
                          className="rounded-lg p-2 text-slate-400 transition-all hover:bg-[#0b3a4c]/10 hover:text-[#0b3a4c]"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                        <button
                          title="Edit Product"
                          onClick={(e) => handleEdit(e, product)}
                          className="rounded-lg p-2 text-slate-400 transition-all hover:bg-[#0b3a4c]/10 hover:text-[#0b3a4c]"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          title="Delete Product"
                          onClick={(e) =>
                            handleDelete(e, product.id, product.name)
                          }
                          className="rounded-lg p-2 text-slate-400 transition-all hover:bg-red-50 hover:text-red-600"
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

        {/* Footer/Summary */}
        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-4 text-xs font-medium text-slate-500">
          <span>
            {loading
              ? "..."
              : `Showing ${startIndex + 1} to ${Math.min(startIndex + itemsPerPage, filteredProducts.length)} of ${filteredProducts.length} products`}
          </span>
          <div className="flex gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className={`rounded-md border border-slate-200 bg-white px-3 py-1 transition-all ${
                currentPage === 1
                  ? "cursor-not-allowed text-slate-300"
                  : "hover:border-[#fa1a00] hover:text-[#fa1a00] text-slate-600"
              }`}
            >
              Previous
            </button>
            <button
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className={`rounded-md border border-slate-200 bg-white px-3 py-1 transition-all ${
                currentPage === totalPages || totalPages === 0
                  ? "cursor-not-allowed text-slate-300"
                  : "hover:border-[#fa1a00] hover:text-[#fa1a00] text-slate-600"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <AddProductModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProduct(null);
        }}
        product={selectedProduct}
      />

      <ProductDetailsModal
        product={selectedProduct}
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedProduct(null);
        }}
      />
    </div>
  );
}
