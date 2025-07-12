import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

export const metadata = {
  title: "Flexofast",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
