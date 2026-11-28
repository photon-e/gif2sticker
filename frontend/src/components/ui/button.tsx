import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
const styles = cva("inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50", { variants: { variant: { primary: "bg-green text-white hover:bg-green/90", outline: "border border-stone-200 bg-white text-ink hover:bg-stone-50", ghost: "text-ink hover:bg-stone-100" }, size: { default: "h-12 px-5", sm: "h-10 px-4 text-sm" } }, defaultVariants: { variant: "primary", size: "default" } });
type Props = ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof styles> & { asChild?: boolean };
export function Button({ className, variant, size, asChild = false, ...props }: Props) { const Component = asChild ? Slot : "button"; return <Component className={cn(styles({ variant, size }), className)} {...props} />; }
