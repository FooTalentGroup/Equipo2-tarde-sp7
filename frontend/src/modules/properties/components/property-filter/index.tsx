import { Card, CardContent } from "@src/components/ui/card";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@src/components/ui/select";

export default function PropertyFilter() {
	return (
		<Card>
			<CardContent className="flex items-center gap-4 justify-between">
				<Select>
					<SelectTrigger className="w-[180px]">
						<SelectValue placeholder="Select a fruit" />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							<SelectLabel>Fruits</SelectLabel>
							<SelectItem value="apple">Apple</SelectItem>
							<SelectItem value="banana">Banana</SelectItem>
							<SelectItem value="blueberry">Blueberry</SelectItem>
							<SelectItem value="grapes">Grapes</SelectItem>
							<SelectItem value="pineapple">Pineapple</SelectItem>
						</SelectGroup>
					</SelectContent>
				</Select>
				<Select>
					<SelectTrigger className="w-[180px]">
						<SelectValue placeholder="Select a fruit" />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							<SelectLabel>Tipo de propiedad</SelectLabel>
							<SelectItem value="apple">Apple</SelectItem>
							<SelectItem value="banana">Banana</SelectItem>
							<SelectItem value="blueberry">Blueberry</SelectItem>
							<SelectItem value="grapes">Grapes</SelectItem>
							<SelectItem value="pineapple">Pineapple</SelectItem>
						</SelectGroup>
					</SelectContent>
				</Select>
			</CardContent>
		</Card>
	);
}
