import { PostgresDatabase } from '../../data/postgres/database';
import {
	ClientConsultationModel,
	PropertyModel,
	VisibilityStatusModel,
	ClientModel,
} from '../../data/postgres/models';

/**
 * Service for dashboard data aggregation
 */
export class DashboardServices {
	/**
	 * Gets all dashboard data including consultations, stats
	 */
	async getDashboardData() {
		// 1. Get latest 5 consultations (most recent by date)
		const consultations = await this.getLatestConsultations(5);

		// 2. Get property counts and consultation counts in parallel
		const [activeProperties, inactiveProperties, unansweredConsultations, unreadConsultations] = await Promise.all([
			this.countActiveProperties(),
			this.countInactiveProperties(),
			this.countUnansweredConsultations(),
			this.countUnreadConsultations(),
		]);

		return {
			consultations,
			stats: {
				active_properties: activeProperties,
				inactive_properties: inactiveProperties,
				unanswered_consultations: unansweredConsultations,
				unread_consultations: unreadConsultations,
			},
		};
	}

	/**
	 * Gets latest consultations ordered by date DESC
	 * Returns maximum 'limit' consultations
	 */
	private async getLatestConsultations(limit: number = 5) {
		// Get latest consultations ordered by date
		const consultations = await ClientConsultationModel.findAll({
			limit: limit,
		});

		// Enrich consultations with client and property data
		const enrichedConsultations = await Promise.all(
			consultations.map(async (consultation) => {
				// Get client data if client_id exists
				let client = null;
				if (consultation.client_id) {
					client = await ClientModel.findById(consultation.client_id);
				}

				// Get property data if property_id exists
				let property = null;
				if (consultation.property_id) {
					property = await PropertyModel.findById(consultation.property_id);
				}

				// Build consultant name and contact info
				let consultantName = null;
				let consultantEmail = null;
				let consultantPhone = null;

				if (client) {
					// Use client data if available
					consultantName = `${client.first_name} ${client.last_name}`;
					consultantEmail = client.email || null;
					consultantPhone = client.phone || null;
				} else if (
					consultation.consultant_first_name ||
					consultation.consultant_last_name
				) {
					// Use consultant fields if client doesn't exist yet
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

	/**
	 * Counts active properties (not archived)
	 */
	private async countActiveProperties(): Promise<number> {
		// Get archived status ID
		const archivedStatus = await VisibilityStatusModel.findByName('Archivada');
		const archivedStatusId = archivedStatus?.id;

		let query = `SELECT COUNT(*) as count FROM properties`;
		const values: any[] = [];
		
		if (archivedStatusId) {
			query += ` WHERE visibility_status_id != $1`;
			values.push(archivedStatusId);
		}

		const result = await PostgresDatabase.query(query, values);
		return parseInt(result.rows[0]?.count || '0', 10);
	}

	/**
	 * Counts inactive properties (archived)
	 */
	private async countInactiveProperties(): Promise<number> {
		// Get archived status ID
		const archivedStatus = await VisibilityStatusModel.findByName('Archivada');
		
		if (!archivedStatus?.id) {
			return 0;
		}

		const query = `SELECT COUNT(*) as count FROM properties WHERE visibility_status_id = $1`;
		const result = await PostgresDatabase.query(query, [archivedStatus.id]);
		return parseInt(result.rows[0]?.count || '0', 10);
	}

	/**
	 * Counts unanswered consultations
	 */
	private async countUnansweredConsultations(): Promise<number> {
		const query = `SELECT COUNT(*) as count FROM client_consultations WHERE responded_by_user_id IS NULL`;
		const result = await PostgresDatabase.query(query);
		return parseInt(result.rows[0]?.count || '0', 10);
	}

	/**
	 * Counts unread consultations
	 */
	private async countUnreadConsultations(): Promise<number> {
		const query = `SELECT COUNT(*) as count FROM client_consultations WHERE is_read = false`;
		const result = await PostgresDatabase.query(query);
		return parseInt(result.rows[0]?.count || '0', 10);
	}
}

