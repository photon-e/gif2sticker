import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "GIF2Sticker — Make stickers from moments", description: "Turn GIFs and videos into animated WhatsApp stickers. Free, private, and easy to use." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
