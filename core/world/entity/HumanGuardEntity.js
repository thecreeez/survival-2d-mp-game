import SharedData from "../../SharedData.js";
import HumanEntity from "./HumanEntity.js";

class HumanGuardEntity extends HumanEntity {
  static id = "human_guard_entity";

  order = new SharedData("order", SharedData.JSN_T, {});
}

export default HumanGuardEntity;