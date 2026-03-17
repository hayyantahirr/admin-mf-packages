import { MoreVertical, Edit2, Trash2 } from "lucide-react";

export default function ProductManagement() {
  const products = [
    { id: 1, name: "Premium Wireless Headphones", sku: "AUD-WH-001", price: "$299.00", stock: 124, status: "Active" },
    { id: 2, name: "Ergonomic Office Chair", sku: "FUR-OC-042", price: "$199.50", stock: 56, status: "Active" },
    { id: 3, name: "Mechanical Keyboard", sku: "ACC-MK-018", price: "$149.99", stock: 0, status: "Out of Stock" },
    { id: 4, name: "4K Monitor 27-inch", sku: "DIS-4K-099", price: "$349.00", stock: 32, status: "Active" },
    { id: 5, name: "USB-C Hub Multiport", sku: "ACC-UH-005", price: "$45.00", stock: 210, status: "Active" },
  ];








  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-2xl font-semibold text-slate-800">Product Management</h2>
          <p className="text-slate-500 mt-1">Manage your inventory, pricing, and product status.</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm">
          Add New Product
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden auto-cols-auto">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-sm font-medium text-slate-500">
                <th className="px-6 py-4 whitespace-nowrap">Product Name</th>
                <th className="px-6 py-4 whitespace-nowrap">SKU</th>
                <th className="px-6 py-4 whitespace-nowrap">Price</th>
                <th className="px-6 py-4 whitespace-nowrap">Stock</th>
                <th className="px-6 py-4 whitespace-nowrap">Status</th>
                <th className="px-6 py-4 whitespace-nowrap text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-slate-800">{product.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-slate-500 text-sm">{product.sku}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-slate-800 font-medium">{product.price}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-slate-500">{product.stock}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        product.status === "Active"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-md hover:bg-indigo-50 transition-colors">
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
            <span>Showing 1 to 5 of 5 entries</span>
            <div className="flex gap-1">
                <button className="px-3 py-1 border border-slate-200 rounded bg-white text-slate-400 cursor-not-allowed">Previous</button>
                <button className="px-3 py-1 border border-indigo-600 rounded bg-indigo-600 text-white">1</button>
                <button className="px-3 py-1 border border-slate-200 rounded bg-white text-slate-400 cursor-not-allowed">Next</button>
            </div>
        </div>
      </div>
    </div>
  );
}
