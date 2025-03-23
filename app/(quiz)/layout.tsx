import { Floating } from "@/components/floating";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Toolbar } from "@/components/toolbar";
import Link from "next/link";

export default function AuthLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<>
			<main className="container mx-auto max-w-7xl pt-16 px-6 flex-grow">
				{children}
			</main>

			<footer className="w-full flex items-center justify-center py-3">
				<Link
					className="flex items-center gap-1 text-current"
					href="https://github.com/xct007"
					title="GitHub"
					target="_blank"
					rel="noopener noreferrer"
				>
					<span className="text-default-600">Made by</span>
					<p className="text-primary">xct007</p>
				</Link>
			</footer>
			<Floating position="bottom-right" className="flex items-center gap-2">
				<Toolbar />
				<ThemeSwitcher />
			</Floating>
		</>
	);
}
