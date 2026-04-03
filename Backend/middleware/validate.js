import { z } from 'zod';
import mongoose from 'mongoose';
import AppError from '../utils/AppError.js';

// Zod Schemas
const registerSchema = z.object({
  name: z.string().min(1, 'Name is required').trim(),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required')
});

const refreshSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required')
});

const productSchema = z.object({
  name: z.string().min(1, 'Product name is required').trim(),
  description: z.string().optional().or(z.literal('')),
  price: z.coerce.number().positive('Price must be a positive number'),
  stock: z.coerce.number().int().nonnegative('Stock must be a non-negative integer').optional(),
  category: z.string().optional().or(z.literal('')),
  images: z.array(z.string().url('Invalid image URL')).optional()
});

const orderSchema = z.object({
  products: z.array(z.object({
    product: z.string().min(1, 'Product ID required'),
    quantity: z.coerce.number().int().positive('Quantity must be a positive integer')
  })).min(1, 'At least one product required'),
  shippingAddress: z.string().min(5, 'Shipping address required'),
  paymentMethod: z.enum(['cod', 'stripe', 'paypal']).default('cod'),
  shippingCost: z.coerce.number().nonnegative('Shipping cost must be non-negative').default(0),
  taxAmount: z.coerce.number().nonnegative('Tax amount must be non-negative').default(0)
});

const orderStatusSchema = z.object({
  status: z.enum(['pending', 'paid', 'shipped', 'delivered', 'cancelled'])
});

const categorySchema = z.object({
  name: z.string().min(1, 'Category name is required').trim(),
  description: z.string().optional().or(z.literal(''))
});

const objectIdSchema = z.object({
  id: z.string().refine(
    (id) => mongoose.Types.ObjectId.isValid(id),
    'Invalid ID format'
  )
});

// Middleware factory for validation
const createValidationMiddleware = (schema) => (req, res, next) => {
  try {
    const result = schema.parse(req.body);
    req.validatedData = result;
    next();
  } catch (err) {
    if (err instanceof z.ZodError) {
      const errors = err.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join('; ');
      return next(new AppError(errors, 400));
    }
    next(err);
  }
};

// Middleware factory for URL params validation
const createParamValidationMiddleware = (schema, paramName = 'id') => (req, res, next) => {
  try {
    const result = schema.parse({ id: req.params[paramName] });
    req.validatedParams = result;
    next();
  } catch (err) {
    if (err instanceof z.ZodError) {
      const errors = err.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join('; ');
      return next(new AppError(errors, 400));
    }
    next(err);
  }
};

// Export validation middleware
export const validateRegister = createValidationMiddleware(registerSchema);
export const validateLogin = createValidationMiddleware(loginSchema);
export const validateRefresh = createValidationMiddleware(refreshSchema);
export const validateProduct = createValidationMiddleware(productSchema);
export const validateOrder = createValidationMiddleware(orderSchema);
export const validateOrderStatus = createValidationMiddleware(orderStatusSchema);
export const validateCategory = createValidationMiddleware(categorySchema);
export const validateObjectIdParam = (paramName = 'id') => createParamValidationMiddleware(objectIdSchema, paramName);

// Legacy exports for backward compatibility
export const validateProductPayload = validateProduct;
export const validateOrderPayload = validateOrder;
export const validateOrderStatusPayload = validateOrderStatus;
export const validateCategoryPayload = validateCategory;
