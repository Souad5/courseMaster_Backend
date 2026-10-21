// middleware to validate request bodies against Zod schemas

const { ZodError } = require("zod");

const validate = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (err) {
    if (!(err instanceof ZodError)) return next(err);

    // Zod 4 exposes the problems as `issues` (`errors` no longer exists)
    const errors = err.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));
    const summary = errors.map((e) => (e.field ? `${e.field}: ${e.message}` : e.message)).join("; ");

    return res.status(400).json({ message: `Validation error: ${summary}`, errors });
  }
};

module.exports = validate;
