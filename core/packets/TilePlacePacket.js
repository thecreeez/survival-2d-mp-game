import Tile from "../world/Tile.js";

class TilePlacePacket {
  static type = "tile_place_packet";

  static clientSend(socket, { pos, pack, sheetPos }) {
    socket.send(`${this.type}/${pos.join("/")}/${pack}/${sheetPos.join("/")}`);
  }

  static serverHandle(server, conn, data) {
    let args = data.split("/")

    let pos = [args[1], args[2]];
    let pack = args[3];
    let sheetPos = [args[4], args[5]];

    server.application.setTile(new Tile({
      pack,
      pos,
      sheetPos
    }));
    TilePlacePacket.serverSend(server, server.getPlayersConnections(), { pos, pack, sheetPos, entity: server.getPlayerByConnection(conn).entity });
  }

  static serverSend(server, users, { pos, pack, sheetPos, entity }) {
    users.forEach((user) => {
      user.write(`${this.type}/${entity.getUuid()}/${pos[0]}/${pos[1]}/${pack}/${sheetPos[0]}/${sheetPos[1]}`);
    })
  }

  static clientHandle(client, data) {
    let args = data.split("/")

    let entityUuid = args[1];
    let pos = [args[2], args[3]];
    let pack = args[4];
    let sheetPos = [args[5], args[6]];

    client.application.setTile(new Tile({
      pack,
      pos,
      sheetPos
    }));
  }
}

export default TilePlacePacket;