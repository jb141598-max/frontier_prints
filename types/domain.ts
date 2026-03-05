export type RequestStatus = 'new' | 'reviewing' | 'quoted' | 'completed' | 'closed';

export type OptionType = 'size' | 'material' | 'color_design';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  description: string | null;
  base_price: number | null;
  is_active: boolean;
  allow_quantity: boolean;
  allow_size: boolean;
  allow_material: boolean;
  allow_color_design: boolean;
  allow_other_notes: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  alt_text: string | null;
  sort_order: number;
  created_at: string;
}

export interface ProductOption {
  id: string;
  product_id: string;
  option_type: OptionType;
  label: string;
  sort_order: number;
  is_active: boolean;
}

export interface PrintRequest {
  id: string;
  product_id: string;
  customer_name: string;
  customer_email: string;
  status: RequestStatus;
  quantity: number | null;
  selected_size: string | null;
  selected_material: string | null;
  selected_color_design: string | null;
  other_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProductWithRelations extends Product {
  categories: Pick<Category, 'id' | 'name' | 'slug'> | null;
  product_images: ProductImage[];
  product_options: ProductOption[];
}

export interface RequestWithProduct extends PrintRequest {
  products: Pick<Product, 'id' | 'name' | 'slug'> | null;
}
