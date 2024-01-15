import SharedData from "../../SharedData.js";
import EntityRegistry from "../../EntityRegistry.js";

class Entity {
  uuid = new SharedData("uuid", SharedData.STR_T, "uuid").makeImportant()
  position = new SharedData("position", SharedData.POS_T, [0, 0])
  type = new SharedData("type", SharedData.STR_T, "default")

  constructor({type = "default", position = [0,0]} = {}) {
    this.type.setValue(type);
    this.position.setValue(position);
    this.uuid.setValue("UUID-RANDOM-" + Math.floor(Math.random() * 10000));
  }

  static parse(data) {
    let dataFragments = data.split(";");

    let parsedEntityClass = this.getEntityClass(dataFragments);

    if (!parsedEntityClass) {
      console.error(`Unknown entity class...`, data);
      return false;
    }

    return new parsedEntityClass().load(dataFragments);
  }

  static getEntityClass(serializedDatas) {
    let entityClass = null;

    serializedDatas.forEach((serializedData) => {
      let data = SharedData.parse(serializedData);

      if (data && data.getId() == "type" && EntityRegistry[data.getValue()]) {
        entityClass = EntityRegistry[data.getValue()];
      }
    })

    return entityClass;
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

    for (let property in this) {
      if (this[property].needToSerialize) {
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
      if (this[property].bUpdated) {
        sharedDataUpdated++;
      }
    }

    return sharedDataUpdated > 0;
  }

  getAllDatas() {
    let datas = []
    for (let property in this) {
      if (this[property].needToSerialize) {
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

  getType() {
    return this.type.getValue();
  }

  getUuid() {
    return this.uuid.getValue();
  }

  getPosition() {
    return this.position.getValue();
  }
}

export default Entity;