"use client";

import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalHeader,
} from "@heroui/react";
import { signIn } from "next-auth/react";
import { memo, useCallback, useState } from "react";
import { GoogleIcon } from "../icons";

interface AuthModalProps {
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
	hide?: boolean;
}

export const AuthModal = memo(
	({ hide, isOpen, onOpenChange }: AuthModalProps) => {
		const [isLoading, setLoading] = useState(false);
		const loginCallback = useCallback(() => {
			setLoading(true);
			signIn("google", {
				redirect: false,
			});

			setLoading(false);
		}, []);
		if (hide) {
			return null;
		}

		return (
			<Modal isOpen={isOpen} placement="auto" onOpenChange={onOpenChange}>
				<ModalContent>
					<ModalHeader className="flex flex-col gap-1">
						Log in or sign up to continue
					</ModalHeader>
					<ModalBody className="pb-6">
						<Button
							variant="ghost"
							radius="sm"
							onPress={loginCallback}
							isDisabled={isLoading}
							isLoading={isLoading}
							title="With Google"
						>
							<GoogleIcon size={24} />
						</Button>
					</ModalBody>
				</ModalContent>
			</Modal>
		);
	}
);
AuthModal.displayName = "AuthModal";
