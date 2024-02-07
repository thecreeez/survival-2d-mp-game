import MathUtils from "../../utils/MathUtils.js";
import RangeAI from "./RangeAI.js";


class PatrolAI extends RangeAI {
  _wannaMove() {
    if (!this.entity.order) {
      return false;
    }

    if (!this.entity.order.position) {
      return false;
    }

    return MathUtils.distanceBetween(this.entity.order.position, this.entity.getPosition()) > this.entity.getMoveSpeed();
  }

  _updateDirection() {
    if (!this._wannaMove()) {
      this.entity.setDirection(0, 0);
      return;
    }

    let targetPosition = this.entity.order.position;
    let entityPosition = this.entity.getPosition();

    let moving = [0, 0]

    if (entityPosition[1] < targetPosition[1]) {
      moving[1] = this.entity.move_speed.getValue();
    };

    if (entityPosition[1] > targetPosition[1]) {
      moving[1] = -this.entity.move_speed.getValue();
    }

    if (entityPosition[0] < targetPosition[0]) {
      moving[0] = this.entity.move_speed.getValue();
    }

    if (entityPosition[0] > targetPosition[0]) {
      moving[0] = -this.entity.move_speed.getValue();
    }

    if (moving[0] != 0 && moving[1] != 0) {
      moving[0] /= 2;
      moving[1] /= 2;
    }

    if (moving[0] == this.entity.direction.getValue()[0] && moving[1] == this.entity.direction.getValue()[1]) {
      return;
    }

    this.entity.direction.setValue(moving);
  }
}

export default PatrolAI;