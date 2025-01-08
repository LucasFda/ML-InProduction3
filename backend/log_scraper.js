const fs = require("fs");
const readline = require("readline");
const client = require("prom-client");
const errorCount = new client.Counter({
  name: "log_error_count",
  help: "Count of error-level logs",
});
const rl = readline.createInterface({
  input: fs.createReadStream("logs/application.log"),
  output: process.stdout,
  terminal: false,
});
rl.on("line", (line) => {
  if (line.includes("[ERROR]")) {
    errorCount.inc();
  }
});
client.collectDefaultMetrics();
const express = require("express");
const app = express();
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
  });
app.listen(3000, () => console.log("Metrics server running on port 3000"));
