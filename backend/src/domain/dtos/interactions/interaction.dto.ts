export interface CreateInteractionDto {
  id_usuario_responsable: number;
  id_cliente: number;
  id_propiedad?: number;
  id_tipo_evento: number;
  titulo: string;
  fecha_hora_programada: Date;
  comentarios?: string;
}

export interface UpdateInteractionDto {
  estado?: string;
  comentarios?: string;
}
