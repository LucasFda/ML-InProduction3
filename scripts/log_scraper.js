const fs = require("fs");
const readline = require("readline");
const client = require("prom-client");
const express = require("express");

// Crée un compteur pour les erreurs
const errorCount = new client.Counter({
  name: "log_error_count",
  help: "Count of error-level logs",
});

// Lis les logs et incrémente le compteur pour chaque ligne d'erreur
const rl = readline.createInterface({
  input: fs.createReadStream("./backend/logs/application.log"),  // Change en fonction de l'emplacement de tes logs
  output: process.stdout,
  terminal: false,
});

rl.on("line", (line) => {
  if (line.includes("[ERROR]")) {
    errorCount.inc();
  }
});

// Récupère les métriques par défaut
client.collectDefaultMetrics();

// Configuration de l'application Express pour exposer les métriques à Prometheus
const app = express();

// Endpoint pour exposer les métriques
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
});

// Lancer le serveur sur le port 3000
app.listen(3002, () => console.log("✅ Metrics server running on port 3002"));
