import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "Admin-MF-Packages",
  description: "Admin-MF-Packages",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} font-sans antialiased bg-[#F8FAFC] text-slate-800`}
      >
        {children}
      </body>
    </html>
  );
}
