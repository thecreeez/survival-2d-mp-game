class EventInvokePacket {
  static type = "event_invoke_packet";

  static EventTypes = {
    pause: (server, player) => {
      server.application.paused = !server.application.paused;
      console.log(`game now is in pause: ${server.application.paused}`)
    }
  }

  static clientSend(socket, eventType) {
    socket.send(`${this.type}/${eventType}`);
  }

  static serverHandle(server, conn, data) {
    let args = data.split("/");
    let eventType = args[1];

    let player = server.getPlayerByConnection(conn);

    if (!player) {
      ClientErrorPacket.serverSend([conn], { errorType: ClientErrorPacket.ErrorType.notConnected, message: "U r not connected" });
      return;
    }

    if (this.EventTypes[eventType]) {
      this.EventTypes[eventType](server, player);
    }
  }
}

export default EventInvokePacket;