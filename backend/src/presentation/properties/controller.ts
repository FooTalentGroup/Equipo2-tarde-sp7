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

	createProperty = async (req: Request, res: Response) => {
		try {
			const user = req.user;
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

			const [error, createPropertyDto] = CreatePropertyDto.create(req.body);

			if (error || !createPropertyDto) {
				return res.status(400).json({
					message: error || "Invalid property data",
				});
			}

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

			const filters: Record<string, unknown> = {};

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

	updateProperty = async (req: Request, res: Response) => {
		try {
			const { id } = req.params;

			if (!id || isNaN(Number(id))) {
				return res.status(400).json({
					message: "Invalid property ID",
				});
			}

			let updateData: Record<string, unknown> = req.body;
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

	archivePropertyGrouped = async (req: Request, res: Response) => {
		try {
			const { id } = req.params;

			if (!id || isNaN(Number(id))) {
				return res.status(400).json({
					message: "Invalid property ID",
				});
			}

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

			const bodyWithArchive: Record<string, unknown> = { ...req.body };
			let basicData: Record<string, unknown> = { visibility_status: "Archivada" };
			if (bodyWithArchive.basic) {
				try {
					const parsedBasic = typeof bodyWithArchive.basic === 'string' 
						? JSON.parse(bodyWithArchive.basic) 
						: bodyWithArchive.basic;
					basicData = { ...parsedBasic, visibility_status: "Archivada" };
				} catch (error) {
					basicData = { visibility_status: "Archivada" };
				}
			}
			bodyWithArchive.basic = JSON.stringify(basicData);

			const [error, initialDto] = UpdatePropertyGroupedDto.create(
				bodyWithArchive,
			);
			
			let updatePropertyGroupedDto = initialDto;

			if (error || !initialDto) {
				if (!req.body.basic && !req.body.geography && !req.body.address &&
					!req.body.values && !req.body.characteristics && !req.body.surface &&
					!req.body.services && !req.body.internal) {
					const [archiveError, archiveDto] = UpdatePropertyGroupedDto.create({
						basic: JSON.stringify({ visibility_status: "Archivada" })
					});
					
					if (archiveError || !archiveDto) {
						return res.status(400).json({
							message: "Failed to create archive DTO",
						});
					}
					
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

			if (!updatePropertyGroupedDto) {
				return res.status(400).json({
					message: "Failed to create update DTO",
				});
			}

			if (!updatePropertyGroupedDto.basic || Object.keys(updatePropertyGroupedDto.basic).length === 0) {
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


	createPropertyGrouped = async (req: Request, res: Response) => {
		try {
			const user = req.user;
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

			console.log('[PropertyController] req.body.basic (raw):', req.body.basic);
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

			const [error, createPropertyGroupedDto] = CreatePropertyGroupedDto.create(
				req.body,
			);

			if (error || !createPropertyGroupedDto) {
				return res.status(400).json({
					message: error || "Invalid property data",
				});
			}

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

	updatePropertyGrouped = async (req: Request, res: Response) => {
		try {
			const { id } = req.params;

			if (!id || isNaN(Number(id))) {
				return res.status(400).json({
					message: "Invalid property ID",
				});
			}

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

			const [error, updatePropertyGroupedDto] = UpdatePropertyGroupedDto.create(
				req.body,
			);

			if (error || !updatePropertyGroupedDto) {
				return res.status(400).json({
					message: error || "Invalid property update data",
				});
			}

			const user = (req as any).user;
			const userId = user?.id ? parseInt(user.id, 10) : undefined;

			const result = await this.propertyServices.updatePropertyGrouped(
			Number(id),
			updatePropertyGroupedDto,
			images.length > 0 ? images : undefined,
			documents.length > 0 ? documents : undefined,
			documentNames.length > 0 ? documentNames : undefined,
			userId,
		);

			return res.status(200).json({
				message: "Property updated successfully",
				data: result,
			});
		} catch (error) {
			this.handleError(error, res);
		}
	};

	getDocumentDownloadUrl = async (req: Request, res: Response) => {
		try {
			const { documentId } = req.params;
			if (!documentId || isNaN(Number(documentId))) {
				return res.status(400).json({
					message: "Invalid document ID",
				});
			}

			const { PropertyDocumentModel } = await import(
				"../../data/postgres/models/properties/property-document.model"
			);
			const document = await PropertyDocumentModel.findById(Number(documentId));
			if (!document) {
				return res.status(404).json({
					message: "Document not found",
				});
			}

			const downloadUrl = document.file_path.replace(
				"/upload/",
				"/upload/fl_attachment/",
			);
			return res.json({
				document: {
					id: document.id,
					document_name: document.document_name,
					file_path: document.file_path,
					download_url: downloadUrl,
					uploaded_at: document.uploaded_at,
				},
			});
		} catch (error) {
			this.handleError(error, res);
		}
	};
}
