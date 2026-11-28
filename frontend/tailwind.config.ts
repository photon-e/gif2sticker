import type { Config } from "tailwindcss";
const config: Config = { content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"], theme: { extend: { colors: { ink: "#14211a", green: "#16834b", mint: "#e8f5ed" }, fontFamily: { sans: ["Arial", "sans-serif"] } } }, plugins: [] };
export default config;
