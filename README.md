# 📊 Logging and Monitoring Project

This repository contains a complete setup for logging and monitoring using **Node.js**, **Prometheus**, **AlertManager**, and **Docker**. This guide provides step-by-step instructions, troubleshooting tips, and solutions for common issues encountered during the setup.

---

## 📦 Project Structure
Ensure your project structure is as follows:
```
logging-monitoring/
├── frontend/                   # Frontend files (if applicable)
├── backend/                    # Node.js backend
│   ├── app.js                  # Main backend server
│   ├── log_scraper.js          # Log scraping for error metrics
│   ├── log4js.config.js        # Log4js configuration
│   └── routes/                 # API routes
├── prometheus.yml              # Prometheus configuration
├── alert.rules.yml             # Prometheus alert rules
├── alertmanager.yml            # AlertManager configuration
├── .env                        # Environment variables
└── README.md                   # You're here!
```

---

## ✅ Prerequisites
Before starting, ensure you have the following installed:
- [Node.js](https://nodejs.org/)
- [Docker](https://www.docker.com/)

---

## 🚀 Step-by-Step Setup Guide

### 1. **Clone the Repository**
```bash
git clone https://github.com/your-username/logging-monitoring.git
cd logging-monitoring
```

### 2. **Set Up Environment Variables**
Create a `.env` file in the root directory with your MongoDB Atlas URI:
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
PORT=3001
```

---

### 3. **Backend Setup and MongoDB Connection**

**Install Dependencies:**
```bash
cd backend
npm install
```

**Configure `app.js`:**
Ensure `app.js` has the following:
```javascript
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const log4js = require('log4js');
const logConfig = require('./log4js.config');
const taskRoutes = require('./routes/tasks');
const { client, httpRequestCounter } = require('./prometheus');

const app = express();
log4js.configure(logConfig);
const logger = log4js.getLogger();

app.use(log4js.connectLogger(logger, { level: 'info' }));
app.use(cors());
app.use(express.json());

const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => logger.info("✅ MongoDB Connected Successfully!"))
.catch(err => logger.error("❌ MongoDB Connection Error:", err));

app.use('/tasks', taskRoutes);
app.get('/metrics', async (req, res) => {
    res.set('Content-Type', client.register.contentType);
    res.end(await client.register.metrics());
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => logger.info(`✅ Server running on http://localhost:${PORT}`));
```

**Common Issues:**
- Ensure `dotenv` is properly installed.
- If MongoDB fails to connect, verify the `MONGO_URI` in your `.env` file.

---

### 4. **Setting Up Log Scraper for Prometheus Metrics**

**Create `log_scraper.js`:**
```javascript
const fs = require('fs');
const readline = require('readline');
const client = require('prom-client');
const express = require('express');

const errorCount = new client.Counter({
    name: 'log_error_count',
    help: 'Count of error-level logs',
});

const rl = readline.createInterface({
    input: fs.createReadStream('logs/application.log'),
    output: process.stdout,
    terminal: false
});

rl.on('line', (line) => {
    if (line.includes('[ERROR]')) {
        errorCount.inc();
    }
});

const app = express();
client.collectDefaultMetrics();

app.get('/metrics', async (req, res) => {
    res.set('Content-Type', client.register.contentType);
    res.end(await client.register.metrics());
});

app.listen(3002, () => console.log("✅ Log Scraper server running on port 3002"));
```

**Common Issues:**
- **Port Conflict (EADDRINUSE)**: If you see a port error, kill the process using:
  ```bash
  netstat -ano | findstr :3002
  taskkill /PID <PID> /F
  ```

---

### 5. **Configuring Prometheus and AlertManager**

Ensure the following files are configured correctly at the project root:

**`prometheus.yml`**:
```yaml
scrape_configs:
  - job_name: 'node_app'
    static_configs:
      - targets: ['host.docker.internal:3001']

  - job_name: 'log_scraper'
    static_configs:
      - targets: ['host.docker.internal:3002']

alerting:
  alertmanagers:
    - static_configs:
        - targets: ['host.docker.internal:9093']
rule_files:
  - "./alert.rules.yml"
```

**`alert.rules.yml`**:
```yaml
groups:
  - name: log-alerts
    rules:
      - alert: HighErrorLogCount
        expr: log_error_count > 10
        for: 1m
        labels:
          severity: warning
        annotations:
          summary: "High error log count detected."
          description: "More than 10 error logs detected in a minute."
```

---

### 6. **Running Prometheus and AlertManager Containers**
```bash
docker run -d --name prometheus -p 9090:9090 \
-v ${PWD}/prometheus.yml:/etc/prometheus/prometheus.yml \
-v ${PWD}/alert.rules.yml:/etc/prometheus/alert.rules.yml \
prom/prometheus

docker run -d --name alertmanager -p 9093:9093 \
-v ${PWD}/alertmanager.yml:/etc/alertmanager/alertmanager.yml \
prom/alertmanager
```

---

### ✅ **Final Verification Steps:**
- **Prometheus UI:** [http://localhost:9090](http://localhost:9090)
- **AlertManager UI:** [http://localhost:9093](http://localhost:9093)
- **Log Scraper Metrics:** [http://localhost:3002/metrics](http://localhost:3002/metrics)

🎯 **Congratulations! You've successfully completed the logging and monitoring setup!** 🚀

