import type { Metadata } from "next";
import { Noto_Sans_SC, Space_Grotesk } from "next/font/google";
import "./globals.css";
import "./archive.css";

const sans = Noto_Sans_SC({ variable: "--font-sans", subsets: ["latin"], weight: ["400", "500", "700", "900"] });
const display = Space_Grotesk({ variable: "--font-display", subsets: ["latin"], weight: ["500", "600", "700"] });

export const metadata: Metadata = {
  title: "AI Field Notes｜从案例到方案",
  description: "每天拆解真实部署、系统设计和证据局限，把资讯转成可验证的项目方向。",
  openGraph: { title: "AI Field Notes｜从案例到方案", description: "找到 AI 落地的下一步。", images: ["/og.png"] },
  twitter: { card: "summary_large_image", title: "AI Field Notes｜从案例到方案", description: "找到 AI 落地的下一步。", images: ["/og.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body className={`${sans.variable} ${display.variable}`}>{children}</body></html>;
}
