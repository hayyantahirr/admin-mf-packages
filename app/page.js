"use client";

import Header from "@/components/Header";
import Inquiries from "@/components/Inquiries";
import Overview from "@/components/Overview";
import ProductManagement from "@/components/ProductManagement";
import Sidebar from "@/components/Sidebar";
import { useState } from "react";


export default function Home() {
  const [activeTab, setActiveTab] = useState("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
      />
      <div className="flex-1 lg:ml-64 flex flex-col min-w-0 overflow-hidden">
        <Header setIsOpen={setIsSidebarOpen} />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            {activeTab === "overview" && <Overview />}
            {activeTab === "products" && <ProductManagement />}
            {activeTab === "inquiries" && <Inquiries />}
          </div>
        </main>
      </div>
    </div>
  );
}
