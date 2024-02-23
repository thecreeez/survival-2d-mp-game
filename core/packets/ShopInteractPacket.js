import EntityRegistry from "../registry/EntityRegistry.js";
import Particle from "../world/Particle.js";
import Tile from "../world/Tile.js";
import Entity from "../world/entity/Entity.js";
import EntityRegisterPacket from "./EntityRegisterPacket.js";
import ParticleSpawnPacket from "./ParticleSpawnPacket.js"

class ShopInteractPacket {
  static type = "shop_interact_packet";

  static InteractType = {
    Buy: "buy",
  }

  static clientSend(socket, { type = this.InteractType.Buy, entityId = "core:human_guard_entity", position }) {
    socket.send(`${this.type}/${position.join("/")}/${entityId}/${type}`);
  }

  static serverHandle(server, conn, data) {
    let args = data.split("/");

    let pos = [Number(args[1]), Number(args[2])];
    let entityId = args[3];
    let type = args[4];

    let invoker = server.getPlayerByConnection(conn).entity;
    let world = invoker.getWorld();

    if (this["type_" + type]) {
      this["type_" + type](server, invoker, pos, entityId);
    }
  }

  static type_buy(server, player, position, entityId) {
    let entityClass = EntityRegistry.getById(entityId);

    if (!entityClass) {
      return false;
    }

    
    if (player.getFollowers() < 1) {
      // TO-DO: Сделать проверку и отсылку исключения
    }

    let entity = new entityClass({
      position: position,
      leader: player,
    });

    player.application.spawnEntity(entity, EntityRegisterPacket.Contexts.shop);
  }
}

export default ShopInteractPacket;