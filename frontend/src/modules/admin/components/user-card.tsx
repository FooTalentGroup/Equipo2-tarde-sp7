"use client";

import { Heading } from "@src/components/ui/heading";
import { Text } from "@src/components/ui/text";

import type { UserProp } from "../types";
import { Dropdown } from "./dropdown";

export const UserCard = ({ user }: UserProp) => {
	const handleUserUpdated = () => {
		window.location.reload();
	};

	return (
		<div className="p-4 border-outline-hover border shadow-user-border rounded-md flex items-center gap-4 mt-4">
			<Heading
				className="text-secondary w-12 h-12 rounded-full bg-muted flex items-center justify-center"
				variant="subtitle2"
				weight="semibold"
				align="center"
			>
				{user.first_name[0]}
			</Heading>
			<div className="flex flex-col gap-3 flex-1">
				{/* Name and isActive */}
				<div className="flex items-center gap-3">
					<Heading variant="subtitle3" weight="semibold">
						{user.first_name} {user.last_name}
					</Heading>
					<Text
						className="rounded-4xl text-secondary-dark-active bg-muted border border-secondary-light px-3 py-2"
						variant="tiny"
					>
						{user.active ? "Activo" : "Inactivo"}
					</Text>
				</div>
				{/* Phone and email */}
				<div className="flex gap-4 items-center text-grey-dark-active">
					<Text variant="small">Tel: {user.phone}</Text>
					<Text variant="small">· {user.email}</Text>
				</div>
			</div>
			{/* Options */}
			<div className="flex items-center">
				<Dropdown id={user.id} user={user} onUserUpdated={handleUserUpdated} />
			</div>
		</div>
	);
};
