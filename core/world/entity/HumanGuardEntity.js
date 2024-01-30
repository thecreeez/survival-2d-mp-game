import SharedData from "../../SharedData.js";
import PatrolAI from "../ai/PatrolAI.js";
import HumanEntity from "./HumanEntity.js";

class HumanGuardEntity extends HumanEntity {
  static id = "human_guard_entity";

  order = new SharedData("order", SharedData.JSN_T, {});

  constructor({ position, health = 50, worldId, tags = [], type = "default" } = {}) {
    super({
      moveSpeed: 2,
      damage: 5,
      position,
      worldId,
      health,
      tags,
      type,
      ai: new PatrolAI({ targetId: "spider_entity", targetTag: "hostile", events: {
        "entityMoveInToViewDistance": (entity) => {
          if (entity.getFullId() === "core:player_entity") {
            this.setMessage(`Hey, ${entity.getName()}!`, 3000)
          }
        },
        "entityMoveOutFromViewDistance": (entity) => {
          if (entity.getFullId() === "core:player_entity") {
            this.setMessage(`Bye, ${entity.getName()}!`, 3000)
          }
        },
        "handleAttackFromEntity": (entity) => {
          if (entity.getFullId() === "core:player_entity") {
            this.setMessage(`What the fuck, ${entity.getName()}?!`, 3000)
          }
        }
      } }),
      viewRange: 250,
    })
  }
}

export default HumanGuardEntity;