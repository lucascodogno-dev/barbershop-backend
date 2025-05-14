
require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

// Configuração do servidor Express
const app = express();
const allowedOrigin = process.env.CLIENT_URL || 'https://barbeariabiriguiteste.netlify.app';

app.use(cors({
  origin: allowedOrigin,
  methods: ['GET', 'POST'],
  credentials: true,
}));

const io = new Server(server, {
  cors: {
    origin: allowedOrigin,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});


app.use(express.json());

// Configuração do servidor HTTP
const server = http.createServer(app);

// Configuração do Socket.io
// const io = new Server(server, {
//   cors: {
//     origin: process.env.CLIENT_URL || 'https://barbeariabiriguiteste.netlify.app', // Alterado para 5173
//     methods: ['GET', 'POST'],
//     credentials: true
//   }
// });

// Rota básica para verificar se o servidor está funcionando
app.get('/', (req, res) => {
  res.send('Servidor de agendamento da barbearia está rodando!');
});

// Middleware para registrar conexões e eventos
io.use((socket, next) => {
  console.log(`Nova conexão: ${socket.id}`);
  next();
});

// Gerenciamento de conexões Socket.io
io.on('connection', (socket) => {
  console.log(`Cliente conectado: ${socket.id}`);

  // ===== EVENTOS DE AGENDAMENTOS =====
  
  // Evento de agendamento criado
  socket.on('appointment-created', (appointment) => {
    console.log('Novo agendamento criado:', appointment);
    // Emite para todos os clientes, exceto o que enviou
    socket.broadcast.emit('appointment-created', appointment);
  });

  // Evento de agendamento atualizado
  socket.on('appointment-updated', (appointment) => {
    console.log('Agendamento atualizado:', appointment);
    socket.broadcast.emit('appointment-updated', appointment);
  });

  // Evento de agendamento excluído
  socket.on('appointment-deleted', (id) => {
    console.log('Agendamento excluído:', id);
    socket.broadcast.emit('appointment-deleted', id);
  });

  // Evento de status de agendamento atualizado
  socket.on('appointment-status-updated', (data) => {
    console.log('Status de agendamento atualizado:', data);
    socket.broadcast.emit('appointment-status-updated', data);
  });

  // ===== EVENTOS DE SERVIÇOS =====
  
  // Evento de serviço criado
  socket.on('service-created', (service) => {
    console.log('Novo serviço criado:', service);
    socket.broadcast.emit('service-created', service);
  });

  // Evento de serviço atualizado
  socket.on('service-updated', (service) => {
    console.log('Serviço atualizado:', service);
    socket.broadcast.emit('service-updated', service);
  });

  // Evento de serviço excluído
  socket.on('service-deleted', (id) => {
    console.log('Serviço excluído:', id);
    socket.broadcast.emit('service-deleted', id);
  });

  // ===== EVENTOS DE CONFIGURAÇÕES =====
  
  // Evento de configurações atualizadas
  socket.on('settings-updated', (data) => {
    console.log('Configurações atualizadas:', data.type);
    // Emite para todos os clientes, exceto o que enviou
    socket.broadcast.emit('settings-updated', data);
  });

  // ===== OUTROS EVENTOS =====
  
  // Evento de desconexão
  socket.on('disconnect', () => {
    console.log(`Cliente desconectado: ${socket.id}`);
  });
});

// Inicialização do servidor
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});