"use client";

import { SearchIcon } from "@/assets/icons";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useSidebarContext } from "../sidebar/sidebar-context";
import { MenuIcon } from "./icons";
import { Notification } from "./notification";
// Theme toggle removed - using light theme only
import { UserInfo } from "./user-info";
import { ReportThreatModal } from "@/components/dashboard/ReportThreatModal";

export function Header() {
  const { toggleSidebar, isMobile } = useSidebarContext();
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-200 bg-white/95 backdrop-blur-sm px-4 py-5 shadow-sm md:px-5 2xl:px-10">
      <button
        onClick={toggleSidebar}
        className="rounded-lg border border-slate-300 px-1.5 py-1 bg-white hover:bg-slate-50 lg:hidden"
      >
        <MenuIcon />
        <span className="sr-only">Toggle Sidebar</span>
      </button>

      {isMobile && (
        <Link href={"/"} className="ml-2 max-[430px]:hidden min-[375px]:ml-4">
          <Image
            src={"/images/logo/logo-icon.svg"}
            width={32}
            height={32}
            alt=""
            role="presentation"
          />
        </Link>
      )}

      <div className="flex flex-1 items-center justify-between">
        {/* Left spacer for mobile button when hidden on desktop */}
        <div className="w-0 lg:w-0"></div>
        
        {/* Centered Dashboard Title and Actions - Single Line */}
        <div className="flex items-center justify-center flex-1 space-x-8 max-xl:hidden">
          {/* Dashboard Title with Coastal Theme */}
          <div className="text-center">
            <h1 className="text-2xl font-bold text-blue-700">
              WaveGuard Dashboard 🌊
            </h1>
            <p className="text-xs text-blue-600 font-medium opacity-80 -mt-1">
              Coastal Protection & Monitoring System
            </p>
          </div>
          
          {/* Quick Actions */}
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setIsReportModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 shadow-sm"
            >
              🚨 Report Threat
            </button>
            <Link
              href="/dashboard/analytics"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 shadow-sm"
            >
              📊 Analytics
            </Link>
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4">
          <Notification />
          <div className="shrink-0">
            <UserInfo />
          </div>
        </div>
      </div>
      
      {/* Modal */}
      <ReportThreatModal 
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />
    </header>
  );
}
