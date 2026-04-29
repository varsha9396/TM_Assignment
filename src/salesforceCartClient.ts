export class CartExpiredError extends Error {}

type Cart = {
  id: string;
  items: any[];
  expiresAt: number;
};

export class SalesforceCartClient {
  private carts = new Map<string, Cart>();
  private TTL = 2 * 60 * 1000;

  createCart(): Cart {
    const id = crypto.randomUUID();
    const cart: Cart = {
      id,
      items: [],
      expiresAt: Date.now() + this.TTL,
    };
    this.carts.set(id, cart);
    return cart;
  }

  private validate(cart: Cart) {
    if (Date.now() > cart.expiresAt) {
      throw new CartExpiredError("Cart expired");
    }
  }

  getCart(id: string) {
    const cart = this.carts.get(id);
    if (!cart) throw new Error("Cart not found");
    this.validate(cart);
    return cart;
  }

  addItem(id: string, item: any) {
    const cart = this.getCart(id);
    cart.items.push({ id: crypto.randomUUID(), ...item });
    return cart;
  }

  removeItem(id: string, itemId: string) {
    const cart = this.getCart(id);
    cart.items = cart.items.filter(i => i.id !== itemId);
    return cart;
  }
}
