import "dotenv/config";
import { createFinanceRouter } from "./finance/router.js";
import type { FinanceIntegration } from "./finance/router.js";
import express from "express";
import cors from "cors";

const app = express();
const PORT = 5000;

app.use(cors({ origin: process.env.FINANCE_WEB_ORIGIN || "http://localhost:3000", credentials: true }));
app.use("/api/finance", createFinanceRouter({
  origin: process.env.FINANCE_WEB_ORIGIN || "http://localhost:3000",
  integration: () => app.locals.financeIntegration as FinanceIntegration | undefined,
}));
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    message: "EventHub backend is running!",
  });
});

app.listen(PORT, process.env.HOST || "127.0.0.1", () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});