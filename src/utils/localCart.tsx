// src/utils/localCart.ts

export type LocalCartItem = {
  product_id: number;
  name: string;
  price: number;
  image_url?: string | null;
  quantity: number;
};

export type LocalCart = {
  items: LocalCartItem[];
};

const CART_KEY = "local_cart_v1";

function safeParse(json: string | null) {
  try {
    return json ? JSON.parse(json) : null;
  } catch {
    return null;
  }
}

export function getLocalCart(): LocalCart {
  const parsed = safeParse(localStorage.getItem(CART_KEY));
  if (!parsed || !Array.isArray(parsed.items)) return { items: [] };

  const items: LocalCartItem[] = parsed.items
    .filter((it: any) => Number.isFinite(Number(it?.product_id)))
    .map((it: any) => ({
      product_id: Number(it.product_id),
      name: String(it.name ?? ""),
      price: Number(it.price ?? 0),
      image_url: it.image_url ?? null,
      quantity: Math.max(1, Number(it.quantity ?? 1)),
    }));

  return { items };
}

export function setLocalCart(cart: LocalCart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  // notify components in same tab
  window.dispatchEvent(new Event("local-cart-updated"));
}

export function addToLocalCart(
  item: Omit<LocalCartItem, "quantity"> & { quantity?: number }
) {
  const cart = getLocalCart();
  const qty = Math.max(1, Number(item.quantity ?? 1));

  const idx = cart.items.findIndex((x) => x.product_id === item.product_id);
  if (idx >= 0) {
    cart.items[idx] = { ...cart.items[idx], quantity: cart.items[idx].quantity + qty };
  } else {
    cart.items.push({
      product_id: item.product_id,
      name: item.name,
      price: Number(item.price ?? 0),
      image_url: item.image_url ?? null,
      quantity: qty,
    });
  }

  setLocalCart(cart);
  return cart;
}

export function updateLocalCartItem(product_id: number, quantity: number) {
  const cart = getLocalCart();
  const q = Math.max(1, Number(quantity));

  cart.items = cart.items.map((it) =>
    it.product_id === product_id ? { ...it, quantity: q } : it
  );

  setLocalCart(cart);
  return cart;
}

export function removeFromLocalCart(product_id: number) {
  const cart = getLocalCart();
  cart.items = cart.items.filter((it) => it.product_id !== product_id);
  setLocalCart(cart);
  return cart;
}

export function clearLocalCart() {
  setLocalCart({ items: [] });
}

export function cartTotals(cart: LocalCart) {
  const count = cart.items.reduce((sum, it) => sum + it.quantity, 0);
  const total = cart.items.reduce((sum, it) => sum + it.quantity * (it.price || 0), 0);
  return { count, total };
}

export { CART_KEY };