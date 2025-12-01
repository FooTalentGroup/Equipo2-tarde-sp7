import { Request, Response } from "express";
import { InteractionService } from "../services/interaction.service";
import { CustomError } from "../../domain/errors/custom.error";
import {
  CreateInteractionDto,
  UpdateInteractionDto,
} from "../../domain/dtos/interactions/interaction.dto";

export class InteractionController {
  constructor(private readonly interactionService: InteractionService) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    console.error("Interaction Controller Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  };

  createInteraction = async (req: Request, res: Response) => {
    try {
      const dto = req.body as CreateInteractionDto;
      // Basic validation of required fields
      if (
        !dto.id_usuario_responsable ||
        !dto.id_cliente ||
        !dto.id_tipo_evento ||
        !dto.titulo ||
        !dto.fecha_hora_programada
      ) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const interaction = await this.interactionService.createInteraction(dto);
      return res.status(201).json(interaction);
    } catch (error) {
      this.handleError(error, res);
    }
  };

  getAgentAgenda = async (req: Request, res: Response) => {
    try {
      const { userId, startDate, endDate } = req.query;

      if (!userId || !startDate || !endDate) {
        return res
          .status(400)
          .json({
            error:
              "Missing required query parameters: userId, startDate, endDate",
          });
      }

      const agenda = await this.interactionService.getAgentAgenda(
        Number(userId),
        String(startDate),
        String(endDate)
      );
      return res.status(200).json(agenda);
    } catch (error) {
      this.handleError(error, res);
    }
  };

  completeInteraction = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const dto = req.body as UpdateInteractionDto;

      if (!id) {
        return res.status(400).json({ error: "Missing interaction ID" });
      }

      const updatedInteraction =
        await this.interactionService.completeInteraction(Number(id), dto);
      return res.status(200).json(updatedInteraction);
    } catch (error) {
      this.handleError(error, res);
    }
  };
}
