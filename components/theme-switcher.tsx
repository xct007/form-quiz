"use client";

import { Button } from "@heroui/react";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useMemo, useState } from "react";

export function ThemeSwitcher() {
	const [mounted, setMounted] = useState(false);
	const { theme, setTheme } = useTheme();

	const themeIcon = useMemo(
		() => (theme === "dark" ? <MoonIcon size={24} /> : <SunIcon size={24} />),
		[theme]
	);

	useEffect(() => setMounted(true), []);

	if (!mounted) {
		return null;
	}

	return (
		<Button
			onPress={() => setTheme(theme === "dark" ? "light" : "dark")}
			isIconOnly
			radius="full"
			aria-label="Toggle theme"
			variant="light"
		>
			{themeIcon}
		</Button>
	);
}
