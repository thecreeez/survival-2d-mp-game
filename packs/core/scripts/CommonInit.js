import PlasmaProjectileEntity from "../../../core/world/entity/PlasmaProjectileEntity.js";
import PlayerEntity from "../../../core/world/entity/PlayerEntity.js";
import SpiderEntity from "../../../core/world/entity/SpiderEntity.js";
import PropEntity from "../../../core/world/entity/PropEntity.js";
import HumanGuardEntity from "../../../core/world/entity/HumanGuardEntity.js";
import ItemEntity from "../../../core/world/entity/ItemEntity.js";

import EntityRegisterPacket from "../../../core/packets/EntityRegisterPacket.js";
import EntityRemovePacket from "../../../core/packets/EntityRemovePacket.js";
import ClientErrorPacket from "../../../core/packets/ClientErrorPacket.js";
import HandshakePacket from "../../../core/packets/HandshakePacket.js";
import WelcomePacket from "../../../core/packets/WelcomePacket.js";
import EntityUpdatePacket from "../../../core/packets/EntityUpdatePacket.js";
import MovementUpdatePacket from "../../../core/packets/MovementUpdatePacket.js";
import CommandInputPacket from "../../../core/packets/CommandInputPacket.js";
import TilePlacePacket from "../../../core/packets/TilePlacePacket.js";
import SaveRequestPacket from "../../../core/packets/SaveRequestPacket.js";
import ParticleSpawnPacket from "../../../core/packets/ParticleSpawnPacket.js";
import ShopInteractPacket from "../../../core/packets/ShopInteractPacket.js";
import ChunkRegisterPacket from "../../../core/packets/ChunkRegisterPacket.js";
import SyncApplicationPacket from "../../../core/packets/SyncApplicationPacket.js";
import EventInvokePacket from "../../../core/packets/EventInvokePacket.js";

import props from "./props.js";

export default {
  pack: "core",
  entities: [
    ItemEntity,
    PlayerEntity,
    SpiderEntity,
    PropEntity,
    PlasmaProjectileEntity,
    HumanGuardEntity
  ],
  entitiesTextures: {
    [PlayerEntity.id]: ["anti-tank", "grenadier", "leader", "machine-gunner", "radio-operator", "sniper"],
    [HumanGuardEntity.id]: ["anti-tank", "grenadier", "machine-gunner", "radio-operator", "sniper"]
  },
  packets: [
    HandshakePacket,
    SaveRequestPacket,
    WelcomePacket,
    ClientErrorPacket,
    EntityRegisterPacket,
    EntityUpdatePacket,
    EntityRemovePacket,
    ChunkRegisterPacket,
    TilePlacePacket,
    MovementUpdatePacket,
    CommandInputPacket,
    ParticleSpawnPacket,
    ShopInteractPacket,
    SyncApplicationPacket,
    EventInvokePacket
  ],
  ui: [
    {
      name: "health-bars",
      spriteSize: [48, 6]
    },
    {
      name: "numbers",
      spriteSize: [8, 8]
    },
    {
      name: "selection-cursor",
      spriteSize: [8, 8],
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