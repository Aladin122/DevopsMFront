const express = require('express');
const client = require('prom-client');
const app = express();
const port = 5174;

// Collect default Node.js metrics
client.collectDefaultMetrics();

// Custom metric to check Vite frontend status
const frontendStatus = new client.Gauge({
    name: 'vite_frontend_up',
    help: 'Frontend dev server running status (1 = up)',
});

// Ping Vite every 5s to update status
setInterval(async () => {
    try {
        const res = await fetch('http://localhost:5173');
        frontendStatus.set(res.ok ? 1 : 0);
    } catch (e) {
        frontendStatus.set(0);
    }
}, 5000);

// Expose metrics
app.get('/metrics', async (req, res) => {
    res.set('Content-Type', client.register.contentType);
    res.end(await client.register.metrics());
});

app.listen(port, () => {
    console.log(`Metrics server running at http://localhost:${port}/metrics`);
});
