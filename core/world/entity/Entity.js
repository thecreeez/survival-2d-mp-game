import SharedData from "../../SharedData.js";
import EntityRegistry from "../../registry/EntityRegistry.js";
import MathUtils from "../../utils/MathUtils.js";

class Entity {
  static id = `undefined_entity`;
  static pack = `undefined_pack`;
  static size = [40,40];

  uuid = new SharedData("uuid", SharedData.STR_T, "uuid").makeImportant();
  world = new SharedData("world", SharedData.STR_T, "none");
  position = new SharedData("position", SharedData.POS_T, [0, 0]);
  texture = new SharedData("texture", SharedData.STR_T, "default");

  constructor({ position = [0,0], worldId = "core:spawn", customTexture = "default", tags = [] } = {}) {
    this.position.setValue(position);
    this.world.setValue(worldId);
    this.uuid.setValue("UUID-RANDOM-" + Math.floor(Math.random() * 10000));
    this.texture.setValue(customTexture);
    this.tags = tags;
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

  updateServerTick(application, deltaTime) {
    let pos = this.getPosition();
    let size = this.getSize();

    application.getEntities().forEach((otherEntity) => {
      if (otherEntity == this) {
        return;
      }

      let otherPos = otherEntity.getPosition();
      let otherSize = otherEntity.getSize();

      if (!size)
        console.log(otherEntity);

      if (pos[0] - size[0] / 2 < otherPos[0] + otherSize[0] / 2 &&
          pos[0] + size[0] / 2 > otherPos[0] - otherSize[0] / 2 &&
          pos[1] - size[1] / 2 < otherPos[1] + otherSize[1] / 2 &&
          pos[1] + size[1] / 2 > otherPos[1] - otherSize[1] / 2
      ) {
        this.onCollide(application, otherEntity);
      }
    })
  }

  updateClientTick(application, deltaTime) {
    
  }

  onCollide(application, entity) {
    
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

  canBeMovedTo(position) {
    let tile = this.getWorld().getTileByWorldPos(position);

    // Implement back collision
    if (tile && false) {
      return false;
    }

    return true;
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
      if (this[property] && this[property].needToSerialize && (this[property].bUpdated || this[property].bForcedSend)) {
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

  distanceTo(entity) {
    return MathUtils.distanceBetween(this.getPosition(), entity.getPosition())
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
    return [...this.position.getValue()];
  }

  getTexture() {
    return this.texture.getValue();
  }

  getPackId() {
    return this.constructor.pack;
  }

  isDead() {
    return false;
  }

  getTags() {
    return this.tags;
  }

  haveTag(tag) {
    return this.tags.indexOf(tag) !== -1;
  }

  getSize() {
    return this.constructor.size;
  }

  toObject() {
    let obj = {};

    for (let property in this) {
      if (this[property] && this[property].needToSerialize) {
        obj[`NETWORK_${property}`] = this[property].getValue();
      } else {
        obj[`CLIENT_${property}`] = this[property];
      }
    }
    
    return obj;
  }
}

export default Entity;