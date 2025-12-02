import { UserPagination, UserList, UserHeader } from "@src/modules/admin/components";
import users from "@src/data/users.json"
import { Input } from "@src/components/ui/input";

export default function AdminUsersPage() {
	return (
		<section className="grid min-h-dvh max-h-fit grid-rows-[auto_1fr_auto]">
			<header className="flex justify-between border-b border-border pb-8">
				<UserHeader />
			</header>
			<main>
				<Input placeholder="Buscar por nombre" type="text" className="placeholder:text-input-border rounded-md border border-outline-hover mt-4 max-w-[405px] h-[29px] py-1.5 px-3 shadow-input-border" />
				<UserList users={users} />
			</main>
			<footer>
				<UserPagination />
			</footer>
		</section>
	);
}
