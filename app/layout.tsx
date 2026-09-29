import type { Metadata } from "next";
import "@fontsource-variable/inter";
import "@fontsource-variable/playfair-display";
import "./globals.css";
import { Header } from "@/components/header";
export const metadata:Metadata={title:{default:"Folio — Ideas worth your time",template:"%s — Folio"},description:"A calm place to read, write, and share ideas that matter.",metadataBase:new URL(process.env.NEXT_PUBLIC_APP_URL||"http://localhost:3000")};
const themeScript=`try{const t=localStorage.getItem('folio-theme');if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme:dark)').matches))document.documentElement.classList.add('dark')}catch(e){}`;
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{__html:themeScript}}/></head><body className="grain min-h-screen font-sans antialiased"><Header/>{children}</body></html>}
