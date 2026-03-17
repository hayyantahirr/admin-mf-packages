import { MoreVertical, Edit2, Trash2, Plus } from "lucide-react";
import { useState } from "react";
import AddProductModal from "./AddProductModal";

export default function ProductManagement() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const products = [
    {
      id: 1,
      name: "Premium Wireless Headphones",
      sku: "AUD-WH-001",
      price: "$299.00",
      stock: 124,
      status: "Active",
    },
    {
      id: 2,
      name: "Ergonomic Office Chair",
      sku: "FUR-OC-042",
      price: "$199.50",
      stock: 56,
      status: "Active",
    },
    {
      id: 3,
      name: "Mechanical Keyboard",
      sku: "ACC-MK-018",
      price: "$149.99",
      stock: 0,
      status: "Out of Stock",
    },
    {
      id: 4,
      name: "4K Monitor 27-inch",
      sku: "DIS-4K-099",
      price: "$349.00",
      stock: 32,
      status: "Active",
    },
    {
      id: 5,
      name: "USB-C Hub Multiport",
      sku: "ACC-UH-005",
      price: "$45.00",
      stock: 210,
      status: "Active",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <h2 className="text-2xl font-semibold text-slate-800">
            Product Management
          </h2>
          <p className="mt-1 text-slate-500">
            Manage your inventory, pricing, and product status.
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-[#fa1a00] px-4 py-2 font-medium text-white shadow-sm transition-colors hover:bg-red-700"
        >
          <Plus size={18} />
          Add New Product
        </button>
      </div>

      <div className="auto-cols-auto overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-sm font-medium text-slate-500">
                <th className="px-6 py-4 whitespace-nowrap">Product Name</th>
                <th className="px-6 py-4 whitespace-nowrap">SKU</th>
                <th className="px-6 py-4 whitespace-nowrap">Price</th>
                <th className="px-6 py-4 whitespace-nowrap">Stock</th>
                <th className="px-6 py-4 whitespace-nowrap">Status</th>
                <th className="px-6 py-4 text-right whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="group transition-colors hover:bg-slate-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-slate-800">
                      {product.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm whitespace-nowrap text-slate-500">
                    {product.sku}
                  </td>
                  <td className="px-6 py-4 font-medium whitespace-nowrap text-slate-800">
                    {product.price}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-slate-500">
                    {product.stock}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        product.status === "Active"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                      <button className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-[#fa1a00]/10 hover:text-[#fa1a00]">
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
          <span>Showing 1 to 5 of 5 entries</span>
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

      <AddProductModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}
