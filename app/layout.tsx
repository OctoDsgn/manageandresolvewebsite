import type { Metadata } from "next";
import { Poppins, Public_Sans } from "next/font/google";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { CtaBanner } from "@/components/CtaBanner";
import { Interactions } from "@/components/Interactions";
import "./globals.css";

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// Logo wordmark only — matches the typeface in the brand lockup.
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Manage & Resolve — ADR Consultancy, Dispute Resolution & Training | Nigeria",
  description:
    "Manage & Resolve is Nigeria's specialist ADR consultancy and training centre. We mediate, arbitrate, conciliate, and train professionals to resolve disputes strategically.",
  applicationName: "Manage & Resolve",
};

// Runs before paint: enables scroll-reveal styling only when JS is running, and
// un-hides everything if the interaction layer has not started within 4s.
const revealBootstrap = `(function(){var d=document.documentElement;d.classList.add("js-reveal");setTimeout(function(){if(!d.classList.contains("reveal-ready"))d.classList.remove("js-reveal")},4000)})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-NG" className={`${publicSans.variable} ${poppins.variable}`} data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: revealBootstrap }} />
      </head>
      <body className="flex min-h-dvh flex-col">
        <Nav />
        <main id="main" className="flex-1">
          {children}
        </main>
        <CtaBanner />
        <Footer />
        <Interactions />
      </body>
    </html>
  );
}
