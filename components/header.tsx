import Link from "next/link";
import { PenLine, Search } from "lucide-react";
import { getUser } from "@/lib/auth";
import { ThemeToggle } from "./theme-toggle";
import { UserMenu } from "./user-menu";
export async function Header() {
  let user = null; try { user = await getUser(); } catch {}
  return <header className="sticky top-0 z-40 border-b border-line/70 bg-paper/85 backdrop-blur-xl">
    <div className="container-folio flex h-[72px] items-center justify-between">
      <Link href="/" className="font-serif text-2xl font-bold tracking-tight">Folio<span className="text-accent">.</span></Link>
      <nav className="flex items-center gap-2 md:gap-3">
        <Link href="/?focus=search" className="grid size-10 place-items-center rounded-full hover:bg-line/50" aria-label="Search"><Search size={18}/></Link>
        <ThemeToggle />
        {user ? <><Link href="/write" className="button hidden sm:inline-flex"><PenLine size={15}/> Write</Link><UserMenu user={user}/></> : <><Link href="/login" className="hidden px-3 text-sm font-semibold sm:block">Sign in</Link><Link href="/register" className="button">Start writing</Link></>}
      </nav>
    </div>
  </header>;
}
