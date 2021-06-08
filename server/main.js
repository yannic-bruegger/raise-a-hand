const http = require('http');
const ws = require('ws');

const wss = new ws.Server({noServer: true});
const admins = [];
const users = [];

function accept(req, res) {
  // all incoming requests must be websockets
  if (!req.headers.upgrade || req.headers.upgrade.toLowerCase() != 'websocket') {
    res.end();
    return;
  }

  // can be Connection: keep-alive, Upgrade
  if (!req.headers.connection.match(/\bupgrade\b/i)) {
    res.end();
    return;
  }

  wss.handleUpgrade(req, req.socket, Buffer.alloc(0), onConnect);
}

function onConnect(ws) {
  ws.on('close', (x) => {
    console.log('Take \'em out');
    admins.splice(admins.indexOf(ws), 1);
    users.splice(users.indexOf(ws), 1);
  });
  ws.on('message', function (message) {
    let command;
    try {
      command = JSON.parse(message);
      console.log(command);
    } catch {
      admin.send(JSON.stringify({message: 'ERROR'}));
      return;
    }

    if(command.type === 'HELLO'){
      if(command.role === 'admin'){
        admins.push(ws);
      }
      if(command.role === 'user'){
        users.push(ws);
      }
    }

    if(command.type === 'RAISE'){
      admins.forEach((admin) => {
        admin.send(JSON.stringify({message: 'HANDRAISED'}));
      })
    }
  });
}

http.createServer(accept).listen(8080);