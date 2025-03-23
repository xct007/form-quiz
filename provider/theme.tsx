"use client";

import { HeroUIProvider } from "@heroui/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useRouter } from "next/navigation";

interface IThemeProviderProps {
	children: React.ReactNode;
}
export const ThemeProvider: React.FC<IThemeProviderProps> = ({ children }) => {
	const router = useRouter();
	return (
		<HeroUIProvider navigate={router.push}>
			<NextThemesProvider attribute="class" defaultTheme="dark">
				{children}
			</NextThemesProvider>
		</HeroUIProvider>
	);
};
