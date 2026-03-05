import { z } from 'zod';
import type { ProductWithRelations } from '@/types/domain';

export const requestInputSchema = z.object({
  productId: z.string().uuid(),
  customerName: z.string().trim().min(2).max(80),
  customerEmail: z.string().trim().email().max(120),
  quantity: z.coerce.number().int().positive().max(100).optional(),
  selectedSize: z.string().trim().max(80).optional(),
  selectedMaterial: z.string().trim().max(80).optional(),
  selectedColorDesign: z.string().trim().max(80).optional(),
  otherNotes: z.string().trim().max(1000).optional(),
  website: z.string().max(0).optional() // honeypot
});

export type RequestInput = z.infer<typeof requestInputSchema>;

function optionIsValid(
  product: ProductWithRelations,
  optionType: 'size' | 'material' | 'color_design',
  value: string | undefined
): boolean {
  if (!value) {
    return true;
  }

  const allowed = product.product_options
    .filter((option) => option.option_type === optionType && option.is_active)
    .map((option) => option.label);

  return allowed.includes(value);
}

export function validateAgainstProductConfig(product: ProductWithRelations, input: RequestInput) {
  if (!product.allow_quantity && typeof input.quantity !== 'undefined') {
    throw new Error('Quantity is not enabled for this product.');
  }

  if (!product.allow_size && input.selectedSize) {
    throw new Error('Size is not enabled for this product.');
  }

  if (!product.allow_material && input.selectedMaterial) {
    throw new Error('Material is not enabled for this product.');
  }

  if (!product.allow_color_design && input.selectedColorDesign) {
    throw new Error('Color/design is not enabled for this product.');
  }

  if (!product.allow_other_notes && input.otherNotes) {
    throw new Error('Other notes are not enabled for this product.');
  }

  if (product.allow_size && !optionIsValid(product, 'size', input.selectedSize)) {
    throw new Error('Invalid size option.');
  }

  if (product.allow_material && !optionIsValid(product, 'material', input.selectedMaterial)) {
    throw new Error('Invalid material option.');
  }

  if (product.allow_color_design && !optionIsValid(product, 'color_design', input.selectedColorDesign)) {
    throw new Error('Invalid color/design option.');
  }
}
