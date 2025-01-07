const express = require('express');
const mongoose = require('mongoose');
const taskRoutes = require("./routes/tasks");
const cors = require('cors');
const log4js = require('log4js');
const logConfig = require('./log4js.config');
const { client, httpRequestCounter } = require('./prometheus'); // Importer Prometheus
require('dotenv').config();

const app = express();

// Configuration de Log4js
log4js.configure(logConfig);
const logger = log4js.getLogger();

// Middlewares
app.use(log4js.connectLogger(logger, { level: 'info' }));
app.use(cors());
app.use(express.json());

// Middleware pour enregistrer les métriques Prometheus sur chaque requête
app.use((req, res, next) => {
    httpRequestCounter.inc({
        method: req.method,
        route: req.url,
        status_code: res.statusCode
    });
    next();
});

// Connexion à MongoDB Atlas
const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => logger.info("✅ MongoDB Atlas Connected Successfully"))
.catch(err => logger.error("❌ MongoDB Connection Error:", err));

// Endpoint Prometheus pour afficher les métriques collectées
app.get('/metrics', async (req, res) => {
    res.set('Content-Type', client.register.contentType);
    res.end(await client.register.metrics());
});

// Utilisation des routes
app.use('/tasks', taskRoutes);

// Démarrage du serveur
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    logger.info(`✅ Server running at http://localhost:${PORT}`);
});


