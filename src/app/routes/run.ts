import { Router, Request, Response } from "express";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";
import os from "os";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  const { testIds } = req.body; // e.g. ["AUTH-001", "AUTH-002"]
  const runId = Date.now().toString();

  if (!Array.isArray(testIds) || testIds.length === 0) {
    return res.status(400).json({ error: "testIds must be a non-empty array" });
  }

  // ✅ Build regex
  let grepPattern = `@(?:${testIds.join("|")})`;

  // ✅ On Windows, wrap in quotes to avoid CMD splitting
  if (os.platform() === "win32") {
    grepPattern = `"${grepPattern}"`;
  }

  // ✅ Prepare report folder
  const reportDir = path.join(process.cwd(), "src", "reports", runId);
  fs.mkdirSync(reportDir, { recursive: true });

  const jsonReportPath = path.join(reportDir, "results.json");

  // ✅ Build Playwright args
  const args = [
    "playwright",
    "test",
    "--grep", grepPattern,
    // "--reporter", `html=${reportDir},json=${jsonReportPath}`,
  ];

  console.log(`▶️ Command: npx ${args.join(" ")}`);

  const child = spawn("npx", args, { shell: true });

  let errorOutput = "";
  child.stderr.on("data", (data) => {
    errorOutput += data.toString();
  });

  child.on("close", (code) => {
    console.log(`✅ Playwright finished with code ${code}`);

    let resultJson = null;
    try {
      if (fs.existsSync(jsonReportPath)) {
        resultJson = JSON.parse(fs.readFileSync(jsonReportPath, "utf-8"));
      }
    } catch (err) {
      console.error("❌ Failed to parse JSON report:", err);
    }

    res.json({
      status: code === 0 ? "passed" : "failed",
      runId,
      executedTests: testIds,
      errorOutput,
      reportUrl: `/reports/${runId}/index.html`,
      resultJson,
    });
  });
});

export default router;
