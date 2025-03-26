export const validateRequest = (schema, payload) => {
    const { error } = schema.validate(payload, { abortEarly: false });
    if (error) {
      return {
        isValid: false,
        errors: error.details.map((detail) => detail.message),
      };
    } else {
      return {
        isValid: true,
        errors: null,
      };
    }
  }