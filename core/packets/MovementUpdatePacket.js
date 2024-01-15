import ClientErrorPacket from "./ClientErrorPacket.js";

class MovementUpdatePacket {
  static type = "update_movement";

  static clientSend(socket, bSitting, bAttacking, direction) {
    socket.send(`${this.type}/${bSitting}/${bAttacking}/${direction.join("/")}`);
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
    let bAttacking = args[2] == "true";
    let direction = [Number(args[3]), Number(args[4])];

    let player = server.getPlayerByConnection(conn);

    if (!player) {
      ClientErrorPacket.serverSend([conn], { errorType: ClientErrorPacket.ErrorType.notConnected, message: "U r not connected" });
      return;
    }

    player.entity.direction.setValue(direction);
    player.entity.b_sitting.setValue(bSitting);
    player.entity.bWantAttack = bAttacking;
  }
}

export default MovementUpdatePacket;