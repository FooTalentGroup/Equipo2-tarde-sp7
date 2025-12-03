import { BuildingOfficeIcon } from "@heroicons/react/24/outline";
import { Button } from "@src/components/ui/button";
import { Input } from "@src/components/ui/input";
import { HomeIcon, Search, UserIcon } from "lucide-react";

export default function SearchBar() {
	return (
		<div className="relative bg-card mx-auto foreground max-w-xl w-full rounded-lg overflow-hidden">
			<Button
				variant="link"
				className=" p-0 absolute left-2 top-1/2 -translate-y-1/2 px-0! h-auto"
				tabIndex={-1}
			>
				<Search className="w-5 h-5" />
			</Button>
			<Input
				placeholder=""
				className="pl-8 pr-28 h-9 text-foreground"
				type="text"
			/>
			<div className="absolute right-2 bg-card top-1/2 text-foreground -translate-y-1/2 grid items-center grid-cols-3 w-fit">
				<Button variant="ghost" className="px-2! h-[30px] w-[30px]">
					<UserIcon className="w-5 h-5" />
				</Button>
				<Button variant="ghost" className="px-2! h-[30px] w-[30px]">
					<BuildingOfficeIcon className="w-5 h-5" />
				</Button>
				<Button variant="ghost" className="px-2! h-[30px] w-[30px]">
					<HomeIcon className="w-5 h-5" />
				</Button>
			</div>
		</div>
	);
}
