export function formatPrice(price: number): string {
  return `₹${price.toFixed(2)}`;
}

export function generateOrderNumber(): string {
  const date = new Date();
  const yy = date.getFullYear().toString().slice(-2);
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const rand = Math.floor(Math.random() * 99999).toString().padStart(5, '0');
  return `KAE-${yy}${mm}${dd}-${rand}`;
}

export function slugify(text: string): string {
  return text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_]+/g, '-').replace(/^-+|-+$/g, '');
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
}

export function getImageUrl(path: string | null | undefined): string {
  if (!path) return '/images/placeholder.svg';
  if (path.startsWith('http')) return path;
  return path;
}
