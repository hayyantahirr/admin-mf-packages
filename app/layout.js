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
        className={`${inter.variable} bg-[#F8FAFC] font-sans text-slate-800 antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
