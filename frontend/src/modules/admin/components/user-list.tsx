import type { ListUserProps } from "../types";
import { UserCard } from "./user-card";

export function UserList({ users }: ListUserProps) {
	return (
		<ul className="flex flex-col">
			<li>
				{users.map((user) => {
					return <UserCard key={user.id} user={user} />;
				})}
			</li>
		</ul>
	);
}
