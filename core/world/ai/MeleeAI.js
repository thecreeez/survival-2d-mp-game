import AI from "./AI.js";

class MeleeAI extends AI {
  constructor({targetId, targetTag}) {
    super({targetId, targetTag})
  }

  updateServerTick() {
    super.updateServerTick();
    this._updateAttack();
  }

  _updateAttack() {
    if (this.currentTarget === null) {
      return;
    }

    if (!this.entity.canAttack(this.currentTarget)) {
      return;
    }

    this.entity.rotation.setValue(this.currentTarget.getPosition()[0] > this.entity.getPosition()[0] ? 0 : 1);
    this.currentTarget.handleDamage(this.entity, this.entity.damage.getValue());
  }
}

export default MeleeAI;