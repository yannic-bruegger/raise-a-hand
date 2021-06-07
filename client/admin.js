let socket = new WebSocket("ws://127.0.0.1:8080");
let counter = 0;

socket.onopen = function(e) {
  const data = {type: 'HELLO', role: 'admin'};
  socket.send(JSON.stringify(data));
};

socket.onmessage = function(event) {
  let command;
  try {
    command = JSON.parse(event.data);
    console.log(command);
  } catch {
    admin.send(JSON.stringify({message: 'ERROR'}));
    return;
  }
  if(command.message === 'HANDRAISED') {
    counter++;
    triggerAnimation()
  }
};

socket.onclose = function(event) {
  if (event.wasClean) {
    console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
  } else {
    console.log('[close] Connection died');
  }
};

socket.onerror = function(error) {
  console.error(`[error] ${error.message}`);
};

function triggerAnimation() {
  document.querySelector('#✋').classList.add('active');
  document.querySelector('.votes').innerHTML = counter;
}

function clearHands() {
  counter = 0;
  document.querySelector('#✋').classList.remove('active');
  document.querySelector('.votes').innerHTML = counter;
}

document.querySelector('#✋').addEventListener('click', () => {clearHands();})