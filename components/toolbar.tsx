"use client";

import { useAuthModal } from "@/hooks/use-auth-modal";
import {
	Avatar,
	Button,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
} from "@heroui/react";
import { LogInIcon } from "lucide-react";
import { signOut, useSession } from "next-auth/react";

export const Toolbar = () => {
	const { data: session } = useSession();
	const { openModal } = useAuthModal();

	if (!session) {
		return (
			<Button
				onPress={openModal}
				variant="light"
				radius="full"
				size="sm"
				isIconOnly
			>
				<LogInIcon size={24} />
			</Button>
		);
	}

	const { user } = session;

	return (
		<Dropdown placement="bottom-end">
			<DropdownTrigger>
				<Avatar
					isBordered
					as="button"
					className="transition-transform"
					src={user.image!}
					alt={user.name!}
					size="sm"
				/>
			</DropdownTrigger>
			<DropdownMenu aria-label="Profile Actions" variant="flat">
				<DropdownItem key="profile" className="h-14 gap-2">
					<p className="font-semibold">{user.name}</p>
				</DropdownItem>
				<DropdownItem key="dashboard" href="/dashboard">
					Dashboard
				</DropdownItem>
				<DropdownItem
					key="logout"
					color="danger"
					onPress={() =>
						signOut({
							redirect: false,
						})
					}
				>
					Log Out
				</DropdownItem>
			</DropdownMenu>
		</Dropdown>
	);
};
