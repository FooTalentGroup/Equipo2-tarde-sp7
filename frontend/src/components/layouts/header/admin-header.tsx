import Image from "next/image";
import Link from "next/link";

import {
	BuildingOfficeIcon,
	HomeIcon,
	UserIcon,
} from "@heroicons/react/24/outline";
import LogoWhite from "@public/images/logo-white.png";
import { Avatar, AvatarFallback, AvatarImage } from "@src/components/ui/avatar";
import { Button } from "@src/components/ui/button";
import { Input } from "@src/components/ui/input";
import { Text } from "@src/components/ui/text";
import { paths } from "@src/lib/paths";
import { Search } from "lucide-react";

export default function AdminHeader() {
	return (
		<header className="px-4 bg-primary text-primary-foreground min-h-(--admin-header-height) grid grid-cols-[0.7fr_1fr_0.7fr] items-center gap-4">
			<Button variant="link" className="w-[271px] h-auto p-0" asChild>
				<Link href={paths.admin.properties.index()}>
					<Image
						src={LogoWhite}
						alt="Red prop"
						width={271}
						height={64}
						className="w-full object-contain"
					/>
				</Link>
			</Button>
			<div className="flex">
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
			</div>
			<div className="justify-self-end">
				<Button variant="ghost" className="h-auto">
					<Avatar>
						<AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
						<AvatarFallback>CN</AvatarFallback>
					</Avatar>
					<Text>Nicolas Rodriguez</Text>
				</Button>
			</div>
		</header>
	);
}
