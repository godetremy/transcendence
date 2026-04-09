const http = require('http');
const net = require('net');

const port = Number(process.env.PORT || 8888);
const startedAt = Date.now();
const requestCounters = new Map();

function incrementRequestCounter(route, status) {
  const key = `${route}|${status}`;
  const next = (requestCounters.get(key) || 0) + 1;
  requestCounters.set(key, next);
}

function renderMetrics() {
  const lines = [
    '# HELP node_process_uptime_seconds Uptime of the node demo process.',
    '# TYPE node_process_uptime_seconds gauge',
    `node_process_uptime_seconds ${(Date.now() - startedAt) / 1000}`,
    '# HELP node_http_requests_total Total HTTP requests handled by route and status.',
    '# TYPE node_http_requests_total counter',
  ];

  for (const [key, value] of requestCounters.entries()) {
    const [route, status] = key.split('|');
    lines.push(`node_http_requests_total{route="${route}",status="${status}"} ${value}`);
  }

  return `${lines.join('\n')}\n`;
}

function checkHttp(name, url) {
  return new Promise((resolve) => {
    const req = http.get(url, { timeout: 1500 }, (res) => {
      const ok = res.statusCode && res.statusCode < 500;
      resolve({ name, ok: Boolean(ok), details: `status=${res.statusCode}` });
      res.resume();
    });

    req.on('timeout', () => {
      req.destroy(new Error('timeout'));
    });

    req.on('error', (error) => {
      resolve({ name, ok: false, details: error.message });
    });
  });
}

function checkTcp(name, host, targetPort) {
  return new Promise((resolve) => {
    const socket = net.createConnection({ host, port: targetPort, timeout: 1500 }, () => {
      socket.end();
      resolve({ name, ok: true, details: `tcp://${host}:${targetPort}` });
    });

    socket.on('timeout', () => {
      socket.destroy();
      resolve({ name, ok: false, details: 'timeout' });
    });

    socket.on('error', (error) => {
      resolve({ name, ok: false, details: error.message });
    });
  });
}

async function buildStatusReport() {
  const checks = await Promise.all([
    checkHttp('prometheus', 'http://prometheus:9090/-/ready'),
    checkHttp('grafana', 'http://grafana:3000/api/health'),
    checkHttp('elasticsearch', 'http://elasticsearch:9200'),
    checkHttp('logstash', 'http://logstash:9600'),
    checkHttp('kibana', 'http://kibana:5601/api/status'),
    checkHttp('vault', 'http://vault:8200/v1/sys/health'),
  ]);

  const healthy = checks.every((check) => check.ok);
  return {
    status: healthy ? 'ok' : 'degraded',
    uptimeSeconds: Math.floor((Date.now() - startedAt) / 1000),
    checks,
    timestamp: new Date().toISOString(),
  };
}

const server = http.createServer(async (req, res) => {
  if (req.url === '/health') {
    incrementRequestCounter('/health', 200);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok' }));
    return;
  }

  if (req.url === '/metrics') {
    const payload = renderMetrics();
    incrementRequestCounter('/metrics', 200);
    res.writeHead(200, { 'Content-Type': 'text/plain; version=0.0.4' });
    res.end(payload);
    return;
  }

  if (req.url === '/status') {
    try {
      const report = await buildStatusReport();
      const code = report.status === 'ok' ? 200 : 503;
      incrementRequestCounter('/status', code);
      res.writeHead(code, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(report));
      return;
    } catch (error) {
      incrementRequestCounter('/status', 500);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'error', message: error.message }));
      return;
    }
  }

  incrementRequestCounter('default', 200);
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Node demo app running');
});

server.listen(port, '0.0.0.0');
