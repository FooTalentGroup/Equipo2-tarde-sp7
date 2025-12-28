import { PostgresDatabase } from "../../database";
import { SqlParams } from '../../../types/sql.types';

export interface CompanySettings {
	id: number;
	logo_url: string | null;
	company_name: string;
	updated_at: Date;
	updated_by_user_id: number | null;
}

export class CompanySettingsModel {
	
	static async findSettings(): Promise<CompanySettings | null> {
		const client = PostgresDatabase.getClient();

		try {
			const result = await client.query(
				"SELECT * FROM company_settings WHERE id = 1",
			);

			return result.rows[0] || null;
		} catch (error) {
			console.error("Error fetching company settings:", error);
			throw error;
		}
	}


	static async updateLogo(
		logoUrl: string,
		updatedByUserId: number,
	): Promise<CompanySettings | null> {
		const client = PostgresDatabase.getClient();

		try {
			const result = await client.query(
				`UPDATE company_settings 
                 SET logo_url = $1, 
                     updated_at = CURRENT_TIMESTAMP,
                     updated_by_user_id = $2
                 WHERE id = 1
                 RETURNING *`,
				[logoUrl, updatedByUserId],
			);

			return result.rows[0] || null;
		} catch (error) {
			console.error("Error updating company logo:", error);
			throw error;
		}
	}


	static async updateSettings(
		data: {
			logo_url?: string;
			company_name?: string;
		},
		updatedByUserId: number,
	): Promise<CompanySettings | null> {
		const client = PostgresDatabase.getClient();

		const updates: string[] = [];
		const values: SqlParams = [];
		let paramIndex = 1;

		if (data.logo_url !== undefined) {
			updates.push(`logo_url = $${paramIndex++}`);
			values.push(data.logo_url);
		}

		if (data.company_name !== undefined) {
			updates.push(`company_name = $${paramIndex++}`);
			values.push(data.company_name);
		}

		if (updates.length === 0) {
			return CompanySettingsModel.findSettings();
		}

		updates.push(`updated_at = CURRENT_TIMESTAMP`);
		updates.push(`updated_by_user_id = $${paramIndex++}`);
		values.push(updatedByUserId);

		try {
			const result = await client.query(
				`UPDATE company_settings 
                 SET ${updates.join(", ")}
                 WHERE id = 1
                 RETURNING *`,
				values,
			);

			return result.rows[0] || null;
		} catch (error) {
			console.error("Error updating company settings:", error);
			throw error;
		}
	}
}
