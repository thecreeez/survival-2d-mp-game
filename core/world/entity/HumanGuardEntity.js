import SharedData from "../../SharedData.js";
import PatrolAI from "../ai/PatrolAI.js";
import HumanEntity from "./HumanEntity.js";

class HumanGuardEntity extends HumanEntity {
  static id = "human_guard_entity";

  order = new SharedData("order", SharedData.JSN_T, {});

  constructor({ position, health = 50, worldId, tags = [], type = "default", leader = null } = {}) {
    super({
      moveSpeed: 2,
      damage: 5,
      position,
      worldId,
      health,
      tags,
      type,
      viewRange: 250,
      leader,
      ai: new PatrolAI({ targetId: "spider_entity", targetTag: "hostile", events: {
        "entityMoveInToViewDistance": (entity) => {
          if (entity.getFullId() === "core:player_entity" && this.getLeaderName() == entity.getName()) {
            this.setMessage(`Hey, ${entity.getName()}!`, 3000)
          }
        },
        "entityMoveOutFromViewDistance": (entity) => {
          if (entity.getFullId() === "core:player_entity" && this.getLeaderName() == entity.getName()) {
            this.setMessage(`Bye, ${entity.getName()}!`, 3000)
          }
        },
        "handleAttackFromEntity": (entity) => {
          if (entity.getFullId() === "core:player_entity" && this.getLeaderName() == entity.getName()) {
            this.setMessage(`What the fuck, ${entity.getName()}?!`, 3000);
          }

          if (this.ai.isAlly(entity)) {
            this.ai.clearTarget();
          }
        }
      }}),
    })

    if (position)
      this.order.position = [...position];
  }
}

export default HumanGuardEntity;