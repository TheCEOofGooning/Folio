"use client";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
export function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => setDark(document.documentElement.classList.contains("dark")), []);
  function toggle() { const next=!dark; setDark(next); document.documentElement.classList.toggle("dark",next); localStorage.setItem("folio-theme",next?"dark":"light"); }
  return <button onClick={toggle} className="grid size-10 place-items-center rounded-full border border-line hover:bg-ink hover:text-paper" aria-label="Toggle color theme">{dark?<Sun size={16}/>:<Moon size={16}/>}</button>;
}
