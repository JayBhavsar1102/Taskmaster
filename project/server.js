import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import express from 'express';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

// Store connected clients
const clients = new Set();

// Heartbeat to keep connections alive
function heartbeat() {
  this.isAlive = true;
}

wss.on('connection', (ws) => {
  console.log('Client connected');
  clients.add(ws);
  ws.isAlive = true;
  ws.on('pong', heartbeat);

  ws.on('message', (message) => {
    try {
      const parsedMessage = JSON.parse(message);
      
      // Broadcast the message to all connected clients except the sender
      clients.forEach((client) => {
        if (client !== ws && client.readyState === ws.OPEN) {
          client.send(JSON.stringify(parsedMessage));
        }
      });
    } catch (error) {
      console.error('Error processing message:', error);
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
    clients.delete(ws);
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
    clients.delete(ws);
  });
});

// Implement connection cleanup
const interval = setInterval(() => {
  wss.clients.forEach((ws) => {
    if (ws.isAlive === false) {
      clients.delete(ws);
      return ws.terminate();
    }
    ws.isAlive = false;
    ws.ping();
  });
}, 30000);

wss.on('close', () => {
  clearInterval(interval);
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`WebSocket server running on port ${PORT}`);
});