import Joi from 'joi';
export const transactionsValidatorExpense = Joi.object({
  items: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().required(),

        unitPrice: Joi.number().required(),

        detailType: Joi.valid(
          'product',
          'service',
          'fee',
          'other',
          'food_drink'
        ).required(),

        quantity: Joi.when('detailType', {
          is: Joi.valid('product', 'food_drink'),
          then: Joi.number().min(1).required(),
          otherwise: Joi.number().optional()
        })
      })
    )
    .min(1)
    .required(),
  description: Joi.string().allow('', null),
  discountAmount:  Joi.number().min(0).default(0),
  transactionDate: Joi.date().required()
});

export const transactionsValidatorIncome = Joi.object({
  totalAmount: Joi.number().required(),
  transactionDate: Joi.date().required(),
  nameIncome: Joi.string().allow('', null),
  description: Joi.string().allow('', null)
});

export const deleteTransactionPayload = Joi.object({
  userID: Joi.required(),
  transactionID: Joi.required(),
});

export const transactionGetQuery = Joi.object({
  range: Joi.valid('week', 'month', 'year').allow('', null),
  startDate: Joi.date().iso().allow('', null),
  endDate: Joi.date().iso().allow('', null)
});