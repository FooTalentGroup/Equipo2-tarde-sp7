import { Router } from "express";
import { InteractionController } from "./controller";
import { InteractionService } from "../services/interaction.service";

export class InteractionRoutes {
  static get routes(): Router {
    const router = Router();
    const service = new InteractionService();
    const controller = new InteractionController(service);

    /**
     * @swagger
     * /api/interactions:
     *   post:
     *     summary: Schedule a new interaction
     *     tags: [Interactions]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - id_usuario_responsable
     *               - id_cliente
     *               - id_tipo_evento
     *               - titulo
     *               - fecha_hora_programada
     *             properties:
     *               id_usuario_responsable:
     *                 type: integer
     *               id_cliente:
     *                 type: integer
     *               id_propiedad:
     *                 type: integer
     *               id_tipo_evento:
     *                 type: integer
     *               titulo:
     *                 type: string
     *               fecha_hora_programada:
     *                 type: string
     *                 format: date-time
     *               comentarios:
     *                 type: string
     *     responses:
     *       201:
     *         description: Interaction created
     *       409:
     *         description: Conflict (Agent already booked)
     *       400:
     *         description: Bad request
     */
    router.post("/", controller.createInteraction);

    /**
     * @swagger
     * /api/interactions/agenda:
     *   get:
     *     summary: Get agent agenda
     *     tags: [Interactions]
     *     parameters:
     *       - in: query
     *         name: userId
     *         required: true
     *         schema:
     *           type: integer
     *       - in: query
     *         name: startDate
     *         required: true
     *         schema:
     *           type: string
     *           format: date-time
     *       - in: query
     *         name: endDate
     *         required: true
     *         schema:
     *           type: string
     *           format: date-time
     *     responses:
     *       200:
     *         description: Agent agenda
     */
    router.get("/agenda", controller.getAgentAgenda);

    /**
     * @swagger
     * /api/interactions/{id}/complete:
     *   patch:
     *     summary: Complete interaction and log feedback
     *     tags: [Interactions]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               estado:
     *                 type: string
     *                 enum: [Realizada, Cancelada]
     *               comentarios:
     *                 type: string
     *     responses:
     *       200:
     *         description: Interaction updated
     *       400:
     *         description: Bad request (Comments mandatory for completion)
     *       404:
     *         description: Interaction not found
     */
    router.patch("/:id/complete", controller.completeInteraction);

    return router;
  }
}
