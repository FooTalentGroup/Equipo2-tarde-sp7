"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@src/components/ui/button";
import { Card, CardContent, CardHeader } from "@src/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@src/components/ui/form";
import { Heading } from "@src/components/ui/heading";
import { Input } from "@src/components/ui/input";
import { PhoneInput } from "@src/components/ui/phone-input";
import { Spinner } from "@src/components/ui/spinner";
import { Textarea } from "@src/components/ui/textarea";
import { createPropertyConsultation } from "@src/services/consultation-service";
import { useForm } from "react-hook-form";
import type { Country } from "react-phone-number-input";
import { toast } from "sonner";

import { type PropertyContact, propertyContactSchema } from "./schema";

type Props = {
	propertyId: number;
	allowedCountries?: Country[];
};

export default function PropertyContactForm({
	propertyId,
	allowedCountries = ["AR"],
}: Props) {
	const form = useForm<PropertyContact>({
		resolver: zodResolver(propertyContactSchema),
		defaultValues: {
			first_name: "",
			last_name: "",
			email: "",
			phone: "",
			message:
				"Hola, me interesa esta propiedad y me gustaría recibir más información. Gracias.",
		},
	});
	async function onSubmit(data: PropertyContact) {
		try {
			const response = await createPropertyConsultation({
				property_id: propertyId,
				...data,
			});

			if (response.success) {
				toast.success(response.message);
				form.reset();
			} else {
				toast.error(response.message);
			}
		} catch (error) {
			toast.error("Ocurrió un error al enviar la consulta.");
			console.error(error);
		}
	}

	const { isSubmitting } = form.formState;

	return (
		<Card className="sticky top-24">
			<CardHeader>
				<Heading variant="subtitle1" weight="semibold">
					Contacto
				</Heading>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-3">
						<FormField
							control={form.control}
							name="first_name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Nombre</FormLabel>
									<FormControl>
										<Input placeholder="Juan" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="last_name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Apellido</FormLabel>
									<FormControl>
										<Input placeholder="Pérez" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input placeholder="juan.perez@example.com" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="phone"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Teléfono</FormLabel>
									<FormControl>
										<PhoneInput
											defaultCountry="AR"
											countries={allowedCountries}
											placeholder="Ingresá un número de teléfono"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="message"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Mensaje</FormLabel>
									<FormControl>
										<Textarea
											rows={4}
											placeholder="Escribí tu mensaje aquí..."
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<Button
							type="submit"
							className="w-full mt-3"
							size="lg"
							disabled={isSubmitting}
						>
							{isSubmitting && <Spinner className="mr-2 h-4 w-4" />}
							Enviar
						</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
}
