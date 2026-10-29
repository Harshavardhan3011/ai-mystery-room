import express from "express";
import cors from "cors";
import casesRouter from "./routes/cases.js";

export const app = express();

app.disable("x-powered-by");
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
}));
app.use(express.json({ limit: "20kb" }));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "ai-mystery-room-api" });
});

app.use("/api/cases", casesRouter);

app.use((req, res) => {
  res.status(404).json({ error: { code: "ROUTE_NOT_FOUND", message: "Endpoint not found." } });
});

app.use((error, _req, res, _next) => {
  // Keep internal error details in server logs only.
  console.error("[api-error]", error?.code || error?.name || "ERROR", error?.message || "Unknown error");
  if (error?.code === "AI_NOT_CONFIGURED") {
    return res.status(503).json({ error: { code: error.code, message: error.message } });
  }
  if (error?.code === "AI_GENERATION_FAILED") {
    return res.status(502).json({ error: { code: error.code, message: error.message } });
  }
  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    return res.status(400).json({ error: { code: "INVALID_JSON", message: "Request body must be valid JSON." } });
  }
  if (error?.name === "ValidationError" || error?.name === "CastError") {
    return res.status(400).json({ error: { code: "VALIDATION_ERROR", message: "The request could not be processed." } });
  }
  return res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Something went wrong. Please try again." } });
});
