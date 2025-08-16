"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import { useAnalyze } from "@/context/AnalyzeContext";

const menuOptionsBeforeLogin = [
  { name: "Home", href: "/" },
  { name: "Pricing", href: "/pricing" },
  { name: "Contact", href: "/contact" },
];

const menuOptionsAfterLogin = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "My Playbooks", href: "/playbooks" },
  { name: "My Initiatives", href: "/initiatives" },
  { name: "Public Library", href: "/library" },
];

function Header() {
  const { user, isLoaded } = useUser();
  const { clearData } = useAnalyze();

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center py-4 px-8 bg-primary-foreground">
      <Link href="/">
        <div className="flex gap-2 items-center">
          <Image src="/12.svg" alt="Logo" width={30} height={30} style={{ width: "60px", height: "60px" }} />
          <h2 className="font-bold text-2xl text-gradient">
            Makebooks
          </h2>
        </div>
      </Link>
      <div className="flex gap-8 items-center">
        {!user
          ? menuOptionsBeforeLogin.map((option, index) => (
              <Link key={index} href={option.href}>
                <h2 className="text-lg hover:scale-105 hover:text-primary transition-all duration-300">
                  {option.name}
                </h2>
              </Link>
            ))
          : menuOptionsAfterLogin.map((option, index) => (
              <Link key={index} href={option.href}>
                <h2 className="text-lg hover:scale-105 hover:text-primary transition-all duration-300">
                  {option.name}
                </h2>
              </Link>
            ))}
      </div>
      {!isLoaded ? null : !user ? (
        <SignInButton mode="modal">
          <button className="bg-primary text-white rounded-md px-4 py-2 font-bold transition-all duration-300 hover:scale-105">
            Get Started
          </button>
        </SignInButton>
      ) : (
        <div className="flex items-center gap-4">
          <Link href="/create-new-playbook" onClick={clearData}>
            <button className="bg-primary text-white rounded-md px-4 py-2 font-bold transition-all duration-300 hover:scale-105">
              New Playbook
            </button>
          </Link>
          <UserButton />
        </div>
      )}
    </div>
  );
}

export default Header;
