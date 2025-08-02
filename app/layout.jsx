import "./globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster"; // Toast component from Shadcn UI

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Blood Donation Manager",
  description: "Manage donors, donations, inventory, and reports in one place.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {children}
        {/* Toast provider */}
        <Toaster />
      </body>
    </html>
  );
}
