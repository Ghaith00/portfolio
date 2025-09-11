import "./globals.css";
import AppThemeProvider from "@/components/theme-provider";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getSite } from "@/lib/data";
import { SiteProvider } from "@/lib/site-context";
import Script from "next/script";


export default async function RootLayout({ children }: { children: React.ReactNode }) {
	const site = await getSite();
	const recaptchaKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
	return (
		<html lang="en" suppressHydrationWarning>
			<body className="min-h-dvh flex flex-col bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-950 dark:to-black text-zinc-900 dark:text-zinc-100">
				<Script
					src={`https://www.google.com/recaptcha/api.js?render=${recaptchaKey}`}
					strategy="afterInteractive"
				/>
				<AppThemeProvider>
					<SiteProvider initialSite={site}>
						<Navbar />
						<main className="mx-auto max-w-6xl px-4 py-10 md:py-16 flex-1">
							{children}
						</main>
						<Footer />
					</SiteProvider>
				</AppThemeProvider>
			</body>
		</html>
	);
}
