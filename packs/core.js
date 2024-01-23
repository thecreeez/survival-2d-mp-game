import PlasmaProjectileEntity from "../core/world/entity/PlasmaProjectileEntity.js";
import PlayerEntity from "../core/world/entity/PlayerEntity.js";
import SpiderEntity from "../core/world/entity/SpiderEntity.js";
import ItemEntity from "../core/world/entity/ItemEntity.js";

import EntityRegisterPacket from "../core/packets/EntityRegisterPacket.js";
import EntityRemovePacket from "../core/packets/EntityRemovePacket.js";
import ClientErrorPacket from "../core/packets/ClientErrorPacket.js";
import HandshakePacket from "../core/packets/HandshakePacket.js";
import WelcomePacket from "../core/packets/WelcomePacket.js";
import EntityUpdatePacket from "../core/packets/EntityUpdatePacket.js";
import MovementUpdatePacket from "../core/packets/MovementUpdatePacket.js";
import CommandInputPacket from "../core/packets/CommandInputPacket.js";
import TilesRegisterPacket from "../core/packets/TilesRegisterPacket.js";
import TilePlacePacket from "../core/packets/TilePlacePacket.js";
import SaveRequestPacket from "../core/packets/SaveRequestPacket.js";
import ParticleSpawnPacket from "../core/packets/ParticleSpawnPacket.js";

export default {
  pack: "core",
  entities: [
    ItemEntity,
    PlayerEntity,
    SpiderEntity,
    PlasmaProjectileEntity
  ],
  entitiesTextures: {
    [PlayerEntity.id]: ["anti-tank", "grenadier", "leader", "machine-gunner", "radio-operator", "sniper"]
  },
  packets: [
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
    CommandInputPacket,
    ParticleSpawnPacket,
  ],
  ui: [{
    name: "health-bars",
    spriteSize: [48, 6]
  }],
  props: [{
    id: "lamp",
    states: {
      default: {
        spritePos: [0, 0],
        spriteSize: [2, 3],
        worldSize: [80, 120],
        tags: ["light-source"]
      },
      broken: {
        spritePos: [2, 2],
        spriteSize: [2, 1],
        worldSize: [80, 40]
      }
    }
  }],
  particles: [
    "big-explosion", 
    "big-fragments", 
    "bullet-impacts", 
    "hit-sparks", 
    "hit-spatters", 
    "laser-flash", 
    "muzzle-flashes", 
    "small-explosion", 
    "small-fragments", 
    "smoke"
  ]
}