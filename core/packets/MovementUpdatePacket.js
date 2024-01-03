import ClientErrorPacket from "./ClientErrorPacket.js";
import EntityUpdatePacket from "./EntityUpdatePacket.js";

class MovementUpdatePacket {
  static type = "update_movement";

  static clientSend(socket, bSitting, position) {
    socket.send(`${this.type}/${bSitting}/${position.join("/")}`);
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
    let pos = [Number(args[2]), Number(args[3]), Number(args[4])];

    let player = server.getPlayerByConnection(conn);

    if (!player) {
      ClientErrorPacket.serverSend([conn], { errorType: ClientErrorPacket.ErrorType.notConnected, message: "U r not connected" });
      return;
    }

    player.entity.position.setValue(pos);
    player.entity.b_sitting.setValue(bSitting);
    EntityUpdatePacket.serverSend(server.getPlayersConnections(), { data: player.entity.serializeLazy() });
    //server.getPlayersConnections().filter(connCandidate => connCandidate != conn)
  }
}

export default MovementUpdatePacket;