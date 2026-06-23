import { toast } from "sonner";

export const toaster = {
	success: (message, options) => toast.success(message, options),
	error: (message, options) => toast.error(message, options),
	info: (message, options) => toast.info(message, options),
	warning: (message, options) => toast.warning(message, options),
	message: (message, options) => toast(message, options),
	dismiss: (id) => toast.dismiss(id),
};
