// Example product API functions

export async function fetchProducts() {
  const response = await fetch("/api/products");
  if (!response.ok) throw new Error("Failed to fetch products");
  return response.json();
}

export async function fetchProductById(id) {
  const response = await fetch(`/api/products/${id}`);
  if (!response.ok) throw new Error("Failed to fetch product");
  return response.json();
}