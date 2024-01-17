import SharedData from "../../SharedData.js";
import EntityRegistry from "../../registry/EntityRegistry.js";

class Entity {
  static id = `undefined_entity`;
  static pack = `undefined_pack`;

  uuid = new SharedData("uuid", SharedData.STR_T, "uuid").makeImportant();
  world = new SharedData("world", SharedData.STR_T, "none");
  position = new SharedData("position", SharedData.POS_T, [0, 0]);

  constructor({ position = [0,0], world = "core:spawn" } = {}) {
    this.position.setValue(position);
    this.world.setValue(world);
    this.uuid.setValue("UUID-RANDOM-" + Math.floor(Math.random() * 10000));
  }

  static parse(data) {
    let dataFragments = data.split(";");

    let parsedEntityClass = EntityRegistry[dataFragments[0]];

    if (!parsedEntityClass) {
      console.error(`Unknown entity class...`, data);
      return false;
    }

    return new parsedEntityClass().load(dataFragments);
  }

  static onRegister(application) {

  }

  static empty() {
    return new this();
  }

  logData() {
    console.log(`-----${this.type.getValue()}-${this.uuid.getValue() }-----`)
    this.getAllDatas().forEach((data) => {
      console.log(`>${data.getId()}:`, data.getValue());
    })
    console.log(`-----${this.type.getValue() }-${this.uuid.getValue() }-----`)
  }

  startUpdateServerTick() {
    this.getAllDatas().forEach((data) => {
      data.bUpdated = false;
    })
  }

  updateServerTick() {
    
  }

  teleport({ world = this.getWorld(), position = this.getPosition() }) {
    if (world != this.getWorld()) {
      this.setWorld(world);
    }

    if (position != this.getPosition()) {
      this.position.setValue(position);
    }
  }

  getWorld() {
    return this.application.getWorld(this.world.getValue());
  }

  setWorld(world) {
    this.world.setValue(world.getId());
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
    let entityData = [];

    entityData.push(`${this.getFullId()}`);

    for (let property in this) {
      if (this[property] && this[property].needToSerialize) {
        entityData.push(this[property].serialize());
      }
    }

    return entityData.join(";");
  }

  serializeLazy() {
    let entityData = [];

    for (let property in this) {
      if (this[property].needToSerialize && (this[property].bUpdated || this[property].bForcedSend)) {
        entityData.push(this[property].serialize());
      }
    }

    return entityData.join(";");
  }

  needToUpdate() {
    let sharedDataUpdated = 0;

    for (let property in this) {
      if (this[property] && this[property].bUpdated) {
        sharedDataUpdated++;
      }
    }

    return sharedDataUpdated > 0;
  }

  getAllDatas() {
    let datas = []
    for (let property in this) {
      if (this[property] && this[property].needToSerialize) {
        datas.push(this[property])
      }
    }
    return datas;
  }

  /**
   * 
   * @param {Entity} entity 
   */
  distanceTo(entity) {
    let vector = [...this.position.getValue()];

    entity.position.getValue().forEach((value, i) => {
      vector[i] = vector[i] - value;
    })

    let sum = 0;

    vector.forEach((value) => {
      sum += value * value;
    })

    return Math.sqrt(sum)
  }

  getFullId() {
    return `${this.constructor.pack}:${this.getId()}`;
  }

  getId() {
    return this.constructor.id;
  }

  getUuid() {
    return this.uuid.getValue();
  }

  getPosition() {
    return this.position.getValue();
  }

  getPackId() {
    return this.constructor.pack;
  }
}

export default Entity;