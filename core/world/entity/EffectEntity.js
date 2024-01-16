import Entity from "./Entity.js";
import SharedData from "../../SharedData.js";
import EntityRemovePacket from "../../packets/EntityRemovePacket.js";

class EffectEntity extends Entity {
  static id = `effect_entity`;

  effect_type = new SharedData("effect_type", SharedData.STR_T, "cloud");
  effect_data = new SharedData("effect_data", SharedData.NUM_T, 0)

  // SERVER
  lifeTime = 1000;

  // CLIENT
  currentSpriteTime = 0;
  currentSprite = 0;

  constructor({ effectType = "cloud", effectData = 0, position = [0, 0], lifeTime = 1000} = {}) {
    super({ id: "effect_entity", position });
    this.effect_type.setValue(effectType);
    this.effect_data.setValue(effectData);
    
    this.lifeTime = lifeTime;
  }

  updateServerTick(application, deltaTick) {
    super.updateServerTick(application, deltaTick);

    this.lifeTime -= deltaTick;

    if (this.lifeTime <= 0) {
      application.removeEntity(this.getUuid());
      EntityRemovePacket.serverSend(application.context.getPlayersConnections(), this);      
    }
  }
}

export default EffectEntity;