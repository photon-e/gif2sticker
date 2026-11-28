import { ArrowDown, ArrowUpRight, Check, Film, MessageCircle, Sparkles, Zap } from "lucide-react";
import { Brand } from "@/components/brand";
import { ConverterCard } from "@/components/converter-card";
import { Navbar } from "@/components/navbar";

const steps = [
  { icon: Film, number: "01", title: "Find your moment", body: "Paste an X post link or choose a GIF or video from your device." },
  { icon: Sparkles, number: "02", title: "Make it yours", body: "Trim the perfect moment and get it ready for your sticker pack." },
  { icon: MessageCircle, number: "03", title: "Send the feeling", body: "Add your sticker to WhatsApp and share it with everyone." },
];

export default function HomePage() { return <div id="top" className="min-h-screen bg-[#fcfdfb] text-ink">
  <Navbar/>
  <main>
    <section className="relative overflow-hidden px-5 pb-16 pt-14 sm:pb-24 sm:pt-20">
      <div className="pointer-events-none absolute left-1/2 top-10 -z-0 h-[450px] w-[760px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(222,243,228,.66),transparent_68%)]"/>
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1fr_470px] lg:gap-16">
        <div className="mx-auto max-w-xl text-center lg:mx-0 lg:text-left">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-green/10 bg-white/80 px-3.5 py-1.5 text-xs font-semibold text-green shadow-sm"><Zap size={14} fill="currentColor"/> Your favorite moments, made shareable</div>
          <h1 className="text-[2.7rem] font-bold leading-[1.08] tracking-[-.055em] text-ink sm:text-6xl">Turn GIFs into <span className="text-green">WhatsApp stickers.</span></h1>
          <p className="mx-auto mt-5 max-w-lg text-base leading-7 text-stone-600 sm:text-lg lg:mx-0">That perfect reaction deserves more than a replay. Turn GIFs and videos into animated stickers in a few taps.</p>
          <div className="mt-7 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-stone-600 lg:justify-start"><span className="inline-flex items-center gap-1.5"><Check size={16} className="text-green"/> Always free</span><span className="inline-flex items-center gap-1.5"><Check size={16} className="text-green"/> No sign-up</span><span className="inline-flex items-center gap-1.5"><Check size={16} className="text-green"/> Made for mobile</span></div>
          <a href="#how-it-works" className="mt-9 inline-flex items-center gap-2 text-sm font-semibold text-green hover:text-green/80">See how it works <ArrowDown size={16}/></a>
        </div>
        <div className="relative mx-auto w-full max-w-[470px]"><div className="absolute -right-4 -top-5 hidden size-16 rounded-2xl border border-green/10 bg-white/80 sm:block"/><ConverterCard/><div className="absolute -bottom-4 -left-4 -z-0 hidden size-20 rounded-full border border-green/10 sm:block"/></div>
      </div>
      <div className="mx-auto mt-14 flex max-w-6xl items-center justify-center gap-2 text-xs font-medium text-stone-400"><span className="size-1.5 rounded-full bg-green"/> Built for the way you chat</div>
    </section>
    <section id="how-it-works" className="scroll-mt-16 border-y border-stone-100 bg-white px-5 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl"><div className="mx-auto max-w-xl text-center"><p className="text-xs font-bold uppercase tracking-[.17em] text-green">Easy as 1, 2, 3</p><h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">A little magic. A lot of feeling.</h2><p className="mt-3 text-stone-600">The quickest route from “you have to see this” to “sent as a sticker.”</p></div>
        <div className="mt-11 grid gap-4 md:grid-cols-3">{steps.map(({ icon: Icon, number, title, body }) => <article key={number} className="rounded-2xl border border-stone-100 bg-[#fcfdfb] p-6"><div className="flex items-center justify-between"><span className="grid size-11 place-items-center rounded-xl bg-mint text-green"><Icon size={21}/></span><span className="text-sm font-semibold tracking-widest text-stone-300">{number}</span></div><h3 className="mt-5 text-lg font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-stone-600">{body}</p></article>)}</div>
      </div>
    </section>
    <section className="px-5 py-14"><div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 rounded-3xl bg-ink px-6 py-8 text-center text-white sm:flex-row sm:px-10 sm:text-left"><div><p className="text-xl font-semibold">Your camera roll has sticker potential.</p><p className="mt-1 text-sm text-white/65">Bring a favorite GIF or video when you’re ready.</p></div><a href="#converter" className="inline-flex h-11 items-center gap-2 rounded-xl bg-white px-4 text-sm font-semibold text-ink transition hover:bg-mint">Get started <ArrowUpRight size={16}/></a></div></section>
  </main>
  <footer className="border-t border-stone-100 bg-white px-5"><div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 py-6 text-xs text-stone-500 sm:flex-row"><Brand/><span>Free to use. No account needed.</span><span>GIF2Sticker © {new Date().getFullYear()}</span></div></footer>
 </div>; }
