import PropRegistry from "../../registry/PropRegistry.js";
import SharedData from "../../SharedData.js";
import Entity from "./Entity.js";

class PropEntity extends Entity {
  static id = `prop_entity`;

  // Имеется своя система подгрузки текстур и не требуется использовать встроенную
  static customTextureBehavior = true;

  state = new SharedData("state", SharedData.STR_T, "default");
  prop_id = new SharedData("prop_id", SharedData.STR_T, "default");

  constructor({ position = [0,0], worldId = "core:spawn", propId = "lamp", state = "default" } = {}) {
    super({ position, worldId })

    let propCandidate = PropRegistry.getById(this.getPackId(), propId);

    if (!propCandidate) {
      console.error(`Prop is not finded.`)
      return;
    }

    let stateValue = propCandidate.states[state];

    if (!stateValue) {
      console.error(`Prop state [${stateName}] is not exist`)
      return;
    }

    this.state.setValue(state);
    this.prop_id.setValue(propId);
  }

  getPropId() {
    return this.prop_id.getValue();
  }

  getState() {
    return this.state.getValue();
  }
}

export default PropEntity;