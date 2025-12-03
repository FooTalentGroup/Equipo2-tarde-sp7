import { regularExps } from "../../../config/regular-exp";

/**
 * DTO para crear un cliente
 * Acepta nombres o IDs para catálogos (contact_category, property_search_type)
 */
export class CreateClientDto {
	constructor(
		// Datos básicos (requeridos)
		public readonly first_name: string,
		public readonly last_name: string,
		public readonly phone: string,

		// Acepta ID o nombre para contact_category
		public readonly contact_category_id: number | undefined,
		public readonly contact_category: string | undefined,

		// Datos opcionales
		public readonly email?: string,
		public readonly dni?: string,
		public readonly property_interest_phone?: string,
		public readonly address?: string,
		public readonly notes?: string,
		public readonly interest_zone?: string,
		public readonly purchase_interest?: boolean,
		public readonly rental_interest?: boolean,

		// Acepta ID o nombre para property_search_type
		public readonly property_search_type_id?: number,
		public readonly property_search_type?: string,

		// Geografía
		public readonly city_id?: number,
		public readonly city?: string,
		public readonly province?: string,
		public readonly country?: string,
	) {}

	static create(object: { [key: string]: any }): [string?, CreateClientDto?] {
		const {
			first_name,
			last_name,
			phone,
			contact_category_id,
			contact_category,
			email,
			dni,
			property_interest_phone,
			address,
			notes,
			interest_zone,
			purchase_interest,
			rental_interest,
			property_search_type_id,
			property_search_type,
			city_id,
			city,
			province,
			country,
		} = object;

		// Validar campos requeridos
		if (!first_name || first_name.trim().length === 0) {
			return ["First name is required", undefined];
		}

		if (first_name.trim().length < 2) {
			return ["First name must be at least 2 characters", undefined];
		}

		if (first_name.trim().length > 100) {
			return ["First name must be less than 100 characters", undefined];
		}

		if (!last_name || last_name.trim().length === 0) {
			return ["Last name is required", undefined];
		}

		if (last_name.trim().length < 2) {
			return ["Last name must be at least 2 characters", undefined];
		}

		if (last_name.trim().length > 100) {
			return ["Last name must be less than 100 characters", undefined];
		}

		if (!phone || phone.trim().length === 0) {
			return ["Phone is required", undefined];
		}

		// Validar formato de teléfono (NO permite letras)
		const trimmedPhone = phone.trim();
		const validCharsRegex = /^[\d\s\-()+.]+$/;
		if (!validCharsRegex.test(trimmedPhone)) {
			return [
				"Invalid phone format: phone can only contain numbers, spaces, dashes, parentheses, plus sign, and dots",
				undefined,
			];
		}

		const digitsOnly = trimmedPhone.replace(/\D/g, "");
		if (digitsOnly.length < 10) {
			return [
				"Invalid phone format: phone must contain at least 10 digits",
				undefined,
			];
		}

		if (digitsOnly.length > 15) {
			return [
				"Invalid phone format: phone must contain at most 15 digits",
				undefined,
			];
		}

		// Validar email si se proporciona
		if (email && email.trim().length > 0) {
			if (!regularExps.email.test(email.trim())) {
				return ["Invalid email format", undefined];
			}
			if (email.trim().length > 255) {
				return ["Email must be less than 255 characters", undefined];
			}
		}

		// Validar property_interest_phone si se proporciona
		if (property_interest_phone && property_interest_phone.trim().length > 0) {
			const trimmedInterestPhone = property_interest_phone.trim();
			if (!validCharsRegex.test(trimmedInterestPhone)) {
				return [
					"Invalid property interest phone format: phone can only contain numbers, spaces, dashes, parentheses, plus sign, and dots",
					undefined,
				];
			}
			const interestDigitsOnly = trimmedInterestPhone.replace(/\D/g, "");
			if (interestDigitsOnly.length < 10) {
				return [
					"Invalid property interest phone format: phone must contain at least 10 digits",
					undefined,
				];
			}
			if (interestDigitsOnly.length > 15) {
				return [
					"Invalid property interest phone format: phone must contain at most 15 digits",
					undefined,
				];
			}
		}

		// Validar DNI si se proporciona
		if (dni && dni.trim().length > 0) {
			const trimmedDni = dni.trim();
			const dniRegex = /^[\d\s-]{7,}$/;
			if (!dniRegex.test(trimmedDni)) {
				return [
					"Invalid DNI format: DNI can only contain numbers, spaces, and dashes",
					undefined,
				];
			}
			const dniDigitsOnly = trimmedDni.replace(/\D/g, "");
			if (dniDigitsOnly.length < 7 || dniDigitsOnly.length > 15) {
				return [
					"Invalid DNI format: DNI must contain between 7 and 15 digits",
					undefined,
				];
			}
		}

		// Validar contact_category: debe tener ID o nombre
		const hasContactCategoryId =
			contact_category_id !== undefined && contact_category_id !== null;
		const hasContactCategoryName =
			contact_category !== undefined && contact_category !== null;

		if (!hasContactCategoryId && !hasContactCategoryName) {
			return [
				'Contact category ID or name is required (e.g., "Lead", "Inquilino", "Propietario")',
				undefined,
			];
		}

		if (hasContactCategoryId && hasContactCategoryName) {
			return [
				"Provide either contact_category_id OR contact_category name, not both",
				undefined,
			];
		}

		if (hasContactCategoryId && isNaN(Number(contact_category_id))) {
			return ["Contact category ID must be a number", undefined];
		}

		// Validar property_search_type si se proporciona
		if (property_search_type_id && property_search_type) {
			return [
				"Provide either property_search_type_id OR property_search_type name, not both",
				undefined,
			];
		}

		if (property_search_type_id && isNaN(Number(property_search_type_id))) {
			return ["Property search type ID must be a number", undefined];
		}

		if (city_id && isNaN(Number(city_id))) {
			return ["City ID must be a number", undefined];
		}

		return [
			undefined,
			new CreateClientDto(
				first_name.trim(),
				last_name.trim(),
				phone.trim(),
				hasContactCategoryId ? Number(contact_category_id) : undefined,
				hasContactCategoryName ? contact_category.trim() : undefined,
				email?.trim(),
				dni?.trim(),
				property_interest_phone?.trim(),
				address?.trim(),
				notes?.trim(),
				interest_zone?.trim(),
				purchase_interest !== undefined
					? Boolean(purchase_interest)
					: undefined,
				rental_interest !== undefined ? Boolean(rental_interest) : undefined,
				property_search_type_id ? Number(property_search_type_id) : undefined,
				property_search_type?.trim(),
				city_id ? Number(city_id) : undefined,
				city?.trim(),
				province?.trim(),
				country?.trim(),
			),
		];
	}
}
