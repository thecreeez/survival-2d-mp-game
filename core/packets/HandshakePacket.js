import Application from "../Application.js";
import PlayerEntity from "../entity/PlayerEntity.js";
import EntityRegisterPacket from "./EntityRegisterPacket.js";
import ClientErrorPacket from "./ClientErrorPacket.js";
import WelcomePacket from "./WelcomePacket.js";

class HandshakePacket {
  static type = "handshake";

  static clientSend(socket, { username, coreVersion }) {
    socket.send(`${this.type}/${username}/${coreVersion}`);
  }

  /**
   * 
   * @param {Server} server 
   * @param {*} conn 
   * @param {String} data 
   */
  static serverHandle(server, conn, data) {
    let args = data.split("/");

    if (server.getPlayerByName(args[1])) {
      ClientErrorPacket.serverSend([conn], { 
        errorType: ClientErrorPacket.ErrorType.userWithThatNameAlreadyPlaying,
        message: "Player with name " + args[1] + " already playing on this server."
      });
      return;
    }
    
    let newPlayer = Application.instance.spawnEntity(new PlayerEntity(args[1], 100, [0,0,0]));

    // Отсылать всем существующим игрокам новоприбывшего
    EntityRegisterPacket.serverSend(server.getPlayersConnections(), { context: EntityRegisterPacket.Contexts.playerJoin, data: newPlayer.serialize() });

    // Отсылать новоприбывшему игроку все сущности
    Application.instance.getEntities().forEach((entity) => {
      EntityRegisterPacket.serverSend([conn], { context: EntityRegisterPacket.Contexts.loading, data: entity.serialize() });
    })

    server.addPlayerConnection(conn, args[1], newPlayer);
    WelcomePacket.serverSend([conn], { message: "Добро пожаловать, "+data.split("/")[1] });
  }
}

export default HandshakePacket;