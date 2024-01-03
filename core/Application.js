import EntityRegistry from "./EntityRegistry.js";
import PacketRegistry from "./PacketRegistry.js";

import EntityWithAI from "./entity/EntityWithAI.js";
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


class Application {
  static version = 1;

  constructor(context) {
    this._entities = {};

    Application.instance = this;
    this.context = context;
    this.registerEntities();
    this.registerPackets();

    if (!this.isClient()) {
      //this.spawnEntity(new EntityWithAI([0,0,0], 100))
      this.spawnEntity(new ItemEntity({pos: [5,5,5]}))
    }

    console.log(`Load app. Context: ${this.context.type}`);
  }

  registerEntities() {
    EntityRegistry.register(ItemEntity);
    EntityRegistry.register(PlayerEntity);
    EntityRegistry.register(EntityWithAI);
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
    
    // Add to render
    if (this.isClient()) {
      if (entity.getType() == "player_entity" && this.context.username == entity.getName()) {
        this.context.playerEntity = entity;
      }
      
      this.context.addVisualization(entity);
    }

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

      if (this.isClient()) {
        this.context.updateVisualization(entity);
      }
    }
  }

  removeEntity(uuid) {
    // Add to render
    if (this.isClient()) {
      this.context.removeVisualization(entity);
    }

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
      this._entities[uuid].updateServerTick(this);
    }
  }

  updateClientTick() {
    let move = [0,0,0]

    if (this.context.keys["KeyW"]) {
      move[0] += 0.01;
    }

    if (this.context.keys["KeyS"]) {
      move[0] -= 0.01;
    }

    if (this.context.keys["KeyA"]) {
      move[1] -= 0.01;
    }

    if (this.context.keys["KeyD"]) {
      move[1] += 0.01;
    }

    if (move[0] != 0 || move[1] != 0 || move[2] != 0)
      MovementUpdatePacket.clientSend(this.context.connectionHandler.getSocket(), false, this.context.updatePlayerPosition(move));
  }

  isClient() {
    return this.context.type == "client";
  }

  getCoreVersion() {
    return Application.version;
  }
}

export default Application;