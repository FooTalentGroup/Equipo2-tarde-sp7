import { PostgresDatabase } from '../../data/postgres/database';
import { CustomError } from '../../domain';
import { SqlParams } from '../../data/types/sql.types';
import {
	ClientConsultationModel,
	PropertyModel,
	VisibilityStatusModel,
	ClientModel,
} from '../../data/postgres/models';

export class DashboardServices {
	async getDashboardData() {
		const consultations = await this.getLatestConsultations(5);
		const [activeProperties, inactiveProperties, unansweredConsultations, unreadConsultations, newLeadsToday] = await Promise.all([
			this.countActiveProperties(),
			this.countInactiveProperties(),
			this.countUnansweredConsultations(),
			this.countUnreadConsultations(),
			this.countNewLeadsToday(),
		]);

		return {
			consultations,
			stats: {
				active_properties: activeProperties,
				inactive_properties: inactiveProperties,
				unanswered_consultations: unansweredConsultations,
				unread_consultations: unreadConsultations,
				new_leads_today: newLeadsToday,
			},
		};
	}

	private async getLatestConsultations(limit: number = 5) {
		const consultations = await ClientConsultationModel.findAll({
			limit: limit,
		});

		const enrichedConsultations = await Promise.all(
			consultations.map(async (consultation) => {
				let client = null;
				if (consultation.client_id) {
					client = await ClientModel.findById(consultation.client_id);
				}

				let property = null;
				if (consultation.property_id) {
					property = await PropertyModel.findById(consultation.property_id);
				}

				let consultantName = null;
				let consultantEmail = null;
				let consultantPhone = null;

				if (client) {
					consultantName = `${client.first_name} ${client.last_name}`;
					consultantEmail = client.email || null;
					consultantPhone = client.phone || null;
				} else if (
					consultation.consultant_first_name ||
					consultation.consultant_last_name
				) {
					consultantName = [
						consultation.consultant_first_name,
						consultation.consultant_last_name,
					]
						.filter(Boolean)
						.join(' ');
					consultantEmail = consultation.consultant_email || null;
					consultantPhone = consultation.consultant_phone || null;
				}

				return {
					id: consultation.id,
					consultation_date: consultation.consultation_date,
					is_read: consultation.is_read || false,
					message: consultation.message || '',
					consultant_name: consultantName,
					consultant_email: consultantEmail,
					consultant_phone: consultantPhone,
					property: property
						? {
								id: property.id,
								title: property.title,
							}
						: null,
				};
			}),
		);

		return enrichedConsultations;
	}

	private async countActiveProperties(): Promise<number> {
		const archivedStatus = await VisibilityStatusModel.findByName('Archivada');
		const archivedStatusId = archivedStatus?.id;

		let query = `SELECT COUNT(*) as count FROM properties`;
		const values: SqlParams = [];
		
		if (archivedStatusId) {
			query += ` WHERE visibility_status_id != $1`;
			values.push(archivedStatusId);
		}

		const result = await PostgresDatabase.query(query, values);
		return parseInt(result.rows[0]?.count || '0', 10);
	}

	private async countInactiveProperties(): Promise<number> {
		const archivedStatus = await VisibilityStatusModel.findByName('Archivada');
		
		if (!archivedStatus?.id) {
			return 0;
		}

		const query = `SELECT COUNT(*) as count FROM properties WHERE visibility_status_id = $1`;
		const result = await PostgresDatabase.query(query, [archivedStatus.id]);
		return parseInt(result.rows[0]?.count || '0', 10);
	}

	private async countUnansweredConsultations(): Promise<number> {
		const query = `SELECT COUNT(*) as count FROM client_consultations WHERE responded_by_user_id IS NULL`;
		const result = await PostgresDatabase.query(query);
		return parseInt(result.rows[0]?.count || '0', 10);
	}

	private async countUnreadConsultations(): Promise<number> {
		const query = `SELECT COUNT(*) as count FROM client_consultations WHERE is_read = false`;
		const result = await PostgresDatabase.query(query);
		return parseInt(result.rows[0]?.count || '0', 10);
	}

	private async countNewLeadsToday(): Promise<number> {
		const { ContactCategoryModel } = await import('../../data/postgres/models');
		
		const leadCategory = await ContactCategoryModel.findByName('Lead');
		
		if (!leadCategory?.id) {
			return 0;
		}

		const query = `
			SELECT COUNT(*) as count 
			FROM clients 
			WHERE contact_category_id = $1 
			AND DATE(registered_at) = CURRENT_DATE
			AND deleted = false
		`;
		const result = await PostgresDatabase.query(query, [leadCategory.id]);
		return parseInt(result.rows[0]?.count || '0', 10);
	}
}
