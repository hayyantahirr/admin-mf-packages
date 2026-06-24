"use client";

import Header from "@/components/Header";
import Inquiries from "@/components/Inquiries";
import Overview from "@/components/Overview";
import ProductManagement from "@/components/ProductManagement";
import Blogs from "@/components/Blogs";
import Sidebar from "@/components/Sidebar";
import OrdersDashboard from "@/components/OrdersDashboard";
import ProtectedRoute from "@/components/ProtectedRoute";
import NotificationManager from "@/components/NotificationManager";
import { useState } from "react";

export default function Home() {
  const [activeTab, setActiveTab] = useState("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <ProtectedRoute>
      <NotificationManager />
      <div className="flex h-screen bg-[#F8FAFC]">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
        />
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden lg:ml-64">
          <Header setIsOpen={setIsSidebarOpen} />
          <main className="flex-1 overflow-y-auto p-4 md:p-8">
            <div className="mx-auto max-w-7xl">
              {activeTab === "overview" && <Overview onNavigate={setActiveTab} />}
              {activeTab === "products" && <ProductManagement />}
              {activeTab === "blogs" && <Blogs />}
              {activeTab === "orders" && <OrdersDashboard />}
              {activeTab === "inquiries" && <Inquiries />}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
