"use client";

import { ChevronUpIcon } from "@/assets/icons";
import {
  Dropdown,
  DropdownContent,
  DropdownTrigger,
} from "@/components/ui/dropdown";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { logOut } from "@/lib/firebase";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { LogOutIcon, SettingsIcon, UserIcon } from "./icons";

export function UserInfo() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, userProfile, loading } = useAuth();

  const handleLogout = async () => {
    try {
      await logOut();
      setIsOpen(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="size-12 bg-gray-200 rounded-full"></div>
      </div>
    );
  }

  // Show auth buttons when not logged in
  if (!user || !userProfile) {
    return (
      <div className="flex items-center space-x-3">
        <Link
          href="/auth?mode=signin"
          className="px-4 py-2 text-slate-700 hover:text-blue-600 font-medium transition-colors"
        >
          Sign In
        </Link>
        <Link
          href="/auth?mode=signup"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-sm"
        >
          Sign Up
        </Link>
      </div>
    );
  }

  // Show user profile when logged in
  const displayName = userProfile.first_name && userProfile.last_name 
    ? `${userProfile.first_name} ${userProfile.last_name}`
    : userProfile.first_name || userProfile.last_name || user.displayName || 'User';

  const avatarUrl = userProfile.avatar_url || user.photoURL || '/images/user/user-03.png';

  return (
    <Dropdown isOpen={isOpen} setIsOpen={setIsOpen}>
      <DropdownTrigger className="rounded align-middle outline-none ring-blue-500 ring-offset-2 focus-visible:ring-1 ring-offset-white hover:bg-slate-50 px-2 py-1 transition-colors">
        <span className="sr-only">My Account</span>

        <figure className="flex items-center gap-3">
          <Image
            src={avatarUrl}
            className="size-12 rounded-full object-cover"
            alt={`Avatar of ${displayName}`}
            role="presentation"
            width={200}
            height={200}
          />
          <figcaption className="flex items-center gap-1 font-medium text-slate-800 max-[1024px]:sr-only">
            <span>{displayName}</span>

            <ChevronUpIcon
              aria-hidden
              className={cn(
                "rotate-180 transition-transform",
                isOpen && "rotate-0",
              )}
              strokeWidth={1.5}
            />
          </figcaption>
        </figure>
      </DropdownTrigger>

      <DropdownContent
        className="border border-slate-200 bg-white shadow-lg rounded-lg min-[230px]:min-w-[17.5rem]"
        align="end"
      >
        <h2 className="sr-only">User information</h2>

        <figure className="flex items-center gap-2.5 px-5 py-3.5">
          <Image
            src={avatarUrl}
            className="size-12 rounded-full object-cover"
            alt={`Avatar for ${displayName}`}
            role="presentation"
            width={200}
            height={200}
          />

          <figcaption className="space-y-1 text-base font-medium">
            <div className="leading-none text-slate-800 font-semibold">
              {displayName}
            </div>
            {userProfile.role && (
              <div className="text-xs text-blue-600 capitalize font-medium">
                {userProfile.role}
              </div>
            )}
          </figcaption>
        </figure>

        <hr className="border-slate-200" />

        <div className="p-2 text-base text-slate-600 [&>*]:cursor-pointer">
          <Link
            href={"/profile"}
            onClick={() => setIsOpen(false)}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[9px] hover:bg-slate-50 hover:text-slate-800 transition-colors"
          >
            <UserIcon />

            <span className="mr-auto text-base font-medium">View profile</span>
          </Link>

          <Link
            href={"/pages/settings"}
            onClick={() => setIsOpen(false)}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[9px] hover:bg-slate-50 hover:text-slate-800 transition-colors"
          >
            <SettingsIcon />

            <span className="mr-auto text-base font-medium">
              Account Settings
            </span>
          </Link>
        </div>

        <hr className="border-slate-200" />

        <div className="p-2 text-base text-slate-600">
          <button
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[9px] hover:bg-red-50 hover:text-red-600 transition-colors"
            onClick={handleLogout}
          >
            <LogOutIcon />

            <span className="text-base font-medium">Log out</span>
          </button>
        </div>
      </DropdownContent>
    </Dropdown>
  );
}
