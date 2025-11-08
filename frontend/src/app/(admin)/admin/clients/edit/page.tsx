import { Button } from "@src/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@src/components/ui/dialog";
import { Input } from "@src/components/ui/input";
import { Label } from "@src/components/ui/label";
import { Pencil } from "lucide-react";

type Client = {
	id: number;
	name: string;
	email: string;
	number: string;
};

type EditClientModalProps = {
	client?: Client;
	onSave: (updatedClient: Client) => void;
};

export default function EditClientModal({
	client,
	onSave,
}: EditClientModalProps) {
	if (!client) {
		return (
			<Button variant="outline" disabled>
				<Pencil />
			</Button>
		);
	}

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);

		const updatedClient = {
			id: client.id,
			name: formData.get("name") as string,
			email: formData.get("email") as string,
			number: formData.get("number") as string,
		};

		onSave(updatedClient);
	};

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="outline">
					<Pencil />
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Editar cliente</DialogTitle>
					<DialogDescription>
						Modifique los detalles del cliente {client.name}{" "}
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit}>
					<div className="grid gap-4 py-4">
						<div className="grid gap-3">
							<Label htmlFor="edit-name">Nombre</Label>
							<Input
								type="text"
								id="edit-name"
								name="name"
								placeholder="Pedro Duarte"
								defaultValue={client.name}
								required
							/>
						</div>
						<div className="grid gap-3">
							<Label htmlFor="edit-email">Email</Label>
							<Input
								type="email"
								id="edit-email"
								name="email"
								placeholder="peduarte@example.com"
								defaultValue={client.email}
								required
							/>
						</div>
						<div className="grid gap-3">
							<Label htmlFor="edit-number">Número</Label>
							<Input
								type="text"
								name="number"
								id="edit-number"
								placeholder="04156218952"
								defaultValue={client.number}
								required
							/>
						</div>
					</div>
					<DialogFooter>
						<DialogClose asChild>
							<Button type="submit">Guardar cambios</Button>
						</DialogClose>
						<DialogClose asChild>
							<Button variant="outline">Cancelar</Button>
						</DialogClose>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
