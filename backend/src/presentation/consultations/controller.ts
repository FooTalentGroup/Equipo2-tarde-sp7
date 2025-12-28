import type { Request, Response } from "express";

import { CustomError } from "../../domain";
import { CreatePropertyConsultationDto } from "../../domain/dtos/consultations/create-property-consultation.dto";
import { CreateGeneralConsultationDto } from "../../domain/dtos/consultations/create-general-consultation.dto";
import { DeleteMultipleConsultationsDto } from "../../domain/dtos/consultations/delete-multiple-consultations.dto";
import type { PropertyConsultationServices } from "../services/property-consultation.services";

export class ConsultationController {
	constructor(
		private readonly consultationServices: PropertyConsultationServices,
	) {}

	private handleError = (error: unknown, res: Response) => {
		if (error instanceof CustomError) {
			return res.status(error.statusCode).json({
				message: error.message,
			});
		}
		console.error("Consultation Controller Error:", error);
		return res.status(500).json({
			message: "Internal server error",
		});
	};

	createPropertyConsultation = async (req: Request, res: Response) => {
		try {
			const [error, createConsultationDto] =
				CreatePropertyConsultationDto.create(req.body);

			if (error || !createConsultationDto) {
				return res.status(400).json({
					message: error || "Invalid data",
				});
			}

			const result = await this.consultationServices.createPropertyConsultation(
				createConsultationDto,
			);

			return res.status(201).json(result);
		} catch (error) {
			this.handleError(error, res);
		}
	};

	createGeneralConsultation = async (req: Request, res: Response) => {
		try {
			const [error, createConsultationDto] =
				CreateGeneralConsultationDto.create(req.body);

			if (error || !createConsultationDto) {
				return res.status(400).json({
					message: error || "Invalid data",
				});
			}

			const result = await this.consultationServices.createGeneralConsultation(
				createConsultationDto,
			);

			return res.status(201).json(result);
		} catch (error) {
			this.handleError(error, res);
		}
	};

	getAllConsultations = async (req: Request, res: Response) => {
		try {
			const user = req.user;
			if (!user || !user.id) {
				return res.status(401).json({
					message: "User not authenticated",
				});
			}

			const {
				limit,
				offset,
				consultation_type_id,
				start_date,
				end_date,
				is_read,
			} = req.query;

			const filters = {
				limit: limit ? parseInt(limit as string) : undefined,
				offset: offset ? parseInt(offset as string) : undefined,
				consultation_type_id: consultation_type_id
					? parseInt(consultation_type_id as string)
					: undefined,
				start_date: start_date as string,
				end_date: end_date as string,
				is_read: is_read !== undefined ? is_read === "true" : undefined,
			};

			const result =
				await this.consultationServices.getAllConsultations(filters);

			return res.status(200).json(result);
		} catch (error) {
			this.handleError(error, res);
		}
	};

	deleteConsultation = async (req: Request, res: Response) => {
		try {
			const user = req.user;
			if (!user || !user.id) {
				return res.status(401).json({
					message: "User not authenticated",
				});
			}

			const { id } = req.params;
			const consultationId = parseInt(id);

			if (isNaN(consultationId) || consultationId <= 0) {
				return res.status(400).json({
					message: "Invalid consultation ID",
				});
			}

			const result =
				await this.consultationServices.deleteConsultation(consultationId);

			return res.status(200).json(result);
		} catch (error) {
			this.handleError(error, res);
		}
	};

	deleteMultipleConsultations = async (req: Request, res: Response) => {
		try {
			const user = req.user;
			if (!user || !user.id) {
				return res.status(401).json({
					message: "User not authenticated",
				});
			}

			const [error, deleteDto] = DeleteMultipleConsultationsDto.create(
				req.body,
			);

			if (error || !deleteDto) {
				return res.status(400).json({
					message: error || "Invalid data",
				});
			}

			const result =
				await this.consultationServices.deleteMultipleConsultations(
					deleteDto.consultation_ids,
				);

			return res.status(200).json(result);
		} catch (error) {
			this.handleError(error, res);
		}
	};

	markAsRead = async (req: Request, res: Response) => {
		try {
			const user = req.user;
			if (!user || !user.id) {
				return res.status(401).json({
					message: "User not authenticated",
				});
			}

			const { id } = req.params;
			const consultationId = parseInt(id);

			if (isNaN(consultationId) || consultationId <= 0) {
				return res.status(400).json({
					message: "Invalid consultation ID",
				});
			}

			const result = await this.consultationServices.markAsRead(consultationId);

			return res.status(200).json(result);
		} catch (error) {
			this.handleError(error, res);
		}
	};

	markAsUnread = async (req: Request, res: Response) => {
		try {
			const user = req.user;
			if (!user || !user.id) {
				return res.status(401).json({
					message: "User not authenticated",
				});
			}

			const { id } = req.params;
			const consultationId = parseInt(id);

			if (isNaN(consultationId) || consultationId <= 0) {
				return res.status(400).json({
					message: "Invalid consultation ID",
				});
			}

			const result = await this.consultationServices.markAsUnread(consultationId);

			return res.status(200).json(result);
		} catch (error) {
			this.handleError(error, res);
		}
	};

	convertConsultationToLead = async (req: Request, res: Response) => {
		try {
			const user = req.user;
			if (!user || !user.id) {
				return res.status(401).json({
					message: "User not authenticated",
				});
			}

			const { id } = req.params;
			const consultationId = parseInt(id);

			if (isNaN(consultationId) || consultationId <= 0) {
				return res.status(400).json({
					message: "Invalid consultation ID",
				});
			}

			const result = await this.consultationServices.convertConsultationToLead(
				consultationId,
				Number(user.id),
			);

			return res.status(200).json(result);
		} catch (error) {
			this.handleError(error, res);
		}
	};
}
