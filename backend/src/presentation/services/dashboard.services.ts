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
		// 1. Get latest 4 consultations (unread first, then most recent)
		const consultations = await this.getLatestConsultations(4);

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
	 * Gets latest consultations (unread first, then most recent)
	 * Returns maximum 4 consultations
	 * Logic: Always return up to 4 consultations, prioritizing unread ones.
	 * If there are less than 4 unread, fill with the most recent read ones.
	 */
	private async getLatestConsultations(limit: number = 4) {
		// Step 1: Get all unread consultations (ordered by date DESC)
		const unreadConsultations = await ClientConsultationModel.findAll({
			is_read: false,
			limit: limit, // Get up to limit unread
		});

		// Step 2: If we have less than limit unread, get the most recent read ones to complete to limit
		let consultations = [...unreadConsultations];
		
		// Always try to return exactly 'limit' consultations if available
		if (unreadConsultations.length < limit) {
			const remaining = limit - unreadConsultations.length;
			const readConsultations = await ClientConsultationModel.findAll({
				is_read: true,
				limit: remaining,
			});
			// Combine: unread first, then read ones
			consultations = [...unreadConsultations, ...readConsultations];
		}

		// Step 3: Ensure final list is sorted correctly:
		// - Unread first (is_read = false) regardless of date
		// - Then by consultation_date DESC (newest first) within each group
		consultations.sort((a, b) => {
			// Priority 1: Unread (false) comes before read (true)
			if (a.is_read !== b.is_read) {
				return a.is_read ? 1 : -1;
			}
			// Priority 2: Within same read status, sort by date DESC (newest first)
			const dateA = a.consultation_date ? new Date(a.consultation_date).getTime() : 0;
			const dateB = b.consultation_date ? new Date(b.consultation_date).getTime() : 0;
			return dateB - dateA; // DESC order
		});

		// Slice to limit before enriching
		const limitedConsultations = consultations.slice(0, limit);

		// Enrich consultations with client and property data
		const enrichedConsultations = await Promise.all(
			limitedConsultations.map(async (consultation) => {
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

