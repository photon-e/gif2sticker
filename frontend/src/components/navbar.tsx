import { ArrowUpRight } from "lucide-react";
import { Brand } from "@/components/brand";
import { Button } from "@/components/ui/button";
export function Navbar() { return <header className="sticky top-0 z-20 border-b border-stone-100 bg-white/90 backdrop-blur"><nav className="mx-auto flex h-[68px] max-w-6xl items-center justify-between px-5 sm:px-8"><Brand/><div className="flex items-center gap-5"><a href="#how-it-works" className="hidden text-sm font-medium text-stone-600 hover:text-ink sm:block">How it works</a><Button size="sm" variant="outline" asChild><a href="#converter">Try it <ArrowUpRight size={15}/></a></Button></div></nav></header>; }
