import EntityRegistry from "./EntityRegistry.js";
import PacketRegistry from "./PacketRegistry.js";
import ItemRegistry from "./ItemRegistry.js";

import World from "./world/World.js";

import OrcEntity from "./world/entity/OrcEntity.js";
import ItemEntity from "./world/entity/ItemEntity.js";
import PlayerEntity from "./world/entity/PlayerEntity.js";
import EffectEntity from "./world/entity/EffectEntity.js";

import EntityRegisterPacket from "./packets/EntityRegisterPacket.js";
import EntityRemovePacket from "./packets/EntityRemovePacket.js";
import ClientErrorPacket from "./packets/ClientErrorPacket.js";
import HandshakePacket from "./packets/HandshakePacket.js";
import WelcomePacket from "./packets/WelcomePacket.js";
import EntityUpdatePacket from "./packets/EntityUpdatePacket.js";
import MovementUpdatePacket from "./packets/MovementUpdatePacket.js";
import CommandInputPacket from "./packets/CommandInputPacket.js";
import TilesRegisterPacket from "./packets/TilesRegisterPacket.js";
import TilePlacePacket from "./packets/TilePlacePacket.js";
import SaveRequestPacket from "./packets/SaveRequestPacket.js";

import SharedData from "./SharedData.js";
import Item from "./world/Item.js";

class Application {
  static version = 2;

  constructor(context) {
    this._entities = {};
    this._worlds = {};

    this.setWorld(new World({ id: "spawn" }))

    this.context = context;
    this.lastTickTime = Date.now();
    this.registerEntities();
    this.registerPackets();
    this.registerItems();

    Application.instance = this;
    console.log(`Load app. Context: ${this.context.type}`);
  }

  registerEntities() {
    EntityRegistry.register(ItemEntity);
    EntityRegistry.register(PlayerEntity);
    EntityRegistry.register(OrcEntity);
    EntityRegistry.register(EffectEntity);
  }

  registerItems() {
    ItemRegistry.register(new Item({
      id: "log",
      maxStack: 16,
      spritePos: [0, 0]
    }));
  }

  registerPackets() {
    PacketRegistry.register(HandshakePacket);
    PacketRegistry.register(SaveRequestPacket);

    PacketRegistry.register(WelcomePacket);
    PacketRegistry.register(ClientErrorPacket);

    PacketRegistry.register(EntityRegisterPacket);
    PacketRegistry.register(EntityUpdatePacket);
    PacketRegistry.register(EntityRemovePacket);

    PacketRegistry.register(TilesRegisterPacket);
    PacketRegistry.register(TilePlacePacket);

    PacketRegistry.register(MovementUpdatePacket);
    PacketRegistry.register(CommandInputPacket);
  }

  setWorld(world) {
    this._worlds[world.getId()] = world;

    return this._worlds[world.getId()];
  }

  getWorld(worldId) {
    return this._worlds[worldId];
  }

  getWorlds() {
    let worlds = [];

    for (let worldId in this._worlds) {
      worlds.push(this._worlds[worldId]);
    }

    return worlds;
  }

  spawnEntity(entity) {
    this._entities[entity.getUuid()] = entity;
    entity.application = this;

    return entity;
  }

  getEntity(uuid) {
    return this._entities[uuid];
  }

  updateEntity(data) {
    let sharedDatas = data.split(";");

    let entity = null;

    sharedDatas.forEach((sharedData) => {
      let sharedDataParsed = SharedData.parse(sharedData);

      if (sharedDataParsed.getId() == "uuid") {
        entity = this.getEntity(sharedDataParsed.getValue());
      }
    })

    if (entity) {
      entity.load(sharedDatas);
    }
  }

  removeEntity(uuid) {
    delete this._entities[uuid];
  }

  getEntities() {
    let entities = [];

    for (let entityUuid in this._entities) {
      entities.push(this._entities[entityUuid]);
    }

    return entities;
  }

  updateTick() {
    if (!this.isClient()) {
      this.updateServerTick();
    }

    if (this.isClient()) {
      this.updateClientTick();
    }
  }

  updateServerTick() {
    let startTick = Date.now();
    for (let uuid in this._entities) {
      this._entities[uuid].startUpdateServerTick(this);
    }

    for (let uuid in this._entities) {
      this._entities[uuid].updateServerTick(this, startTick - this.lastTickTime);
    }

    this.lastTickTime = Date.now();
  }

  updateClientTick() {
    let controlsHandler = this.context.getControlsHandler();

    if (!this.context.getPlayer())
      return;

    let player = this.context.getPlayer();

    if (controlsHandler.horizontal != player.getDirection()[0] || controlsHandler.vertical != -player.getDirection()[1] || player.bSitting() != controlsHandler.bSitting || player.bAttacking() != controlsHandler.bAttacking) {
      MovementUpdatePacket.clientSend(this.context.connectionHandler.getSocket(), 
        controlsHandler.bSitting, 
        controlsHandler.bAttacking, 
        [
          controlsHandler.horizontal,
          -controlsHandler.vertical,
        ]
      );
    }
  }

  isClient() {
    return this.context.type == "client";
  }

  getCoreVersion() {
    return Application.version;
  }

  getDefaultWorld() {
    return this.getWorld("core:spawn");
  }
}

export default Application;