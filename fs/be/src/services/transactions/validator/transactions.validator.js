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
          'other'
        ).required(),

        quantity: Joi.when('detailType', {
          is: 'product',
          then: Joi.number().min(1).required(),
          otherwise: Joi.number().optional()
        })
      })
    )
    .min(1)
    .required(),

  transactionDate: Joi.date().required()
});

export const transactionsValidatorIncome = Joi.object({
  totalAmount: Joi.number().required(),
  transactionDate: Joi.date().required()
});
