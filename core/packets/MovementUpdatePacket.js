import ClientErrorPacket from "./ClientErrorPacket.js";

class MovementUpdatePacket {
  static type = "update_movement";

  static clientSend(socket, bCrawling, bAttacking, direction, aimRotation) {
    socket.send(`${this.type}/${bCrawling}/${bAttacking}/${direction.join("/")}/${aimRotation}`);
  }

  /**
   * 
   * @param {Server} server 
   * @param {*} conn 
   * @param {String} data 
   */
  static serverHandle(server, conn, data) {
    let args = data.split("/");
    let bCrawling = args[1] == "true";
    let bAttacking = args[2] == "true";
    let direction = [Number(args[3]), Number(args[4])];
    let aimRotation = Math.floor(Number(args[5]) * 100) / 100;

    let player = server.getPlayerByConnection(conn);

    if (!player) {
      ClientErrorPacket.serverSend([conn], { errorType: ClientErrorPacket.ErrorType.notConnected, message: "U r not connected" });
      return;
    }

    player.entity.direction.setValue(direction);
    player.entity.aimRotationFromClient = aimRotation;
    player.entity.bWantToCrawl = bCrawling;
    player.entity.bWantAttack = bAttacking;
  }
}

export default MovementUpdatePacket;