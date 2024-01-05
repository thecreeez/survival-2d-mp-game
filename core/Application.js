import EntityRegistry from "./EntityRegistry.js";
import PacketRegistry from "./PacketRegistry.js";
import ItemRegistry from "./ItemRegistry.js";

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

import SharedData from "./SharedData.js";
import Item from "./world/Item.js";
import Tile from "./world/Tile.js";



class Application {
  static version = 1;

  constructor(context) {
    this._entities = {};
    this._tiles = [];

    Application.instance = this;
    this.context = context;
    this.lastTickTime = Date.now();
    this.registerEntities();
    this.registerPackets();
    this.registerItems();

    if (!this.isClient()) {
      this.spawnEntity(new OrcEntity({ pos: [300, 300] }))
      this.spawnEntity(new EffectEntity({
        effectType: "fire",
        effectData: 0,
        lifeTime: 60000,
        pos: [100, 100]
      }))

      this.spawnEntity(new ItemEntity({ item: ItemRegistry["log"], count: 1, pos: [-50,-50] }))
      //this.spawnEntity(new EntityWithAI([800, 800], 100, { target_class: "entity_with_ai"}))

      this.setTile(new Tile({
        sheetPos: [13, 2],
        pos: [0, 0]
      }))

      this.setTile(new Tile({
        sheetPos: [14, 3],
        pos: [1, 2]
      }))
    }

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
      spritePos: [0,0]
    }));
  }

  registerPackets() {
    PacketRegistry.register(HandshakePacket);

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

  getTile(pos) {
    if (!this._tiles[pos[1]])
      return false;

    if (!this._tiles[pos[1]][pos[0]]) {
      return false;
    }

    return this._tiles[pos[1]][pos[0]];
  }

  setTile(tile) {
    if (!this._tiles[tile.getPosition()[1]]) {
      this._tiles[tile.getPosition()[1]] = []
    }

    this._tiles[tile.getPosition()[1]][tile.getPosition()[0]] = tile;
  }

  getTiles() {
    return this._tiles;
  }

  toJSON() {
    if (this.isClient())
      return false;

    let entities = [];

    this.getEntities().forEach(entity => {
      entities.push(entity.serialize());
    })

    let tilePresets = this.generateTilePresets();
    let tileMap = this.generateTileMap(tilePresets)

    return {
      "welcomeMessage": this.context.getWelcomeMessage(),
      "entities": entities,
      "tile-presets": tilePresets,
      "tile-map": tileMap
    }
  }

  generateTilePresets() {
    let tilePresets = ["EMPTY"];

    this.getTiles().forEach((tileLine, y) => {
      tileLine.forEach((tile, x) => {
        let tilePreset = null;

        tilePresets.forEach((tilePresetCandidate, i) => {
          if (tilePresetCandidate[0] == tile.pack.getValue() && tilePresetCandidate[1] == tile.sheetPos.getValue()[0] && tilePresetCandidate[2] == tile.sheetPos.getValue()[1]) {
            tilePreset = i;
          }
        })

        if (tilePreset)
          return;

        tilePresets.push([tile.pack.getValue(), ...tile.sheetPos.getValue()])
      })
    })

    return tilePresets;
  }

  generateTileMap(tilePresets) {
    let tileMap = {};

    this.getTiles().forEach((tileLine, y) => {
      tileLine.forEach((tile, x) => {
        let tilePreset = null;

        tilePresets.forEach((tilePresetCandidate, i) => {
          if (tilePresetCandidate[0] == tile.pack.getValue() && tilePresetCandidate[1] == tile.sheetPos.getValue()[0] && tilePresetCandidate[2] == tile.sheetPos.getValue()[1]) {
            tilePreset = i;
          }
        })

        if (tilePreset == null)
          return;

        tileMap[`${x}:${y}`] = tilePreset;
      })
    })

    return tileMap;
  }

  fromJSON(json) {

  }
}

export default Application;