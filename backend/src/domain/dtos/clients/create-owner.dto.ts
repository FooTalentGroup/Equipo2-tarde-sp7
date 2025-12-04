import {
	validateDni,
	validateEmail,
	validateFirstName,
	validateLastName,
	validatePhone,
	validatePropertyId,
} from "../../utils/client-validation.util";

/**
 * DTO para crear un propietario con propiedad asociada
 * Incluye todos los datos del formulario de creación de propietario
 */
export class CreateOwnerDto {
	constructor(
		// Datos básicos del cliente (requeridos)
		public readonly first_name: string,
		public readonly last_name: string,
		public readonly phone: string,

		// Datos opcionales del cliente
		public readonly email?: string,
		public readonly dni?: string,
		public readonly address?: string,
		public readonly notes?: string,

		// Propiedad asociada (opcional)
		public readonly property_id?: number,
	) {}

	static create(object: { [key: string]: any }): [string?, CreateOwnerDto?] {
		const {
			first_name,
			last_name,
			phone,
			email,
			dni,
			address,
			notes,
			property_id,
		} = object;

		// Validar campos requeridos del cliente usando utilidades compartidas
		const firstNameError = validateFirstName(first_name);
		if (firstNameError[0]) return [firstNameError[0], undefined];

		const lastNameError = validateLastName(last_name);
		if (lastNameError[0]) return [lastNameError[0], undefined];

		const phoneError = validatePhone(phone);
		if (phoneError[0]) return [phoneError[0], undefined];

		// Validar email si se proporciona
		const emailError = validateEmail(email, false);
		if (emailError[0]) return [emailError[0], undefined];

		// Validar DNI si se proporciona
		const dniError = validateDni(dni);
		if (dniError[0]) return [dniError[0], undefined];

		// Validar property_id si se proporciona
		const propertyIdError = validatePropertyId(property_id);
		if (propertyIdError[0]) return [propertyIdError[0], undefined];

		return [
			undefined,
			new CreateOwnerDto(
				first_name.trim(),
				last_name.trim(),
				phone.trim(),
				email?.trim(),
				dni?.trim(),
				address?.trim(),
				notes?.trim(),
				property_id ? Number(property_id) : undefined,
			),
		];
	}
}
