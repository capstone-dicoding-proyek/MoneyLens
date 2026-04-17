const validate = (schema, source = 'body') => (req, res, next) => {
  const data = req[source];

  const { error, value } = schema.validate(data, {
    abortEarly: false,
    allowUnknown: false,
    stripUnknown: true
  });

  if (error) return next(error);
  req.validated = value;
  next();
};

export default validate;