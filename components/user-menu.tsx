"use client";
import * as Dropdown from "@radix-ui/react-dropdown-menu";
import Link from "next/link";
import { LayoutDashboard, LogOut, Settings } from "lucide-react";
import type { User } from "@/lib/auth";
import { initials } from "@/lib/utils";
export function UserMenu({user}:{user:User}) {
 return <Dropdown.Root><Dropdown.Trigger className="grid size-10 place-items-center rounded-full bg-lime text-xs font-bold text-[#171715] outline-none">{initials(user.name)}</Dropdown.Trigger>
 <Dropdown.Portal><Dropdown.Content align="end" sideOffset={10} className="z-50 min-w-52 rounded-2xl border border-line bg-paper p-2 shadow-soft">
  <div className="px-3 py-2"><p className="text-sm font-semibold">{user.name}</p><p className="text-xs text-muted">@{user.username}</p></div><Dropdown.Separator className="my-1 h-px bg-line"/>
  <Dropdown.Item asChild><Link href="/dashboard" className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm outline-none hover:bg-line/50"><LayoutDashboard size={15}/>Dashboard</Link></Dropdown.Item>
  <Dropdown.Item asChild><Link href="/settings" className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm outline-none hover:bg-line/50"><Settings size={15}/>Settings</Link></Dropdown.Item>
  <form action="/api/logout" method="post"><button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-accent hover:bg-line/50"><LogOut size={15}/>Sign out</button></form>
 </Dropdown.Content></Dropdown.Portal></Dropdown.Root>
}
