import { AuthModalContext } from "@/context/auth-modal-context";
import { useContext } from "react";

export const useAuthModal = () => {
	const context = useContext(AuthModalContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
