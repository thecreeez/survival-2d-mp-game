import Entity from "../world/entity/Entity.js";

class EntityRemovePacket {
  static type = "entity_remove_packet";

  /**
   * 
   * @param {Array} users 
   * @param {Entity} entity 
   */
  static serverSend(users, entity) {
    users.forEach((user) => {
      user.write(`${this.type}/${entity.getUuid()}`);
    })
  }

  static clientHandle(client, data) {
    let entityUuid = data.split("/")[1];

    let entity = client.application.getEntity(entityUuid);

    if (entity.getType() == "player_entity") {
      client.addLog(`INFO`, `Player ${entity.getName()} disconnected from the game.`)
    }

    client.application.removeEntity(entityUuid);
  }
}

export default EntityRemovePacket;