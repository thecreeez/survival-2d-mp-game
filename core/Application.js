import EntityRegistry from "./registry/EntityRegistry.js";
import PacketRegistry from "./registry/PacketRegistry.js";
import ItemRegistry from "./registry/ItemRegistry.js";
import PropRegistry from "./registry/PropRegistry.js";

import World from "./world/World.js";

import SpiderEntity from "./world/entity/SpiderEntity.js";
import PlayerEntity from "./world/entity/PlayerEntity.js";
import PropEntity from "./world/entity/PropEntity.js";
import HumanGuardEntity from "./world/entity/HumanGuardEntity.js";

import EntityRegisterPacket from "./packets/EntityRegisterPacket.js";
import EntityRemovePacket from "./packets/EntityRemovePacket.js";
import MovementUpdatePacket from "./packets/MovementUpdatePacket.js";

import SharedData from "./SharedData.js";
import Tile from "./world/Tile.js";

import core from "../packs/core.js";

class Application {
  static version = 2;

  constructor(context) {
    this._entities = {};
    this._worlds = {};

    this._packs = {};
    this.state = 0;

    this.setWorld(new World({ id: "spawn" }))

    this.context = context;
    this.lastTickTime = Date.now();
    
    this.registerPack(core);

    this.loadPacks(); // Передвинуть это в сервер/клиент, чтоб можно было просунуть логику подгрузки

    if (!this.isClient()) {
      for (let i = -20; i < 20; i++) {
        for (let j = -20; j < 20; j++) {
          this.getWorld("core:spawn").setTile(new Tile({ pack: "core", pos: [i,j], sheetPos: [0,1] }))
        }
      }

      this.getWorld("core:spawn").setTile(new Tile({ pack: "core", pos: [0, 0], sheetPos: [0, 0] }))

      for (let i = -10; i < 10; i++) {
        let state = "default";

        if (Math.random() > 0.7) {
          state = "blue";
        }

        this.spawnEntity(new PropEntity({ position: [80 * i, 0], state }));
      }

      this.spawnEntity(new PropEntity({ position: [120,120], propId: "red_car" }));
      this.spawnEntity(new PropEntity({ position: [200, 120], propId: "red_car", state: "top" }));
      this.spawnEntity(new SpiderEntity({ position: [600, 300] }));
      this.spawnEntity(new HumanGuardEntity({ position: [-300, 100] }));
    }

    Application.instance = this;
    console.log(`Load app. Context: ${this.context.type}`);
  }

  registerPack({ pack, entities = [], entitiesTextures = {}, packets = [], items = [], tilesetData = {}, particles = [], ui = [], props = [] }) {
    if (this.state != 0) {
      console.error(`Packs cannot be registered on this state.`)
      return;
    }

    this._packs[pack] = {
      entities,
      entitiesTextures,
      packets,
      particles,
      items,
      ui,
      props,
      tilesetData
    };
  }

  loadPacks() {
    this.state = 1;

    console.log(`Loading packs...`)
    for (let packId in this._packs) {
      console.log(`Pack [${packId}] loading...`)
      this._packs[packId].entities.forEach((entityClass) => {
        EntityRegistry.register(packId, entityClass.id, entityClass);
        entityClass.pack = `${packId}`;

        entityClass.onRegister(this);
      })
      console.log(`Loaded: ${this._packs[packId].entities.length} entities.`)

      this._packs[packId].packets.forEach((packetClass) => {
        PacketRegistry.register(packId, packetClass.type, packetClass);
        packetClass.type = `${packId}:${packetClass.type}`;
      })
      console.log(`Loaded: ${this._packs[packId].packets.length} packets.`)

      this._packs[packId].items.forEach((item) => {
        ItemRegistry.register(packId, item.id, item);
        item.id = `${packId}:${item.id}`;
      })
      console.log(`Loaded: ${this._packs[packId].items.length} items.`)

      this._packs[packId].props.forEach((prop) => {
        PropRegistry.register(packId, prop.id, prop);
      })
      console.log(`Loaded: ${this._packs[packId].props.length} props.`)

      if (this.isClient()) {
        console.log(`Registering assets...`);
        this.context.registerAssetPack(packId, this._packs[packId]);
      }

      console.log(`Pack ${packId} loaded.`)
    }
    console.log(`Pack loading end.`)
  }

  getPack(packId) {
    return this._packs[packId];
  }

  setWorld(world) {
    this._worlds[world.getId()] = world;
    world.application = this;

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

  spawnEntity(entity, context = EntityRegisterPacket.Contexts.world) {
    this._entities[entity.getUuid()] = entity;
    entity.application = this;

    if (!this.isClient() && this.context.bLoaded) {
      EntityRegisterPacket.serverSend(this.context.getPlayersConnections(), { context, serializedEntity: entity.serialize() })
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
    }
  }

  removeEntity(uuid) {
    if (!this._entities[uuid])
      return console.error(`ERROR: ENTITY DELETED ALREADY.`)

    if (!this.isClient()) {
      EntityRemovePacket.serverSend(this.context.getPlayersConnections(), uuid);

      if (this._entities[uuid].getFullId() === "core:player_entity" && this.context.getPlayerByName(this._entities[uuid].getName())) {
        let newEntity = this.spawnEntity(new PlayerEntity({ name: this._entities[uuid].getName() }));

        this.context.getPlayerByName(newEntity.getName()).entity = newEntity;
      }
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
      this._entities[uuid].updateServerTick(this, startTick - this.lastTickTime);
    }

    this.lastTickTime = Date.now();
  }

  updateClientTick() {
    let controlsHandler = this.context.getControlsHandler();

    if (!this.context.getPlayer())
      return;

    if (this.clientNeedToUpdateControls()) {
      MovementUpdatePacket.clientSend(this.context.connectionHandler.getSocket(), 
        controlsHandler.bSitting, 
        controlsHandler.bAttacking, 
        [
          controlsHandler.horizontal,
          -controlsHandler.vertical,
        ],
        controlsHandler.calculateAimRotation()
      );
    }

    let startTick = Date.now();

    for (let uuid in this._entities) {
      this._entities[uuid].updateClientTick(this, startTick - this.lastTickTime);
    }
  }

  clientNeedToUpdateControls() {
    let player = this.context.getPlayer();
    let controlsHandler = this.context.getControlsHandler();

    if (controlsHandler.horizontal != player.getDirection()[0] || controlsHandler.vertical != -player.getDirection()[1]) {
      return true;
    }

    if (player.bCrawling() != controlsHandler.bSitting) {
      return true;
    }
    
    if (player.bAttacking() != controlsHandler.bAttacking) {
      return true;
    }

    if (player.getAimRotation() != controlsHandler.calculateAimRotation()) {
      return true;
    }

    return false;
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