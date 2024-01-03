import SharedData from "../../../core/SharedData";

class MixinPlayerEntity {
  inventory = new SharedData("inventory", SharedData.JSN_T, {})
}