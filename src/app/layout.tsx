import "@stripe/stripe-js";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import Script from "next/script";
import TanstackProvider from "@/providers/TanstackProvider";
import Header from "@/app/_components/header";
import Footer from "@/app/_components/footer";
import { Toaster } from "@/components/ui/toaster";
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
    <html lang="en" className="scroll-pt-20">
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
      <Script id="twitter">
        {`!function(e,t,n,s,u,a){e.twq||(s=e.twq=function(){s.exe?s.exe.apply(s,arguments):s.queue.push(arguments);
},s.version='1.1',s.queue=[],u=t.createElement(n),u.async=!0,u.src='https://static.ads-twitter.com/uwt.js',
a=t.getElementsByTagName(n)[0],a.parentNode.insertBefore(u,a))}(window,document,'script');
twq('config','okd1g');`}
      </Script>
      <Script id="facebook">
        {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '1550146845548072');
fbq('track', 'PageView');`}
      </Script>
      <noscript>
        <img
          height="1"
          width="1"
          className="hidden"
          src="https://www.facebook.com/tr?id=1550146845548072&ev=PageView&noscript=1"
        />
      </noscript>
      <body className={poppins.className}>
        <TanstackProvider>
          <Header />
          <div className="px-5 md:px-16">
            {children}
            <Toaster />
          </div>
          <Footer />
        </TanstackProvider>
      </body>
    </html>
  );
}
