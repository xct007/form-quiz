"use client";

// Ref: https://github.com/mangasur/
import { cn } from "@/lib/utils";
import React, { forwardRef } from "react";

interface FloatingProps extends React.HTMLProps<HTMLDivElement> {
	position?:
		| "top"
		| "top-center"
		| "top-left"
		| "top-right"
		| "bottom"
		| "bottom-center"
		| "bottom-left"
		| "bottom-right";
}

const positionClasses = {
	top: "top-5 left-1/2 -translate-x-1/2",
	"top-center": "top-5",
	"top-left": "top-5 left-5",
	"top-right": "top-5 right-5",
	bottom: "bottom-5 left-1/2 -translate-x-1/2",
	"bottom-center": "bottom-5",
	"bottom-left": "bottom-5 left-5",
	"bottom-right": "bottom-5 right-5",
};

const FloatingWrapper = forwardRef<HTMLDivElement, FloatingProps>(
	({ className, ...props }, ref) => (
		<div
			ref={ref}
			className={cn("overflow-hidden", "fixed z-10 flex-1", className)}
			{...props}
		/>
	)
);
FloatingWrapper.displayName = "FloatingWrapper";

export const Floating = forwardRef<HTMLDivElement, FloatingProps>(
	({ className, position = "bottom-right", ...props }, ref) => (
		<FloatingWrapper
			ref={ref}
			className={cn("px-1 py-1", positionClasses[position], className)}
			{...props}
		/>
	)
);
Floating.displayName = "Floating";
