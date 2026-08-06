import type { Metadata } from "next";
import { Geist, Geist_Mono, Figtree } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import QueryProvider from "@/providers/query-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { TouchProvider } from "@/components/ui/hybrid-tooltip";
import ProgressProvider from "@/providers/progress-provider";
import { Toaster } from "@/components/ui/toast";
import { Navbar } from "@/components/navbar";

const figtree = Figtree({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

const SITE_NAME = "Rotaract Club of Kathmandu Metropolis";
const SITE_DESCRIPTION =
    "Rotaract Club of Kathmandu Metropolis (Rotaract District 3292) - board members, events, and club updates for Rota Year 2026/27.";

export const metadata: Metadata = {
    title: {
        default: SITE_NAME,
        template: `%s | ${SITE_NAME}`,
    },
    description: SITE_DESCRIPTION,
    keywords: [
        "Rotaract Club of Kathmandu Metropolis",
        "Rotaract District 3292",
        "Rotaract Nepal",
        "Rotaract Kathmandu",
    ],
    // TODO: set metadataBase (and canonical/OG absolute URLs) once a production domain exists.
    openGraph: {
        title: SITE_NAME,
        description: SITE_DESCRIPTION,
        siteName: SITE_NAME,
        type: "website",
        // TODO: add an `images` entry once an OG/share image is available.
    },
    twitter: {
        card: "summary",
        title: SITE_NAME,
        description: SITE_DESCRIPTION,
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        // See https://ui.shadcn.com/docs/dark-mode/next#wrap-your-root-layout for why we need to use `suppressHydrationWarning` here
        <html
            lang="en"
            className={cn("font-sans", figtree.variable)}
            suppressHydrationWarning
        >
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <ThemeProvider
                    attribute="class"
                    defaultTheme="light"
                    enableSystem
                    disableTransitionOnChange
                >
                    <QueryProvider>
                        <ProgressProvider>
                            <TouchProvider>
                                <Navbar />
                                {children}
                            </TouchProvider>
                        </ProgressProvider>
                    </QueryProvider>
                    <Toaster />
                </ThemeProvider>
            </body>
        </html>
    );
}
