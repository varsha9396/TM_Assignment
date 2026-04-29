import { CartExpiredError, SalesforceCartClient } from "./salesforceCartClient.js";

export class CartService {
  constructor(
    private client: SalesforceCartClient,
    private store: Map<string, string>
  ) {}

  createCart() {
    const cart = this.client.createCart();
    const sessionId = crypto.randomUUID();
    this.store.set(sessionId, cart.id);
    return { sessionId, cart };
  }

  private async withRetry(sessionId: string, fn: (cartId: string) => any) {
    let cartId = this.store.get(sessionId);
    if (!cartId) throw new Error("Session not found");

    try {
      return fn(cartId);
    } catch (e) {
      if (e instanceof CartExpiredError) {
        const newCart = this.client.createCart();
        this.store.set(sessionId, newCart.id);
        return fn(newCart.id);
      }
      throw e;
    }
  }

  getCart(sessionId: string) {
    return this.withRetry(sessionId, id => this.client.getCart(id));
  }

  addItem(sessionId: string, item: any) {
    return this.withRetry(sessionId, id =>
      this.client.addItem(id, item)
    );
  }

  removeItem(sessionId: string, itemId: string) {
    return this.withRetry(sessionId, id =>
      this.client.removeItem(id, itemId)
    );
  }
}
