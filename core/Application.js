import EntityRegistry from "./registry/EntityRegistry.js";
import PacketRegistry from "./registry/PacketRegistry.js";
import ItemRegistry from "./registry/ItemRegistry.js";

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

    this._packs = {};
    this.state = 0;

    this.setWorld(new World({ id: "spawn" }))

    this.context = context;
    this.lastTickTime = Date.now();
    
    this.registerPack({
      pack: `core`,
      entitiesClasses: [
        ItemEntity,
        PlayerEntity,
        OrcEntity,
        EffectEntity
      ],
      packetsClasses: [
        HandshakePacket,
        SaveRequestPacket,
        WelcomePacket,
        ClientErrorPacket,
        EntityRegisterPacket,
        EntityUpdatePacket,
        EntityRemovePacket,
        TilesRegisterPacket,
        TilePlacePacket,
        MovementUpdatePacket,
        CommandInputPacket
      ],
      items: [
        new Item({
          id: "log",
          maxStack: 16,
          spritePos: [0, 0]
        })
      ],
      tilesetData: {
        "1:3": 1,
        "1:7": 1,
        "1:7": 1,
        "1:8": 1,
        "1:9": 1,
        "1:10": 1,
        "6:2": 2,
        "7:2": 2,
        "8:2": 2,
        "13:5": 2,
        "14:5": 2,
        "15:5": 2
      }
    })

    this.registerPack({
      pack: `forest`
    });

    this.loadPacks(); // Передвинуть это в сервере/клиенте, чтоб можно было просунуть логику подгрузки

    if (!this.isClient()) {
      this.spawnEntity(new OrcEntity({ position: [300, 300]}));
    }

    Application.instance = this;
    console.log(`Load app. Context: ${this.context.type}`);
  }

  registerPack({ pack, entitiesClasses = [], packetsClasses = [], items = [], tilesetData = {} }) {
    if (this.state != 0) {
      console.error(`Packs cannot be registered on this state.`)
      return;
    }

    this._packs[pack] = {
      entitiesClasses,
      packetsClasses,
      items,
      tilesetData
    };
  }

  loadPacks() {
    this.state = 1;

    console.log(`Loading packs...`)
    for (let packId in this._packs) {
      console.log(`Pack ${packId} loading...`)
      this._packs[packId].entitiesClasses.forEach((entityClass) => {
        console.log(`Entity ${entityClass.id} registering...`)
        EntityRegistry.register(packId, entityClass.id, entityClass);
        entityClass.pack = `${packId}`;

        entityClass.onRegister(this);
      })

      this._packs[packId].packetsClasses.forEach((packetClass) => {
        console.log(`Packet ${packetClass.type} registering...`);
        PacketRegistry.register(packId, packetClass.type, packetClass);
        packetClass.type = `${packId}:${packetClass.type}`;
      })

      this._packs[packId].items.forEach((item) => {
        console.log(`Item ${item.id} registering...`);
        ItemRegistry.register(packId, item.id, item);
        item.id = `${packId}:${item.id}`;
      })

      if (this.isClient()) {
        console.log(`Registering assets...`);
        this.context.registerAssetPack(packId, this._packs[packId]);
      }

      console.log(`Pack ${packId} loaded.`)
    }

    console.log(this._packs);
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
    if (!this.isClient()) {
      EntityRemovePacket.serverSend(this.context.getPlayersConnections(), uuid);

      if (this._entities[uuid].getFullId() === "core:player_entity" && this.context.getPlayerByName(this._entities[uuid].getName())) {
        let newEntity = this.spawnEntity(new PlayerEntity({ name: this._entities[uuid].getName() }));

        this.context.getPlayerByName(newEntity.getName()).entity = newEntity;
        EntityRegisterPacket.serverSend(this.context.getPlayersConnections(), { context: EntityRegisterPacket.Contexts.world, serializedEntity: newEntity.serialize() });
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