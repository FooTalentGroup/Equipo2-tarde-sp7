import { CompanySettingsModel } from "../../data/postgres/models";
import { CustomError } from "../../domain";
import type { FileUploadAdapter } from "../../domain/interfaces/file-upload.adapter";

export class CompanyServices {
	constructor(private readonly fileUploadAdapter: FileUploadAdapter) {}

	
	async getCompanySettings() {
		try {
			const settings = await CompanySettingsModel.findSettings();

			if (!settings) {
				return {
					logo_url: null,
					company_name: "Inmobiliaria",
				};
			}

			return {
				logo_url: settings.logo_url,
				company_name: settings.company_name,
			};
		} catch (error) {
			console.error("Error fetching company settings:", error);
			throw CustomError.internalServerError("Failed to fetch company settings");
		}
	}

	async updateCompanyLogo(file: Express.Multer.File, userId: number) {
		try {
			const allowedMimeTypes = ["image/jpeg", "image/jpg", "image/png"];
			if (!allowedMimeTypes.includes(file.mimetype)) {
				throw CustomError.badRequest(
					"Invalid file format. Only JPG and PNG are allowed",
				);
			}

			const currentSettings = await CompanySettingsModel.findSettings();
			const oldLogoUrl = currentSettings?.logo_url;

			const logoUrl = await this.fileUploadAdapter.uploadFile(file.buffer, {
				folder: "company",
				resourceType: "image",
				publicId: "logo",
			});

			const updatedSettings = await CompanySettingsModel.updateLogo(
				logoUrl,
				userId,
			);

			if (!updatedSettings) {
				throw CustomError.internalServerError("Failed to update company logo");
			}

			if (oldLogoUrl && oldLogoUrl !== logoUrl) {
				try {
					await this.fileUploadAdapter.deleteFile(oldLogoUrl);
				} catch (deleteError) {
					console.error(
						"Error deleting old logo from Cloudinary:",
						deleteError,
					);
				}
			}

			return {
				message: "Logo actualizado exitosamente",
				logo_url: updatedSettings.logo_url,
				company_name: updatedSettings.company_name,
			};
		} catch (error) {
			if (error instanceof CustomError) {
				throw error;
			}
			console.error("Error updating company logo:", error);
			throw CustomError.internalServerError("Failed to update company logo");
		}
	}
}
