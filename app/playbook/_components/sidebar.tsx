"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  LayoutDashboard,
  User,
  Settings,
  Home,
  BarChart3,
  Info,
  Users,
} from "lucide-react";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const playbookNavItems = [
    {
      name: "Details",
      icon: Info,
      href: "/playbook/details",
      description: "Playbook information",
    },
    {
      name: "Sequence",
      icon: BarChart3,
      href: "/playbook/sequence",
      description: "View playbook workflow",
    },
    {
      name: "Roles",
      icon: Users,
      href: "/playbook/roles",
      description: "Team roles and responsibilities",
    },
  ];

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div className="relative">
      {/* Mobile Hamburger Button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors duration-200 shadow-lg"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity duration-300"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-20 left-0 h-full bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-r border-slate-700 transition-all duration-300 ease-in-out z-40 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:w-20 w-64 shadow-2xl`}
      >
        {/* Playbook Navigation Section */}
        <div className="mt-8 px-4">
          <div className="border-t border-slate-700 pt-4">
            <div className="space-y-2">
              {playbookNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`w-full flex items-center justify-center px-4 py-3 rounded-lg transition-all duration-200 group ${
                      isActive
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                        : "text-slate-300 hover:bg-slate-700 hover:text-white"
                    }`}
                    title={item.name}
                  >
                    <Icon
                      size={20}
                      className={`transition-colors duration-200 ${
                        isActive
                          ? "text-white"
                          : "text-slate-400 group-hover:text-white"
                      }`}
                    />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
