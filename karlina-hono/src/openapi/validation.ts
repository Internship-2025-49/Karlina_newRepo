import * as v from 'valibot';

export const validateSomething = () => {
  console.log("Validation berjalan!");
};

export const querySchema = v.object({
  name: v.optional(v.string())
});

export const responseSchema = v.object({
  message: v.string()
});
