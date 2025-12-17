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
		<div className="p-4 border-outline-hover border shadow-user-border rounded-md flex items-center gap-3 sm:gap-4 mt-4">
			<Heading
				className="text-secondary w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-muted flex items-center justify-center"
				variant="subtitle2"
				weight="semibold"
				align="center"
			>
				{user.first_name[0]}
			</Heading>
			<div className="flex flex-col gap-3 md:gap-2 flex-1">
				<div className="flex items-center gap-3">
					<Heading
						variant="subtitle3"
						weight="semibold"
						className="max-sm:text-sm max-md:text-base"
					>
						{user.first_name} {user.last_name}
					</Heading>
					<Text
						className="rounded-4xl text-secondary-dark-active bg-muted border border-secondary-light px-2 py-1 sm:px-3 sm:py-2"
						variant="tiny"
					>
						{user.active ? "Activo" : "Inactivo"}
					</Text>
				</div>
				<div className="flex flex-col sm:flex-row gap-3 md:gap-4 md:items-center text-grey-dark-active">
					<Text
						variant="small"
						className="max-[400px]:text-[12px] max-[450px]:text-[13px]"
					>
						Tel: {user.phone}
					</Text>
					<Text
						variant="small"
						className="max-[400px]:text-[12px] max-[450px]:text-[13px]"
					>
						· {user.email}
					</Text>
				</div>
			</div>
			<div className="flex items-center">
				<Dropdown id={user.id} user={user} onUserUpdated={handleUserUpdated} />
			</div>
		</div>
	);
};
