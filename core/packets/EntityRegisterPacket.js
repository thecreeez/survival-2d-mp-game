import Entity from "../world/entity/Entity.js";

class EntityRegisterPacket {
  static type = "entity_register_packet";

  static Contexts = {
    loading: "loading",
    playerJoin: "player_join",
    world: "world",
    shop: "shop",
  }

  static serverSend(users, { context, serializedEntity }) {
    users.forEach((user) => {
      user.write(`${this.type}/${context}/${serializedEntity}`);
    })
  }

  static clientHandle(client, data) {
    let args = data.split("/");
    let context = args[1];
    let serializedEntity = args[2];

    let entity = Entity.parse(serializedEntity);

    if (!entity) {
      client.addLog(`WARN`, `Entity from server can't be created. ${serializedEntity}`)
      return;
    }

    if (context === EntityRegisterPacket.Contexts.playerJoin) {
      client.addLog(`INFO`, `Player ${entity.getName()} joined to the game.`)
    }

    client.application.spawnEntity(entity);
  }
}

export default EntityRegisterPacket;