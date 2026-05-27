import Joi from 'joi';

export const scanReceiptQuerySchema = Joi.object({
  conf: Joi.number().min(0.01).max(1.0).optional(),
  iou:  Joi.number().min(0.01).max(1.0).optional(),
});