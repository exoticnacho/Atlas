import { Outfit } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata = {
  title: "Atlas DAO Hub | Mantle Network",
  description: "Decentralized governance on Mantle Network with gasless transactions and reputation system",
  keywords: ["DAO", "Mantle", "Multi-Sig", "Blockchain", "Governance"],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={outfit.variable}>
      <body className="antialiased min-h-screen bg-background text-text-primary">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'rgba(20, 20, 20, 0.95)',
              color: '#fff',
              border: '1px solid rgba(207, 251, 84, 0.2)',
              borderRadius: '12px',
              backdropFilter: 'blur(12px)',
            },
            success: {
              iconTheme: {
                primary: '#CFFB54',
                secondary: '#000',
              },
            },
            error: {
              iconTheme: {
                primary: '#EF4444',
                secondary: '#000',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
