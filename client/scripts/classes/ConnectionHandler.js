import PacketRegistry from '../../../core/registry/PacketRegistry.js';
import HandshakePacket from '../../../core/packets/HandshakePacket.js';

class ConnectionHandler {
  constructor(client, ip) {
    this._client = client;

    this._socket = new SockJS("http://" + ip + "/socket");

    this._socket.onopen = () => {
      this.handshake();
    }

    this._socket.onmessage = (e) => {
      this.message(e.data);
    }

    this._socket.onclose = () => {
      this.disconnect();
    }
  }

  getSocket() {
    return this._socket;
  }

  handshake() {
    HandshakePacket.clientSend(this._socket, { username: this._client.username, coreVersion: this._client.application.getCoreVersion() });
    this._client.addLog(`INFO`,`Connection with server established. Handshaking...`);
  }

  message(data) {
    let args = data.split("/");
    
    if (!PacketRegistry[args[0]]) {
      console.error(`ERROR`, `Packet from server is not exist: ${args[0]}`)
      this._client.addLog(`ERROR`, `Packet from server is not exist: ${args[0]}`);
      return;
    }

    if (!PacketRegistry[args[0]].clientHandle) {
      console.error(`ERROR`, `Client cant handle packet: ${args[0]}`)
      this._client.addLog(`ERROR`, `Client cant handle packet: ${args[0]}`);
      return;
    }

    PacketRegistry[args[0]].clientHandle(this._client, data);
  }

  disconnect() {
    this._client.addLog(`INFO`, `Socket disconnected.`);
  }
}

export default ConnectionHandler;