import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Navbar } from "@/components/Navbar";
import { GoatCounter } from "@/components/GoatCounter";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Shaun John Thomas | Aero-Mechanical Engineering Portfolio",
  description:
    "Engineering portfolio of Shaun John Thomas, final-year Aero-Mechanical Engineering student at the University of Strathclyde specializing in CAD, CFD, FEA, UAV design, and supersonic rocketry.",
  keywords: [
    "Shaun John Thomas",
    "Aero-Mechanical Engineer",
    "CAD",
    "CFD",
    "FEA",
    "UAV Design",
    "Blended Wing Body",
    "Rocketry",
    "University of Strathclyde",
    "SolidWorks",
    "ANSYS",
  ],
  authors: [{ name: "Shaun John Thomas" }],
  creator: "Shaun John Thomas",
  metadataBase: new URL("https://shaun-j-thomas.github.io/Portfolio/"),
  openGraph: {
    type: "website",
    url: "https://shaun-j-thomas.github.io/Portfolio/",
    title: "Shaun John Thomas | Aero-Mechanical Engineering Portfolio",
    description:
      "Engineering portfolio of Shaun John Thomas, final-year Aero-Mechanical Engineering student at the University of Strathclyde specializing in CAD, CFD, FEA, UAV design, and supersonic rocketry.",
    images: [
      {
        url: "/Assets/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Shaun John Thomas Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shaun John Thomas | Aero-Mechanical Engineering Portfolio",
    description:
      "Engineering portfolio of Shaun John Thomas, final-year Aero-Mechanical Engineering student at the University of Strathclyde specializing in CAD, CFD, FEA, UAV design, and supersonic rocketry.",
    images: ["/Assets/og-image.jpg"],
  },
  icons: {
    icon: "/Assets/TopVIEW.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className="scroll-smooth overflow-x-hidden"
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Shaun John Thomas",
              url: "https://shaun-j-thomas.github.io/Portfolio/",
              jobTitle: "Aero-Mechanical Engineering Student",
              affiliation: {
                "@type": "CollegeOrUniversity",
                name: "University of Strathclyde",
              },
              email: "mailto:shaunjthomas.sjt@gmail.com",
              sameAs: [
                "https://www.linkedin.com/in/shaun-john-thomas-0635652aa",
                "https://github.com/shaun-j-thomas",
              ],
              knowsAbout: [
                "Aerospace Engineering",
                "CAD",
                "CFD",
                "FEA",
                "UAV Design",
                "Rocketry",
                "SolidWorks",
                "ANSYS",
              ],
            }),
          }}
        />
      </head>
      <body
        suppressHydrationWarning
        className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} font-sans antialiased min-h-screen w-full overflow-x-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 aerospace-grid selection:bg-cyan-500/20 selection:text-cyan-700 dark:selection:text-cyan-300 transition-colors duration-500 ease-in-out`}
      >
        {/* Global Fixed Ambient Aerospace Background Layer */}
        <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden bg-slate-50 dark:bg-slate-950">
          {/* Top-Left Aerospace Stress Purple Aura */}
          <div className="absolute -top-24 -left-24 w-96 h-96 sm:w-[500px] sm:h-[500px] rounded-full bg-purple-900/10 dark:bg-purple-900/20 blur-[120px]" />
          {/* Bottom-Right Telemetry Electric Cyan Aura */}
          <div className="absolute -bottom-24 -right-24 w-96 h-96 sm:w-[500px] sm:h-[500px] rounded-full bg-cyan-900/10 dark:bg-cyan-900/20 blur-[120px]" />
        </div>

        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
        >
          <Navbar />
          {children}
        </ThemeProvider>

        <GoatCounter />
      </body>
    </html>
  );
}
