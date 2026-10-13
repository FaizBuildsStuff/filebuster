const net = require('net');

const PORT = 34982;
const HOST = '127.0.0.1';

/**
 * Try to connect to an existing File Buster instance and forward arguments.
 * @param {string[]} args Command line arguments
 * @returns {Promise<boolean>} True if forwarded to existing instance, False if no instance running
 */
function forwardToRunningInstance(args) {
  return new Promise((resolve) => {
    const client = net.connect({ port: PORT, host: HOST }, () => {
      console.log('[IPC] Connected to running File Buster instance. Sending command...');
      client.write(JSON.stringify({ args }));
      client.end();
      resolve(true);
    });

    client.on('error', () => {
      // No existing instance running
      resolve(false);
    });
  });
}

/**
 * Start IPC server to listen for commands from Windows context menu
 * @param {function(data: {args: string[]}): void} onMessage
 */
function startIpcServer(onMessage) {
  const server = net.createServer((socket) => {
    socket.on('data', (chunk) => {
      try {
        const payload = JSON.parse(chunk.toString());
        if (payload && payload.args) {
          onMessage(payload.args);
        }
      } catch (err) {
        console.warn('[IPC] Malformed message:', err);
      }
    });
  });

  server.on('error', (err) => {
    console.warn('[IPC] Server error:', err.message);
  });

  server.listen(PORT, HOST, () => {
    console.log(`[IPC] File Buster command server listening on ${HOST}:${PORT}`);
  });

  return server;
}

module.exports = {
  forwardToRunningInstance,
  startIpcServer
};
