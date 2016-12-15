const WebSocketServer = require('ws').Server; 
 
const wss = new WebSocketServer({ port: process.env.PORT || 3434 }); 
 
wss.broadcast = function(data, sender) { 
  this.clients.forEach(function(client) {
    if (client !== sender && client.secret === sender.secret) { 
      client.send(data); 
    } 
  }) 
}; 
 
wss.on('connection', function(ws) {
  ws.on('message', function(message) {
    let parsed = {};
    try {
      parsed = JSON.parse(message);
    } catch (e) {
      console.log(e);
    }

    if (parsed.secret) {
      ws.secret = parsed.secret;
    }

    wss.broadcast(message, ws); 
  }); 
});