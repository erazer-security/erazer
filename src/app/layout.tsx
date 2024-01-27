import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import { GoogleAnalytics } from "@next/third-parties/google";
import Script from "next/script";
import TanstackProvider from "@/providers/TanstackProvider";
import Header from "@/app/_components/header";
import Footer from "@/app/_components/footer";
import "@stripe/stripe-js";
import "./globals.css";

const poppins = Poppins({ subsets: ["latin"], weight: "400" });

export const metadata: Metadata = {
  title: "Erazer",
  description:
    "Erazer is at the forefront of developing cutting-edge tools to fortify personal data protection on the internet.",
  keywords: [
    "Erazer",
    "Data Brokers",
    "Data Broker Removal",
    "Cybersecurity",
    "Cybersecurity Tools",
    "Privacy",
    "Data Protection",
    "Data Protection Tools",
    "Digital Privacy",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <GoogleAnalytics gaId="G-GHPRYNE6WR" />
      <Script id="hotjar">
        {`(function (h, o, t, j, a, r) {
          h.hj =
            h.hj ||
            function () {
              (h.hj.q = h.hj.q || []).push(arguments);
            };
          h._hjSettings = { hjid: 3758887, hjsv: 6 };
          a = o.getElementsByTagName("head")[0];
          r = o.createElement("script");
          r.async = 1;
          r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;
          a.appendChild(r);
        })(window, document, "https://static.hotjar.com/c/hotjar-", ".js?sv=")`}
      </Script>
      <body className={poppins.className}>
        <TanstackProvider>
          <Header />
          <div className="px-5 md:px-16">
            {children}
            <Footer />
            <Toaster />
          </div>
        </TanstackProvider>
      </body>
    </html>
  );
}
