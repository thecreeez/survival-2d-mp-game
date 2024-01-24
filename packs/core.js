import PlasmaProjectileEntity from "../core/world/entity/PlasmaProjectileEntity.js";
import PlayerEntity from "../core/world/entity/PlayerEntity.js";
import SpiderEntity from "../core/world/entity/SpiderEntity.js";
import PropEntity from "../core/world/entity/PropEntity.js";
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

import props from "./core_props.js";

export default {
  pack: "core",
  entities: [
    ItemEntity,
    PlayerEntity,
    SpiderEntity,
    PropEntity,
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
  ui: [
    {
      name: "health-bars",
      spriteSize: [48, 6]
    }, 
    {
      name: "numbers",
      spriteSize: [8, 8]
    }
  ],
  props,
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