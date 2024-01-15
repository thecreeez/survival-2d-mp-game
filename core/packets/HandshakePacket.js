import Application from "../Application.js";
import PlayerEntity from "../world/entity/PlayerEntity.js";
import EntityRegisterPacket from "./EntityRegisterPacket.js";
import ClientErrorPacket from "./ClientErrorPacket.js";
import WelcomePacket from "./WelcomePacket.js";
import TilesRegisterPacket from "./TilesRegisterPacket.js";

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

    let joinedPlayerEntity = null;

    Application.instance.getEntities().forEach((entity) => {
      if (entity.getType() == "player_entity" && entity.getName() == args[1]) {
        joinedPlayerEntity = entity;
      }
    })
    
    if (!joinedPlayerEntity) {
      joinedPlayerEntity = Application.instance.spawnEntity(new PlayerEntity({ name: args[1] }));

      // Отсылать всем существующим игрокам новоприбывшего
      EntityRegisterPacket.serverSend(server.getPlayersConnections(), { context: EntityRegisterPacket.Contexts.playerJoin, data: joinedPlayerEntity.serialize() });
    }

    // Отсылать новоприбывшему игроку все сущности
    Application.instance.getEntities().forEach((entity) => {
      EntityRegisterPacket.serverSend([conn], { context: EntityRegisterPacket.Contexts.loading, data: entity.serialize() });
    })

    let tiles = [];

    for (let tilePos in Application.instance.getTiles()) {
      let tile = Application.instance.getTiles()[tilePos];
      tiles.push(tile.serialize());
    }

    TilesRegisterPacket.serverSend([conn], tiles);

    server.addPlayerConnection(conn, args[1], joinedPlayerEntity);


    let welcomeMessage = server.getWelcomeMessage();
    welcomeMessage = welcomeMessage.replaceAll(`{player}`, args[1]);
    welcomeMessage = welcomeMessage.replaceAll(`{version}`, args[2]);

    WelcomePacket.serverSend([conn], { message: welcomeMessage });
    //server.saveGame(`save_001.json`);
  }
}

export default HandshakePacket;