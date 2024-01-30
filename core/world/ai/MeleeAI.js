import AI from "./AI.js";

class MeleeAI extends AI {
  handleAttack(entity) {
    entity.handleDamage(this.entity, this.entity.damage.getValue());
  }

  canAttack(entity) {
    return this.entity.canAttack(entity);
  }
}

export default MeleeAI;