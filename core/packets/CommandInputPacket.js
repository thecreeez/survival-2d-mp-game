import EntityRegistry from "../EntityRegistry.js";
import ClientErrorPacket from "./ClientErrorPacket.js";
import EntityRegisterPacket from "./EntityRegisterPacket.js";

class CommandInputPacket {
  static type = "command_input";

  static clientSend(socket, command, ...args) {
    socket.send(`${this.type}/${command}/${args.join("/")}`);
  }

  /**
   * 
   * @param {Server} server 
   * @param {*} conn 
   * @param {String} data 
   */
  static serverHandle(server, conn, data) {
    let args = data.split("/");
    let command = args[1];

    if (this["command_"+command]) {
      this["command_"+command](server, conn, args);
    }
  }

  static command_summon(server, conn, args) {
    let player = server.getPlayerByConnection(conn);

    if (args.length < 3) {
      ClientErrorPacket.serverSend([conn], { message: "Слишком мало аргументов: summon <type>" });
      return;
    }

    let type = args[2];

    if (!EntityRegistry[type]) {
      ClientErrorPacket.serverSend([conn], { message: "Неизвестный Entity: "+type });
      return;
    }

    let entity = server.application.spawnEntity(new EntityRegistry[type]());
    entity.position.setValue([...player.entity.getPosition()]);
    ClientErrorPacket.serverSend([conn], { message: type + " успешно вызван." });

    EntityRegisterPacket.serverSend(server.getPlayersConnections(), { context: EntityRegisterPacket.Contexts.world, data: entity.serialize() });
  }
}

export default CommandInputPacket;