import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import path from "path";
import runRoute from "./routes/run";   // ✅ no .js extension needed

const app = express();
const PORT = 4000;

app.use(bodyParser.json());

// Serve Playwright HTML reports
app.use("/reports", express.static(path.join(process.cwd(), "src", "reports")));

// API routes
app.use("/api/run", runRoute);

// Health check
app.get("/", (_req: Request, res: Response) => {
  res.send("✅ Test Management API is running (CJS mode)");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
