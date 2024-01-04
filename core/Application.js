import EntityRegistry from "./EntityRegistry.js";
import PacketRegistry from "./PacketRegistry.js";

import OrcEntity from "./entity/OrcEntity.js";
import ItemEntity from "./entity/ItemEntity.js";
import PlayerEntity from "./entity/PlayerEntity.js";

import EntityRegisterPacket from "./packets/EntityRegisterPacket.js";
import EntityRemovePacket from "./packets/EntityRemovePacket.js";
import ClientErrorPacket from "./packets/ClientErrorPacket.js";
import HandshakePacket from "./packets/HandshakePacket.js";
import WelcomePacket from "./packets/WelcomePacket.js";
import EntityUpdatePacket from "./packets/EntityUpdatePacket.js";
import MovementUpdatePacket from "./packets/MovementUpdatePacket.js";
import CommandInputPacket from "./packets/CommandInputPacket.js";

import SharedData from "./SharedData.js";
import ItemRegistry from "./ItemRegistry.js";
import Item from "./Item.js";


class Application {
  static version = 1;

  constructor(context) {
    this._entities = {};

    Application.instance = this;
    this.context = context;
    this.lastTickTime = Date.now();
    this.registerEntities();
    this.registerPackets();

    if (!this.isClient()) {
      this.spawnEntity(new OrcEntity([300,300]))
      //this.spawnEntity(new EntityWithAI([800, 800], 100, { target_class: "entity_with_ai"}))
    }

    console.log(`Load app. Context: ${this.context.type}`);
  }

  registerEntities() {
    EntityRegistry.register(ItemEntity);
    EntityRegistry.register(PlayerEntity);
    EntityRegistry.register(OrcEntity);
  }

  registerItems() {
    ItemRegistry.register(new Item({
      id: "log",
      maxStack: 16
    }));
  }

  registerPackets() {
    PacketRegistry.register(HandshakePacket);
    PacketRegistry.register(WelcomePacket);
    PacketRegistry.register(EntityRegisterPacket);
    PacketRegistry.register(EntityUpdatePacket);
    PacketRegistry.register(EntityRemovePacket);
    PacketRegistry.register(ClientErrorPacket);
    PacketRegistry.register(MovementUpdatePacket);
    PacketRegistry.register(CommandInputPacket);
  }

  spawnEntity(entity) {
    this._entities[entity.getUuid()] = entity;

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

    if (controlsHandler.horizontal != 0 || controlsHandler.vertical != 0 || this.context.getPlayer().b_sitting.getValue() != controlsHandler.bSitting) {
      MovementUpdatePacket.clientSend(this.context.connectionHandler.getSocket(), controlsHandler.bSitting, [
        controlsHandler.horizontal * 3,
        -controlsHandler.vertical * 3,
      ]);
    }
  }

  isClient() {
    return this.context.type == "client";
  }

  getCoreVersion() {
    return Application.version;
  }
}

export default Application;