"use client";

import {
  Dropdown,
  DropdownContent,
  DropdownTrigger,
} from "@/components/ui/dropdown";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { BellIcon } from "./icons";

const notificationList = [
  {
    image: "/images/user/user-15.png",
    title: "Piter Joined the Team!",
    subTitle: "Congratulate him",
  },
  {
    image: "/images/user/user-03.png",
    title: "New message",
    subTitle: "Devid sent a new message",
  },
  {
    image: "/images/user/user-26.png",
    title: "New Payment received",
    subTitle: "Check your earnings",
  },
  {
    image: "/images/user/user-28.png",
    title: "Jolly completed tasks",
    subTitle: "Assign new task",
  },
  {
    image: "/images/user/user-27.png",
    title: "Roman Joined the Team!",
    subTitle: "Congratulate him",
  },
];

export function Notification() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDotVisible, setIsDotVisible] = useState(true);
  const isMobile = useIsMobile();

  return (
    <Dropdown
      isOpen={isOpen}
      setIsOpen={(open) => {
        setIsOpen(open);

        if (setIsDotVisible) setIsDotVisible(false);
      }}
    >
      <DropdownTrigger
        className="grid size-12 place-items-center rounded-full border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:text-blue-600 outline-none focus-visible:border-blue-500 focus-visible:text-blue-600 shadow-sm transition-colors"
        aria-label="View Notifications"
      >
        <span className="relative">
          <BellIcon />

          {isDotVisible && (
            <span
              className={cn(
                "absolute right-0 top-0 z-10 size-2 rounded-full bg-red-500 ring-2 ring-white",
              )}
            >
              <span className="absolute inset-0 -z-1 animate-ping rounded-full bg-red-500 opacity-75" />
            </span>
          )}
        </span>
      </DropdownTrigger>

      <DropdownContent
        align={isMobile ? "end" : "center"}
        className="border border-slate-200 bg-white px-3.5 py-3 shadow-lg rounded-lg min-[350px]:min-w-[20rem]"
      >
        <div className="mb-1 flex items-center justify-between px-2 py-1.5">
          <span className="text-lg font-medium text-slate-800">
            Notifications
          </span>
          <span className="rounded-md bg-blue-600 px-[9px] py-0.5 text-xs font-medium text-white">
            5 new
          </span>
        </div>

        <ul className="mb-3 max-h-[23rem] space-y-1.5 overflow-y-auto">
          {notificationList.map((item, index) => (
            <li key={index} role="menuitem">
              <Link
                href="#"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-4 rounded-lg px-2 py-1.5 outline-none hover:bg-slate-50 focus-visible:bg-slate-50 transition-colors"
              >
                <Image
                  src={item.image}
                  className="size-14 rounded-full object-cover"
                  width={200}
                  height={200}
                  alt="User"
                />

                <div>
                  <strong className="block text-sm font-medium text-slate-800">
                    {item.title}
                  </strong>

                  <span className="truncate text-sm font-medium text-slate-600">
                    {item.subTitle}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        <Link
          href="#"
          onClick={() => setIsOpen(false)}
          className="block rounded-lg border border-blue-600 p-2 text-center text-sm font-medium tracking-wide text-blue-600 outline-none transition-colors hover:bg-blue-50 focus:bg-blue-50 focus-visible:border-blue-600"
        >
          See all notifications
        </Link>
      </DropdownContent>
    </Dropdown>
  );
}
