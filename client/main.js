let socket;

function connect(){
  socket = new WebSocket("wss://bcbb1475eec9.ngrok.io");

  socket.onopen = function(e) {
    const data = {type: 'HELLO', role: 'user'};
    socket.send(JSON.stringify(data));
  };

  socket.onmessage = function(event) {
    console.log(`[message] Data received from server: ${event.data}`);
  };

  socket.onclose = function(event) {
    if (event.wasClean) {
      setTimeout(connect, 1000);
      console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
    } else {
      console.log('[close] Connection died');
    }
  };

  socket.onerror = function(error) {
    console.error(`[error] ${error.message}`);
  };

}

function raiseHand() {
  const data = {type: 'RAISE'}
  socket.send(JSON.stringify(data));
}

connect();

document.querySelector('#✋').addEventListener('click', () => {raiseHand();})