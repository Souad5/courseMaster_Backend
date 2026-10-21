// validation schemas for authentication

const { z } = require("zod");

const registerSchema = z.object({
  name: z.string().trim().min(2, "must be at least 2 characters"),
  email: z.string().trim().email("must be a valid email address"),
  password: z.string().min(6, "must be at least 6 characters"),
  adminKey: z.string().optional(), // Optional admin registration key
});

const loginSchema = z.object({
  email: z.string().trim().email("must be a valid email address"),
  password: z.string().min(1, "is required"),
});

module.exports = { registerSchema, loginSchema };
