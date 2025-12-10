import type { Request, Response } from "express";

import {
	CreatePropertyDto,
	CreatePropertyGroupedDto,
	UpdatePropertyGroupedDto,
	CustomError,
} from "../../domain";
import type { PropertyServices } from "../services/property.services";

export class PropertyController {
	constructor(private readonly propertyServices: PropertyServices) {}

	private handleError = (error: unknown, res: Response) => {
		if (error instanceof CustomError) {
			return res.status(error.statusCode).json({
				message: error.message,
			});
		}
		console.error("Property Controller Error:", error);
		return res.status(500).json({
			message: "Internal server error",
		});
	};

	/**
	 * Crea una nueva propiedad
	 *
	 * Form-data esperado:
	 * - propertyDetails: JSON string con detalles de la propiedad
	 * - geography: JSON string con {country, province, city}
	 * - address: JSON string con {street, number, neighborhood, etc.}
	 * - prices: JSON string con array de precios
	 * - images: Array de archivos (opcional)
	 */
	createProperty = async (req: Request, res: Response) => {
		try {
			// Obtener usuario del token (viene del middleware de autenticación)
			const user = (req as any).user;
			if (!user || !user.id) {
				return res.status(401).json({
					message: "User not authenticated",
				});
			}

			const capturedByUserId = parseInt(user.id, 10);
			if (isNaN(capturedByUserId)) {
				return res.status(400).json({
					message: "Invalid user ID",
				});
			}

			// Obtener imágenes del request (pueden venir como array o como campo único)
			const images: Express.Multer.File[] = [];
			if (req.files) {
				if (Array.isArray(req.files)) {
					images.push(...req.files);
				} else if (req.files.images) {
					const files = Array.isArray(req.files.images)
						? req.files.images
						: [req.files.images];
					images.push(...files);
				} else if (req.files.property_file) {
					const files = Array.isArray(req.files.property_file)
						? req.files.property_file
						: [req.files.property_file];
					images.push(...files);
				}
			} else if (req.file) {
				images.push(req.file);
			}

			// owner_id debe venir en el request (cliente propietario de la propiedad)
			// captured_by_user_id es el usuario autenticado (agente que crea la propiedad)

			// Validar y crear DTO (el owner_id debe venir en propertyDetails o en el body)
			const [error, createPropertyDto] = CreatePropertyDto.create(req.body);

			if (error || !createPropertyDto) {
				return res.status(400).json({
					message: error || "Invalid property data",
				});
			}

			// Crear propiedad (todo en transacción)
			const result = await this.propertyServices.createProperty(
				createPropertyDto,
				capturedByUserId,
				images.length > 0 ? images : undefined,
			);

			return res.status(201).json({
				message: "Property created successfully",
				data: result,
			});
		} catch (error) {
			this.handleError(error, res);
		}
	};

	/**
	 * Obtiene una propiedad por ID con todas sus relaciones
	 */
	getPropertyById = async (req: Request, res: Response) => {
		try {
			const { id } = req.params;
			const includeArchived = req.query.includeArchived === "true";

			if (!id || isNaN(Number(id))) {
				return res.status(400).json({
					message: "Invalid property ID",
				});
			}

			const result = await this.propertyServices.getPropertyById(
				Number(id),
				includeArchived,
			);
			return res.json(result);
		} catch (error) {
			this.handleError(error, res);
		}
	};

	/**
	 * Lists properties with optional filters
	 */
	listProperties = async (req: Request, res: Response) => {
		try {
			const {
				property_type_id,
				property_status_id,
				visibility_status_id,
				owner_id,
				captured_by_user_id,
				city_id,
				min_price,
				max_price,
				operation_type_id,
				currency_type_id,
				featured_web,
				search,
				includeArchived,
				limit,
				offset,
			} = req.query;

			const filters: any = {};

			if (property_type_id) filters.property_type_id = Number(property_type_id);
			if (property_status_id)
				filters.property_status_id = Number(property_status_id);
			if (visibility_status_id)
				filters.visibility_status_id = Number(visibility_status_id);
			if (owner_id) filters.owner_id = Number(owner_id);
			if (captured_by_user_id)
				filters.captured_by_user_id = Number(captured_by_user_id);
			if (city_id) filters.city_id = Number(city_id);
			if (min_price) filters.min_price = Number(min_price);
			if (max_price) filters.max_price = Number(max_price);
			if (operation_type_id)
				filters.operation_type_id = Number(operation_type_id);
			if (currency_type_id) filters.currency_type_id = Number(currency_type_id);
			if (featured_web !== undefined)
				filters.featured_web = featured_web === "true";
			if (search) filters.search = String(search);
			if (includeArchived === "true") filters.includeArchived = true;
			if (limit) filters.limit = Number(limit);
			if (offset) filters.offset = Number(offset);

			const result = await this.propertyServices.listProperties(filters);
			return res.json(result);
		} catch (error) {
			this.handleError(error, res);
		}
	};

	/**
	 * Actualiza una propiedad
	 */
	updateProperty = async (req: Request, res: Response) => {
		try {
			const { id } = req.params;

			if (!id || isNaN(Number(id))) {
				return res.status(400).json({
					message: "Invalid property ID",
				});
			}

			// Parsear body si viene como JSON string (form-data)
			let updateData: any = req.body;
			if (typeof req.body.propertyDetails === "string") {
				try {
					updateData = JSON.parse(req.body.propertyDetails);
				} catch (error) {
					return res.status(400).json({
						message: "Invalid propertyDetails JSON format",
					});
				}
			}

			const result = await this.propertyServices.updateProperty(
				Number(id),
				updateData,
			);
			return res.json({
				message: "Property updated successfully",
				data: result,
			});
		} catch (error) {
			this.handleError(error, res);
		}
	};

	/**
	 * Archiva una propiedad
	 */
	archiveProperty = async (req: Request, res: Response) => {
		try {
			const { id } = req.params;

			if (!id || isNaN(Number(id))) {
				return res.status(400).json({
					message: "Invalid property ID",
				});
			}

			const result = await this.propertyServices.archiveProperty(Number(id));
			return res.json(result);
		} catch (error) {
			this.handleError(error, res);
		}
	};

	/**
	 * Archives a property using grouped structure (allows additional updates)
	 */
	archivePropertyGrouped = async (req: Request, res: Response) => {
		try {
			const { id } = req.params;

			if (!id || isNaN(Number(id))) {
				return res.status(400).json({
					message: "Invalid property ID",
				});
			}

			// Get images
			const images: Express.Multer.File[] = [];
			if (req.files) {
				if (typeof req.files === "object" && !Array.isArray(req.files)) {
					const filesObj = req.files as {
						[fieldname: string]: Express.Multer.File[];
					};
					if (filesObj.images) {
						const files = Array.isArray(filesObj.images)
							? filesObj.images
							: [filesObj.images];
						images.push(...files);
					}
				} else if (Array.isArray(req.files)) {
					images.push(...req.files);
				}
			}

			// Get PDF documents
			const documents: Express.Multer.File[] = [];
			let documentNames: string[] = [];

			if (req.files && typeof req.files === "object") {
				const filesObj = req.files as {
					[fieldname: string]: Express.Multer.File[];
				};
				if (filesObj.documents) {
					const files = Array.isArray(filesObj.documents)
						? filesObj.documents
						: [filesObj.documents];
					documents.push(...files);
				}
			}

			// Get document names if provided
			if (req.body.documentNames) {
				try {
					if (typeof req.body.documentNames === "string") {
						documentNames = JSON.parse(req.body.documentNames);
					} else if (Array.isArray(req.body.documentNames)) {
						documentNames = req.body.documentNames;
					}
				} catch (error) {
					console.warn("Could not parse documentNames, using defaults");
				}
			}

			// Prepare body data for DTO creation, ensuring visibility_status is "Archivada"
			const bodyWithArchive: any = { ...req.body };
			
			// Parse and merge basic data if it exists, or create new
			let basicData: any = { visibility_status: "Archivada" };
			if (bodyWithArchive.basic) {
				try {
					const parsedBasic = typeof bodyWithArchive.basic === 'string' 
						? JSON.parse(bodyWithArchive.basic) 
						: bodyWithArchive.basic;
					basicData = { ...parsedBasic, visibility_status: "Archivada" };
				} catch (error) {
					// If parsing fails, use default with archive status
					basicData = { visibility_status: "Archivada" };
				}
			}
			bodyWithArchive.basic = JSON.stringify(basicData);

			// Validate and create grouped DTO
			const [error, initialDto] = UpdatePropertyGroupedDto.create(
				bodyWithArchive,
			);
			
			let updatePropertyGroupedDto = initialDto;

			if (error || !initialDto) {
				// If validation fails because no fields provided, create minimal DTO for archiving
				if (!req.body.basic && !req.body.geography && !req.body.address &&
					!req.body.values && !req.body.characteristics && !req.body.surface &&
					!req.body.services && !req.body.internal) {
					// No fields provided, create minimal DTO just for archiving
					const [archiveError, archiveDto] = UpdatePropertyGroupedDto.create({
						basic: JSON.stringify({ visibility_status: "Archivada" })
					});
					
					if (archiveError || !archiveDto) {
						return res.status(400).json({
							message: "Failed to create archive DTO",
						});
					}
					
					// Use the archive DTO
					const result = await this.propertyServices.updatePropertyGrouped(
						Number(id),
						archiveDto,
						images.length > 0 ? images : undefined,
						documents.length > 0 ? documents : undefined,
						documentNames.length > 0 ? documentNames : undefined,
					);

					return res.status(200).json({
						message: "Property archived successfully",
						data: result,
					});
				}
				
				return res.status(400).json({
					message: error || "Invalid property update data",
				});
			}

			// At this point, updatePropertyGroupedDto is guaranteed to be defined
			if (!updatePropertyGroupedDto) {
				return res.status(400).json({
					message: "Failed to create update DTO",
				});
			}

			// Ensure visibility_status is always "Archivada" (create new basic object if needed)
			if (!updatePropertyGroupedDto.basic || Object.keys(updatePropertyGroupedDto.basic).length === 0) {
				// Create a new DTO with basic field set
				const newDto = new UpdatePropertyGroupedDto(
					{ visibility_status: "Archivada" },
					updatePropertyGroupedDto.geography,
					updatePropertyGroupedDto.address,
					updatePropertyGroupedDto.values,
					updatePropertyGroupedDto.characteristics,
					updatePropertyGroupedDto.surface,
					updatePropertyGroupedDto.services,
					updatePropertyGroupedDto.internal,
				);
				updatePropertyGroupedDto = newDto;
			} else {
				// Create new DTO with merged basic data that includes visibility_status
				const mergedBasic = { 
					...updatePropertyGroupedDto.basic, 
					visibility_status: "Archivada" 
				};
				const newDto = new UpdatePropertyGroupedDto(
					mergedBasic,
					updatePropertyGroupedDto.geography,
					updatePropertyGroupedDto.address,
					updatePropertyGroupedDto.values,
					updatePropertyGroupedDto.characteristics,
					updatePropertyGroupedDto.surface,
					updatePropertyGroupedDto.services,
					updatePropertyGroupedDto.internal,
				);
				updatePropertyGroupedDto = newDto;
			}

			// Archive and update property (all in transaction)
			const result = await this.propertyServices.updatePropertyGrouped(
				Number(id),
				updatePropertyGroupedDto,
				images.length > 0 ? images : undefined,
				documents.length > 0 ? documents : undefined,
				documentNames.length > 0 ? documentNames : undefined,
			);

			return res.status(200).json({
				message: "Property archived successfully",
				data: result,
			});
		} catch (error) {
			this.handleError(error, res);
		}
	};

	/**
	 * Restaura una propiedad archivada
	 */
	unarchiveProperty = async (req: Request, res: Response) => {
		try {
			const { id } = req.params;
			const { visibility_status_id } = req.body;

			if (!id || isNaN(Number(id))) {
				return res.status(400).json({
					message: "Invalid property ID",
				});
			}

			const result = await this.propertyServices.unarchiveProperty(
				Number(id),
				visibility_status_id ? Number(visibility_status_id) : undefined,
			);
			return res.json(result);
		} catch (error) {
			this.handleError(error, res);
		}
	};

	/**
	 * Toggle featured_web status (publish/unpublish on landing page)
	 * Only admin can publish/unpublish properties on the landing page
	 */
	toggleFeaturedWeb = async (req: Request, res: Response) => {
		try {
			const { id } = req.params;
			const { featured_web } = req.body;

			if (!id || isNaN(Number(id))) {
				return res.status(400).json({
					message: "Invalid property ID",
				});
			}

			if (typeof featured_web !== "boolean") {
				return res.status(400).json({
					message: "featured_web must be a boolean value (true or false)",
				});
			}

			// Update only the featured_web field
			const result = await this.propertyServices.updateProperty(Number(id), {
				featured_web,
			});

			const action = featured_web ? "publicada en" : "despublicada de";
			return res.json({
				message: `Property ${action} la landing page exitosamente`,
				data: result,
			});
		} catch (error) {
			this.handleError(error, res);
		}
	};

	/**
	 * Elimina físicamente una propiedad (hard delete)
	 */
	deleteProperty = async (req: Request, res: Response) => {
		try {
			const { id } = req.params;

			if (!id || isNaN(Number(id))) {
				return res.status(400).json({
					message: "Invalid property ID",
				});
			}

			const result = await this.propertyServices.deleteProperty(Number(id));
			return res.json(result);
		} catch (error) {
			this.handleError(error, res);
		}
	};

	/**
	 * Creates a new property using grouped structure
	 *
	 * Expected form-data:
	 * - Basic: JSON string with basic information
	 * - Geography: JSON string with {country, province, city}
	 * - Address: JSON string with {street, number, neighborhood, etc.}
	 * - Characteristics: JSON string (optional) with physical characteristics
	 * - Surface: JSON string (optional) with surface data
	 * - Services: JSON string (optional) with {services: ["name1", "name2"]}
	 * - Values: JSON string with {prices: [...], expenses: [...]}
	 * - Internal: JSON string (optional) with internal information
	 * - images: Array of files (optional)
	 * - documents: Array of PDF files (optional)
	 * - documentNames: JSON string array with document names (optional, must match documents)
	 */
	createPropertyGrouped = async (req: Request, res: Response) => {
		try {
			// Get user from token
			const user = (req as any).user;
			if (!user || !user.id) {
				return res.status(401).json({
					message: "User not authenticated",
				});
			}

			const capturedByUserId = parseInt(user.id, 10);
			if (isNaN(capturedByUserId)) {
				return res.status(400).json({
					message: "Invalid user ID",
				});
			}

			// Get images
			const images: Express.Multer.File[] = [];
			if (req.files) {
				if (typeof req.files === "object" && !Array.isArray(req.files)) {
					const filesObj = req.files as {
						[fieldname: string]: Express.Multer.File[];
					};
					if (filesObj.images) {
						const files = Array.isArray(filesObj.images)
							? filesObj.images
							: [filesObj.images];
						images.push(...files);
					}
				} else if (Array.isArray(req.files)) {
					// If files come as array, they might all be images
					images.push(...req.files);
				}
			}

			// Debug: Log files received
			console.log("Files received:", {
				hasFiles: !!req.files,
				filesType: typeof req.files,
				isArray: Array.isArray(req.files),
				imagesCount: images.length,
				fileKeys:
					req.files && typeof req.files === "object"
						? Object.keys(req.files as object)
						: [],
			});

			// Get PDF documents
			const documents: Express.Multer.File[] = [];
			let documentNames: string[] = [];

			if (req.files && typeof req.files === "object") {
				const filesObj = req.files as {
					[fieldname: string]: Express.Multer.File[];
				};
				if (filesObj.documents) {
					const files = Array.isArray(filesObj.documents)
						? filesObj.documents
						: [filesObj.documents];
					documents.push(...files);
				}
			}

			// Get document names if provided
			if (req.body.documentNames) {
				try {
					if (typeof req.body.documentNames === "string") {
						documentNames = JSON.parse(req.body.documentNames);
					} else if (Array.isArray(req.body.documentNames)) {
						documentNames = req.body.documentNames;
					}
				} catch (error) {
					// If parsing fails, use default names
					console.warn("Could not parse documentNames, using defaults");
				}
			}

			// Debug: Log the raw body to see what's being received
			console.log('[PropertyController] req.body.basic (raw):', req.body.basic);
			if (req.body.basic && typeof req.body.basic === 'string') {
				try {
					const parsed = JSON.parse(req.body.basic);
					console.log('[PropertyController] req.body.basic (parsed):', parsed);
					console.log('[PropertyController] parsed.owner_id:', parsed.owner_id, 'type:', typeof parsed.owner_id);
				} catch (e) {
					console.error('[PropertyController] Error parsing basic JSON:', e);
				}
			}

			// Validate and create grouped DTO
			const [error, createPropertyGroupedDto] = CreatePropertyGroupedDto.create(
				req.body,
			);

			if (error || !createPropertyGroupedDto) {
				return res.status(400).json({
					message: error || "Invalid property data",
				});
			}

			// Create property (all in transaction)
			const result = await this.propertyServices.createPropertyGrouped(
				createPropertyGroupedDto,
				capturedByUserId,
				images.length > 0 ? images : undefined,
				documents.length > 0 ? documents : undefined,
				documentNames.length > 0 ? documentNames : undefined,
			);

			return res.status(201).json({
				message: "Property created successfully",
				data: result,
			});
		} catch (error) {
			this.handleError(error, res);
		}
	};

	/**
	 * Updates a property using grouped structure
	 */
	updatePropertyGrouped = async (req: Request, res: Response) => {
		try {
			const { id } = req.params;

			if (!id || isNaN(Number(id))) {
				return res.status(400).json({
					message: "Invalid property ID",
				});
			}

			// Get images
			const images: Express.Multer.File[] = [];
			if (req.files) {
				if (typeof req.files === "object" && !Array.isArray(req.files)) {
					const filesObj = req.files as {
						[fieldname: string]: Express.Multer.File[];
					};
					if (filesObj.images) {
						const files = Array.isArray(filesObj.images)
							? filesObj.images
							: [filesObj.images];
						images.push(...files);
					}
				} else if (Array.isArray(req.files)) {
					images.push(...req.files);
				}
			}

			// Get PDF documents
			const documents: Express.Multer.File[] = [];
			let documentNames: string[] = [];

			if (req.files && typeof req.files === "object") {
				const filesObj = req.files as {
					[fieldname: string]: Express.Multer.File[];
				};
				if (filesObj.documents) {
					const files = Array.isArray(filesObj.documents)
						? filesObj.documents
						: [filesObj.documents];
					documents.push(...files);
				}
			}

			// Get document names if provided
			if (req.body.documentNames) {
				try {
					if (typeof req.body.documentNames === "string") {
						documentNames = JSON.parse(req.body.documentNames);
					} else if (Array.isArray(req.body.documentNames)) {
						documentNames = req.body.documentNames;
					}
				} catch (error) {
					console.warn("Could not parse documentNames, using defaults");
				}
			}

			// Validate and create grouped DTO
			const [error, updatePropertyGroupedDto] = UpdatePropertyGroupedDto.create(
				req.body,
			);

			if (error || !updatePropertyGroupedDto) {
				return res.status(400).json({
					message: error || "Invalid property update data",
				});
			}

			// Update property (all in transaction)
			const result = await this.propertyServices.updatePropertyGrouped(
				Number(id),
				updatePropertyGroupedDto,
				images.length > 0 ? images : undefined,
				documents.length > 0 ? documents : undefined,
				documentNames.length > 0 ? documentNames : undefined,
			);

			return res.status(200).json({
				message: "Property updated successfully",
				data: result,
			});
		} catch (error) {
			this.handleError(error, res);
		}
	};
}
