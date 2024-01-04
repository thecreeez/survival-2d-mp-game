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
    let direction = [Number(args[2]), Number(args[3])];

    let player = server.getPlayerByConnection(conn);

    if (!player) {
      ClientErrorPacket.serverSend([conn], { errorType: ClientErrorPacket.ErrorType.notConnected, message: "U r not connected" });
      return;
    }

    let oldPos = player.entity.getPosition();

    if (direction[0] >= 0 && direction[1] >= 0) {
      player.entity.rotation.setValue(0);
    } else if (direction[0] < 0 && direction[1] >= 0) {
      player.entity.rotation.setValue(1);
    } else if (direction[0] >= 0 && direction[1] < 0) {
      player.entity.rotation.setValue(2);
    } else if (direction[0] < 0 && direction[1] < 0) {
      player.entity.rotation.setValue(3);
    }

    player.entity.lastTimeMove = Date.now();
    player.entity.position.setValue([oldPos[0] + direction[0], oldPos[1] + direction[1]])
    player.entity.b_sitting.setValue(bSitting);
    EntityUpdatePacket.serverSend(server.getPlayersConnections(), { data: player.entity.serializeLazy() });
    //server.getPlayersConnections().filter(connCandidate => connCandidate != conn)
  }
}

export default MovementUpdatePacket;