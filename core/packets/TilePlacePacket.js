import Particle from "../world/Particle.js";
import Tile from "../world/Tile.js";
import ParticleSpawnPacket from "./ParticleSpawnPacket.js"

class TilePlacePacket {
  static type = "tile_place_packet";

  static clientSend(socket, { pos, tile }) {
    socket.send(`${this.type}/${pos.join("/")}/${tile.serialize()}`);
  }

  static serverHandle(server, conn, data) {
    let args = data.split("/")

    let pos = [Number(args[1]), Number(args[2])];
    let tile = Tile.parse(args[3]);

    let invoker = server.getPlayerByConnection(conn).entity;
    let world = invoker.getWorld();

    invoker.getWorld().setTile(pos, tile);
    TilePlacePacket.serverSend(server, server.getPlayersConnections(), { world, pos, tile, entity: server.getPlayerByConnection(conn).entity });
    ParticleSpawnPacket.serverSend(server, server.getPlayersConnections(), { particle: new Particle({ pack: "core", worldId: invoker.getWorld().getId(), position: [pos[0] * 40 + 20, pos[1] * 40 + 40] }) })
  }

  static serverSend(server, users, { world, pos, tile, entity }) {
    users.forEach((user) => {
      user.write(`${this.type}/${entity.getUuid()}/${world.getId()}/${tile.serialize()}/${pos.join("/")}`);
    })
  }

  static clientHandle(client, data) {
    let args = data.split("/")

    let entityUuid = args[1];
    let worldId = args[2];
    let tile = Tile.parse(args[3]);
    let pos = [args[4], args[5]];

    let entity = client.application.getEntity(entityUuid);

    client.application.getWorld(worldId).setTile(pos, tile);
  }
}

export default TilePlacePacket;