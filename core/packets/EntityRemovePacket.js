import Entity from "../world/entity/Entity.js";

class EntityRemovePacket {
  static type = "entity_remove_packet";

  static Contexts = {
    playerDisconnect: "player_disconnect",
    world: "world"
  }

  /**
   * 
   * @param {Array} users 
   * @param {Entity} entity 
   */
  static serverSend(users, entityUuid, context = this.Contexts.world) {
    users.forEach((user) => {
      user.write(`${this.type}/${entityUuid}/${context}`);
    })
  }

  static clientHandle(client, data) {
    let entityUuid = data.split("/")[1];
    let context = data.split("/")[2];

    let entity = client.application.getEntity(entityUuid);

    if (!entity) {
      return;
    }

    if (entity.getFullId() == "core:player_entity" && context == this.Contexts.playerDisconnect) {
      client.addLog(`INFO`, `Player ${entity.getName()} disconnected from the game.`)
    }

    client.application.removeEntity(entityUuid);
  }
}

export default EntityRemovePacket;