const client = require('prom-client');

// Collecter automatiquement les métriques par défaut (CPU, mémoire, uptime...)
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ timeout: 5000 });

// Créer un compteur personnalisé pour suivre les requêtes
const httpRequestCounter = new client.Counter({
    name: 'http_requests_total',
    help: 'Nombre total de requêtes HTTP',
    labelNames: ['method', 'route', 'status_code']
});

module.exports = { client, httpRequestCounter };
