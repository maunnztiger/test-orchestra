import express from "express";
import cors from "cors";
import { runsRouter } from "./routes/runs.routes";
const app = express();
const PORT = Number(process.env.PORT ?? 3000);

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:4200"
  })
);

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "testorchestra-dashboard"
  });
});
app.use("/api/runs", runsRouter);
app.listen(PORT, () => {
  console.log(`🚀 TestOrchestra Dashboard API running on port ${PORT}`);
});
