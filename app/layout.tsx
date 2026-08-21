import type { Metadata } from "next";
import { Noto_Sans_SC, Space_Grotesk } from "next/font/google";
import "./globals.css";
import "./archive.css";

const sans = Noto_Sans_SC({ variable: "--font-sans", subsets: ["latin"], weight: ["400", "500", "700", "900"] });
const display = Space_Grotesk({ variable: "--font-display", subsets: ["latin"], weight: ["500", "600", "700"] });

export const metadata: Metadata = {
  title: "AI Field Notes｜企业 AI 每日简报",
  description: "每天筛选真正值得读的企业 AI 论文、部署案例与深度分析。",
  openGraph: { title: "AI Field Notes｜企业 AI 每日简报", description: "企业 AI，去掉噪声之后。", images: ["/og.png"] },
  twitter: { card: "summary_large_image", title: "AI Field Notes｜企业 AI 每日简报", description: "企业 AI，去掉噪声之后。", images: ["/og.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body className={`${sans.variable} ${display.variable}`}>{children}</body></html>;
}
