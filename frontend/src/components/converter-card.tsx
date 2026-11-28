"use client";

import { useEffect, useRef, useState, type ChangeEvent, type DragEvent, type FormEvent } from "react";
import { ArrowRight, Check, CloudUpload, Download, Link2, LoaderCircle, LockKeyhole, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const MAX_FILE_BYTES = 100 * 1024 * 1024;
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export function ConverterCard() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState("");

  useEffect(() => () => { if (resultUrl) URL.revokeObjectURL(resultUrl); }, [resultUrl]);

  const onFile = (selected?: File) => {
    setError("");
    setFile(null);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setResultUrl("");
    if (!selected) return;
    const supported = /\.(gif|mp4|mov|webm)$/i.test(selected.name) || /^(image\/gif|video\/(mp4|quicktime|webm))$/.test(selected.type);
    if (!supported) { setError("Choose a GIF, MP4, MOV, or WebM file."); return; }
    if (selected.size > MAX_FILE_BYTES) { setError("Choose a file smaller than 100 MB."); return; }
    setFile(selected);
  };

  const onChange = (event: ChangeEvent<HTMLInputElement>) => onFile(event.target.files?.[0]);
  const onDrop = (event: DragEvent<HTMLDivElement>) => { event.preventDefault(); onFile(event.dataTransfer.files?.[0]); };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file && !url.trim()) return;
    setError("");
    setIsLoading(true);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setResultUrl("");

    const body = new FormData();
    if (file) body.set("file", file);
    else body.set("url", url.trim());

    try {
      const response = await fetch(`${API_URL}/api/conversions/`, { method: "POST", body });
      if (!response.ok) {
        const payload = await response.json().catch(() => null) as { error?: string } | null;
        throw new Error(payload?.error || "We couldn’t convert that media. Try another file or link.");
      }
      const sticker = await response.blob();
      if (sticker.type !== "image/webp") throw new Error("The server returned an unexpected file format.");
      setResultUrl(URL.createObjectURL(sticker));
    } catch (conversionError) {
      setError(conversionError instanceof Error ? conversionError.message : "Conversion failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return <section id="converter" className="scroll-mt-24 rounded-[28px] border border-stone-200 bg-white p-5 shadow-[0_24px_70px_-38px_rgba(20,33,26,.28)] sm:p-7">
    <div className="mb-5 flex items-center justify-between"><div><h2 className="font-semibold text-ink">Start with a GIF or video</h2><p className="mt-1 text-sm text-stone-500">Pick a source to make your sticker</p></div><span className="rounded-full bg-mint px-3 py-1 text-xs font-semibold text-green">Free · no account</span></div>
    <form onSubmit={onSubmit}>
      <label htmlFor="x-url" className="mb-2 block text-sm font-medium text-stone-700">Paste a public X post link</label>
      <div className="flex gap-2"><div className="relative min-w-0 flex-1"><Link2 className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" size={18}/><input id="x-url" type="url" value={url} onChange={(e) => { setUrl(e.target.value); setFile(null); }} placeholder="https://x.com/username/status/..." disabled={isLoading} className="h-12 w-full rounded-xl border border-stone-200 bg-white pl-10 pr-3 text-sm outline-none transition placeholder:text-stone-400 focus:border-green focus:ring-2 focus:ring-green/15 disabled:bg-stone-50" /></div><Button type="submit" disabled={isLoading || (!url.trim() && !file)} className="shrink-0 px-4 sm:px-5">{isLoading ? <>Converting <LoaderCircle size={17} className="animate-spin"/></> : <>Make sticker <ArrowRight size={17}/></>}</Button></div>
    </form>
    <div className="my-5 flex items-center gap-3 text-xs font-medium uppercase tracking-[.14em] text-stone-400"><span className="h-px flex-1 bg-stone-100"/>or<span className="h-px flex-1 bg-stone-100"/></div>
    <div onDragOver={(e) => e.preventDefault()} onDrop={onDrop} onClick={(e) => { if (!isLoading && e.target !== inputRef.current) inputRef.current?.click(); }} onKeyDown={(e) => { if (!isLoading && (e.key === "Enter" || e.key === " ")) inputRef.current?.click(); }} role="button" tabIndex={0} aria-label="Choose or drop a GIF or video" className={`rounded-2xl border border-dashed border-stone-300 bg-stone-50/70 px-4 py-7 text-center transition hover:border-green/60 hover:bg-mint/40 sm:py-8 ${isLoading ? "cursor-wait opacity-60" : "cursor-pointer"}`}>
      <input ref={inputRef} type="file" accept="image/gif,video/mp4,video/quicktime,video/webm" onChange={onChange} disabled={isLoading} className="sr-only" aria-label="Upload a GIF or video" />
      <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-white text-green shadow-sm"><CloudUpload size={22}/></span>
      <p className="mt-3 text-sm font-semibold text-ink">{file?.name || "Drop a file here or browse"}</p><p className="mt-1 text-xs text-stone-500">GIF, MP4, MOV, or WebM · up to 100 MB</p>
      {file && <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-green"><Check size={14}/> Ready to convert</span>}
    </div>
    {error && <p role="alert" className="mt-3 flex items-start gap-2 rounded-xl bg-amber-50 px-3 py-2.5 text-sm text-amber-900"><X size={16} className="mt-0.5 shrink-0"/>{error}</p>}
    {isLoading && <p role="status" className="mt-3 rounded-xl bg-mint px-3 py-2.5 text-sm text-green">Making your animated sticker… larger videos can take a little longer.</p>}
    {resultUrl && <div role="status" className="mt-4 flex items-center gap-4 rounded-2xl border border-green/15 bg-mint/50 p-3"><img src={resultUrl} alt="Animated WhatsApp sticker preview" className="size-20 rounded-xl bg-white object-contain"/><div className="min-w-0 flex-1"><p className="font-semibold text-ink">Your sticker is ready</p><p className="mt-1 text-xs text-stone-600">Animated WebP · 512 × 512 · up to 10 seconds</p></div><a href={resultUrl} download="whatsapp-sticker.webp" className="inline-flex h-10 shrink-0 items-center gap-2 rounded-xl bg-green px-3 text-sm font-semibold text-white hover:bg-green/90"><Download size={16}/><span className="hidden sm:inline">Download</span></a></div>}
    <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-stone-500"><LockKeyhole size={13}/> Media is deleted from the server after conversion.</div>
  </section>;
}
