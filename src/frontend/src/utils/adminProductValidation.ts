export interface ProductFormData {
  title: string;
  description: string;
  price: string;
  currency: string;
  category: string;
  imageUrl: string;
  rating: string;
  stock: string;
}

export interface ValidationErrors {
  title?: string;
  description?: string;
  price?: string;
  category?: string;
  imageUrl?: string;
  rating?: string;
  stock?: string;
}

export function validateProductForm(data: ProductFormData): ValidationErrors {
  const errors: ValidationErrors = {};

  // Title validation
  if (!data.title.trim()) {
    errors.title = 'Title is required';
  }

  // Description validation
  if (!data.description.trim()) {
    errors.description = 'Description is required';
  }

  // Category validation
  if (!data.category.trim()) {
    errors.category = 'Category is required';
  }

  // Price validation
  if (!data.price.trim()) {
    errors.price = 'Price is required';
  } else {
    const priceNum = parseFloat(data.price);
    if (isNaN(priceNum)) {
      errors.price = 'Price must be a valid number';
    } else if (priceNum < 0) {
      errors.price = 'Price cannot be negative';
    }
  }

  // Stock validation
  if (!data.stock.trim()) {
    errors.stock = 'Stock is required';
  } else {
    const stockNum = parseInt(data.stock, 10);
    if (isNaN(stockNum)) {
      errors.stock = 'Stock must be a valid number';
    } else if (stockNum < 0) {
      errors.stock = 'Stock cannot be negative';
    }
  }

  // Rating validation (optional)
  if (data.rating.trim()) {
    const ratingNum = parseInt(data.rating, 10);
    if (isNaN(ratingNum)) {
      errors.rating = 'Rating must be a valid number';
    } else if (ratingNum < 1 || ratingNum > 5) {
      errors.rating = 'Rating must be between 1 and 5';
    }
  }

  // Image URL validation
  if (!data.imageUrl.trim()) {
    errors.imageUrl = 'Image URL is required';
  }

  return errors;
}

export function parseProductFormData(data: ProductFormData) {
  return {
    title: data.title.trim(),
    description: data.description.trim(),
    price: BigInt(Math.round(parseFloat(data.price) * 100)),
    currency: data.currency,
    category: data.category.trim(),
    imageUrl: data.imageUrl.trim(),
    rating: data.rating.trim() ? BigInt(parseInt(data.rating, 10)) : null,
    stock: BigInt(parseInt(data.stock, 10)),
  };
}

export function validateStockInput(value: string): { valid: boolean; error?: string } {
  if (!value.trim()) {
    return { valid: false, error: 'Stock value is required' };
  }

  const stockNum = parseInt(value, 10);
  if (isNaN(stockNum)) {
    return { valid: false, error: 'Stock must be a valid number' };
  }

  if (stockNum < 0) {
    return { valid: false, error: 'Stock cannot be negative' };
  }

  return { valid: true };
}
