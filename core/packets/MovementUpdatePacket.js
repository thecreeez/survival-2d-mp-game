import ClientErrorPacket from "./ClientErrorPacket.js";

class MovementUpdatePacket {
  static type = "update_movement";

  static clientSend(socket, bSitting, direction) {
    socket.send(`${this.type}/${bSitting}/${direction.join("/")}`);
  }

  /**
   * 
   * @param {Server} server 
   * @param {*} conn 
   * @param {String} data 
   */
  static serverHandle(server, conn, data) {
    let args = data.split("/");
    let bSitting = args[1] == "true";
    let direction = [Number(args[2]), Number(args[3])];

    let player = server.getPlayerByConnection(conn);

    if (!player) {
      ClientErrorPacket.serverSend([conn], { errorType: ClientErrorPacket.ErrorType.notConnected, message: "U r not connected" });
      return;
    }

    player.entity.direction.setValue(direction);
    player.entity.b_sitting.setValue(bSitting);
    //EntityUpdatePacket.serverSend(server.getPlayersConnections(), { data: player.entity.serializeLazy() });
  }
}

export default MovementUpdatePacket;