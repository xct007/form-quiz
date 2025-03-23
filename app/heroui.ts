import { heroui } from "@heroui/react";
import createPlugin from "tailwindcss/plugin";

const config: ReturnType<typeof createPlugin> = heroui();
export default config;
