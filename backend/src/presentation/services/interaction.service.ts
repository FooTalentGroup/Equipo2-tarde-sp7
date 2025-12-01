import { CrmInteractionModel } from "../../data/postgres/models/crm/crm-interaction.model";
import {
  CreateInteractionDto,
  UpdateInteractionDto,
} from "../../domain/dtos/interactions/interaction.dto";
import { CustomError } from "../../domain/errors/custom.error";

export class InteractionService {
  async createInteraction(dto: CreateInteractionDto) {
    // Conflict Check
    const hasConflict = await CrmInteractionModel.checkConflict(
      dto.id_usuario_responsable,
      dto.fecha_hora_programada
    );
    if (hasConflict) {
      throw CustomError.conflict("Agent is already booked at this time");
    }

    const interaction = await CrmInteractionModel.create(dto);
    return interaction;
  }

  async getAgentAgenda(userId: number, startDate: string, endDate: string) {
    const agenda = await CrmInteractionModel.findAgenda(
      userId,
      startDate,
      endDate
    );
    return agenda;
  }

  async completeInteraction(id: number, dto: UpdateInteractionDto) {
    const interaction = await CrmInteractionModel.findById(id);
    if (!interaction) {
      throw CustomError.notFound(`Interaction with ID ${id} not found`);
    }

    // State Guard
    if (
      (dto.estado === "Realizada" || dto.estado === "Cancelada") &&
      !dto.comentarios
    ) {
      throw CustomError.badRequest(
        "Comments are mandatory when completing or canceling an interaction"
      );
    }

    const updatedInteraction = await CrmInteractionModel.update(id, dto);
    return updatedInteraction;
  }

  async getPropertyHistory(propertyId: number) {
    const history = await CrmInteractionModel.findHistoryByProperty(propertyId);
    return history;
  }
}
