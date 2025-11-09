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

type CreateClientPageProps = {
	client?: {
		name: string;
		email: string;
		number: string;
	};
	handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	handleAddClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

export default function CreateClient({
	client,
	handleChange,
	handleAddClick,
}: CreateClientPageProps) {
	return (
		<Dialog>
			<form>
				<DialogTrigger asChild>
					<Button variant="outline">Crear cliente</Button>
				</DialogTrigger>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>Creacion del cliente</DialogTitle>
						<DialogDescription>
							Ingrese los detalles del nuevo inquilino
						</DialogDescription>
					</DialogHeader>
					<div className="grid gap-4">
						<div className="grid gap-3">
							<Label htmlFor="name">Nombre</Label>
							<Input
								type="text"
								id="name"
								name="name"
								required
								placeholder="Pedro Duarte"
								value={client?.name || ""}
								onChange={handleChange}
							/>
						</div>
						<div className="grid gap-3">
							<Label htmlFor="email">Email</Label>
							<Input
								type="email"
								id="email"
								name="email"
								required
								placeholder="peduarte@example.com"
								value={client?.email || ""}
								onChange={handleChange}
							/>
						</div>
						<div className="grid gap-3">
							<Label htmlFor="number">Número</Label>
							<Input
								type="text"
								name="number"
								id="number"
								required
								placeholder="04156218952"
								value={client?.number || ""}
								onChange={handleChange}
							/>
						</div>
					</div>
					<DialogFooter>
						<Button onClick={handleAddClick} type="submit">
							Guardar
						</Button>
						<DialogClose asChild>
							<Button variant="outline">Cancelar</Button>
						</DialogClose>
					</DialogFooter>
				</DialogContent>
			</form>
		</Dialog>
	);
}
