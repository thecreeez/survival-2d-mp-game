import SharedData from "../SharedData.js";

class Particle {
  uuid = new SharedData("uuid", SharedData.STR_T, "uuid").makeImportant();
  world_id = new SharedData("world_id", SharedData.STR_T, "none");
  position = new SharedData("position", SharedData.POS_T, [0, 0]);

  pack = new SharedData("pack", SharedData.STR_T, "core");
  texture = new SharedData("texture", SharedData.STR_T, "smoke");

  life_time = new SharedData("life_time", SharedData.NUM_T, 1000);
  direction = new SharedData("direction", SharedData.POS_T, [0, 0]);
  randomOffset = new SharedData("randomOffset", SharedData.POS_T, [0, 0]);

  currentLifeTime = 0;

  currentSpriteTime = 0;
  currentSprite = 0;

  constructor({ pack = "core", worldId = "core:spawn", position = [0,0], lifeTime = 1000, particleType = "smoke", direction = [0,0], randomOffset = [0,0] } = {}) {
    this.uuid.setValue("UUID-RANDOM-" + Math.floor(Math.random() * 10000));
    this.world_id.setValue(worldId);
    this.position.setValue(position);

    this.pack.setValue(pack);
    this.texture.setValue(particleType);

    this.life_time.setValue(lifeTime);
    this.direction.setValue(direction);
    this.randomOffset.setValue(randomOffset);

    this.currentLifeTime = lifeTime;
  }

  static parse(data) {
    let dataFragments = data.split(";");

    return new this().load(dataFragments);
  }

  load(datas) {
    datas.forEach((serializedData) => {
      let data = SharedData.parse(serializedData);

      if (data)
        this[data.getId()].setValue(data.getValue())
    })

    return this;
  }

  serialize() {
    let particleData = [];

    for (let property in this) {
      if (this[property] && this[property].needToSerialize) {
        particleData.push(this[property].serialize());
      }
    }

    return particleData.join(";");
  }

  getWorld() {
    return this.world;
  }

  getWorldId() {
    return this.world_id.getValue();
  }

  getPack() {
    return this.pack.getValue();
  }

  getId() {
    return this.texture.getValue();
  }

  getPosition() {
    return this.position.getValue();
  }
}

export default Particle;