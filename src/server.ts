import express from "express";
import { SalesforceCartClient } from "./salesforceCartClient.js";
import { CartService } from "./cartService.js";

const app = express();
app.use(express.json());

const store = new Map();
const client = new SalesforceCartClient();
const service = new CartService(client, store);

app.post("/api/cart", (req, res) => {
  res.json(service.createCart());
});

app.get("/api/cart/:sessionId", async (req, res) => {
  res.json({ cart: await service.getCart(req.params.sessionId) });
});

app.post("/api/cart/:sessionId/items", async (req, res) => {
  res.json({
    cart: await service.addItem(req.params.sessionId, req.body),
  });
});

app.delete("/api/cart/:sessionId/items/:itemId", async (req, res) => {
  res.json({
    cart: await service.removeItem(
      req.params.sessionId,
      req.params.itemId
    ),
  });
});

app.get("/health", (_, res) => res.json({ status: "ok" }));

app.listen(3000, () => console.log("Server running"));
