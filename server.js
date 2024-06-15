const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Configurar o CORS
app.use(cors());

wss.on('connection', (ws) => {
  ws.id = uuidv4();
  console.log('New client connected with ID:', ws.id);

  ws.on('message', (message) => {
    const parsedMessage = JSON.parse(message);
    console.log(`Received: ${parsedMessage.text} from ${ws.id}`);

    // Transmitir a mensagem para todos os clientes conectados
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        const messageToSend = {
          text: parsedMessage.text,
          fromMe: client.id === ws.id,
          userName: parsedMessage.userName,
          userImage: parsedMessage.userImage
        };
        client.send(JSON.stringify(messageToSend));
      }
    });
  });

  ws.on('close', () => {
    console.log('Client disconnected:', ws.id);
  });
});

app.use(express.static('public'));

server.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
