import { PostgresDatabase } from "../../database";
import {
  CreateInteractionDto,
  UpdateInteractionDto,
} from "../../../../domain/dtos/interactions/interaction.dto";

export interface Interaction {
  id_interaccion: number;
  id_tipo_evento: number;
  titulo: string;
  fecha_hora_programada: Date;
  id_cliente: number;
  id_propiedad?: number;
  id_usuario_responsable: number;
  comentarios?: string;
  estado: string;
}

export interface AgendaItem extends Interaction {
  client_name: string;
  property_title?: string;
  property_address?: string;
  event_type: string;
}

export interface InteractionHistoryItem {
  fecha_hora_programada: Date;
  agent_name: string;
  event_type: string;
  comentarios: string;
}

export class CrmInteractionModel {
  private static readonly TABLE_NAME = "Interaccion_CRM";

  static async create(data: CreateInteractionDto): Promise<Interaction> {
    const client = PostgresDatabase.getClient();

    const query = `
            INSERT INTO ${this.TABLE_NAME} (
                id_usuario_responsable, id_cliente, id_propiedad, id_tipo_evento,
                titulo, fecha_hora_programada, comentarios, estado
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, 'Programada')
            RETURNING *
        `;

    const result = await client.query(query, [
      data.id_usuario_responsable,
      data.id_cliente,
      data.id_propiedad || null,
      data.id_tipo_evento,
      data.titulo,
      data.fecha_hora_programada,
      data.comentarios || null,
    ]);

    return result.rows[0];
  }

  static async checkConflict(userId: number, date: Date): Promise<boolean> {
    const client = PostgresDatabase.getClient();
    // Check +/- 30 minutes
    const query = `
            SELECT COUNT(*) as count
            FROM ${this.TABLE_NAME}
            WHERE id_usuario_responsable = $1
            AND estado = 'Programada'
            AND fecha_hora_programada >= $2::timestamp - INTERVAL '30 minutes'
            AND fecha_hora_programada <= $2::timestamp + INTERVAL '30 minutes'
        `;

    const result = await client.query(query, [userId, date]);
    return parseInt(result.rows[0].count) > 0;
  }

  static async findAgenda(
    userId: number,
    startDate: string,
    endDate: string
  ): Promise<AgendaItem[]> {
    const client = PostgresDatabase.getClient();

    const query = `
            SELECT 
                i.*,
                c.nombre || ' ' || c.apellido as client_name,
                p.titulo as property_title,
                d.direccion_completa as property_address,
                te.nombre as event_type
            FROM ${this.TABLE_NAME} i
            JOIN Clientes c ON i.id_cliente = c.id_cliente
            JOIN TipoEvento te ON i.id_tipo_evento = te.id_tipo_evento
            LEFT JOIN Propiedades p ON i.id_propiedad = p.id_propiedad
            LEFT JOIN PropiedadDireccion pd ON p.id_propiedad = pd.id_propiedad
            LEFT JOIN Direccion d ON pd.id_direccion = d.id_direccion
            WHERE i.id_usuario_responsable = $1
            AND i.fecha_hora_programada BETWEEN $2 AND $3
            ORDER BY i.fecha_hora_programada ASC
        `;

    const result = await client.query(query, [userId, startDate, endDate]);
    return result.rows;
  }

  static async findById(id: number): Promise<Interaction | null> {
    const client = PostgresDatabase.getClient();
    const query = `SELECT * FROM ${this.TABLE_NAME} WHERE id_interaccion = $1`;
    const result = await client.query(query, [id]);
    return result.rows[0] || null;
  }

  static async update(
    id: number,
    data: UpdateInteractionDto
  ): Promise<Interaction | null> {
    const client = PostgresDatabase.getClient();

    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (data.estado) {
      fields.push(`estado = $${paramIndex++}`);
      values.push(data.estado);
    }
    if (data.comentarios !== undefined) {
      fields.push(`comentarios = $${paramIndex++}`);
      values.push(data.comentarios);
    }

    if (fields.length === 0) return this.findById(id);

    values.push(id);
    const query = `
            UPDATE ${this.TABLE_NAME}
            SET ${fields.join(", ")}
            WHERE id_interaccion = $${paramIndex}
            RETURNING *
        `;

    const result = await client.query(query, values);
    return result.rows[0] || null;
  }

  static async findHistoryByProperty(
    propertyId: number
  ): Promise<InteractionHistoryItem[]> {
    const client = PostgresDatabase.getClient();

    const query = `
            SELECT 
                i.fecha_hora_programada,
                u.nombre || ' ' || u.apellido as agent_name,
                te.nombre as event_type,
                i.comentarios
            FROM ${this.TABLE_NAME} i
            JOIN Usuarios u ON i.id_usuario_responsable = u.id_usuario
            JOIN TipoEvento te ON i.id_tipo_evento = te.id_tipo_evento
            WHERE i.id_propiedad = $1
            AND i.estado != 'Cancelada'
            ORDER BY i.fecha_hora_programada DESC
        `;

    const result = await client.query(query, [propertyId]);
    return result.rows;
  }
}
