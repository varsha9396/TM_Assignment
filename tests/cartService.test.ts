import { CartService } from "../src/cartService.js";
import { SalesforceCartClient } from "../src/salesforceCartClient.js";

test("create cart", () => {
  const service = new CartService(new SalesforceCartClient(), new Map());
  const res = service.createCart();
  expect(res.sessionId).toBeDefined();
});

test("add item", async () => {
  const service = new CartService(new SalesforceCartClient(), new Map());
  const { sessionId } = service.createCart();

  const cart = await service.addItem(sessionId, {
    productId: "p1",
    quantity: 1,
  });

  expect(cart.items.length).toBe(1);
});
