"use client";

import { AuthModal } from "@/components/auth/auth-modal";
import { useDisclosure } from "@heroui/react";
import { useSession } from "next-auth/react";
import React, { ReactNode, createContext } from "react";

interface AuthModalContextValue {
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
	openModal: () => void;
	closeModal: () => void;
}

export const AuthModalContext = createContext<
	AuthModalContextValue | undefined
>(undefined);

interface AuthModalProviderProps {
	children: ReactNode;
}

export const AuthModalProvider: React.FC<AuthModalProviderProps> = ({
	children,
}) => {
	const { isOpen, onClose, onOpen, onOpenChange } = useDisclosure();
	const { data: session } = useSession();

	return (
		<AuthModalContext.Provider
			value={{
				isOpen,
				onOpenChange,
				openModal: onOpen,
				closeModal: onClose,
			}}
		>
			{children}

			<AuthModal isOpen={isOpen} onOpenChange={onOpenChange} hide={!!session} />
		</AuthModalContext.Provider>
	);
};
AuthModalProvider.displayName = "AuthModalProvider";
