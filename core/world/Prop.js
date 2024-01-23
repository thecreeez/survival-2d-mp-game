import SharedData from "../SharedData.js";

class Prop {
  position = new SharedData("position", SharedData.POS_T, [0,0]);
  size = new SharedData("size", SharedData.POS_T, [40, 40]);
  uuid = new SharedData("uuid", SharedData.STR_T, "DEFAULT_UUID");
  pack = new SharedData("pack", SharedData.STR_T, "core");
  id = new SharedData("id", SharedData.STR_T, "core");
}

export default Prop;