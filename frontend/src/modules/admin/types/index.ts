export type CardUserProps = {
	id: number;
	first_name: string;
	last_name: string;
	email: string;
	phone: string;
	active: boolean;
	role: string;
	created_at: string;
};

export type UserProps = {
	id: number;
	first_name: string;
	last_name: string;
	email: string;
	password: string;
	phone: string;
};

export type UserUpdateData = {
	first_name: string;
	last_name: string;
	email: string;
	phone: string;
	password?: string;
	role_id?: number;
	active?: boolean;
};

export type UserProp = {
	user: CardUserProps;
};

export type ListUserProps = {
	users: CardUserProps[];
};

type OpenProps = {
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
};

export interface DeleteUserProps extends OpenProps {
	id: number;
}

export interface EditUserModalProps extends OpenProps {
	user: CardUserProps;
	onUserUpdated?: () => void;
}

export type DropdownProps = {
	id: number;
	user: CardUserProps;
	onUserUpdated?: () => void;
};
