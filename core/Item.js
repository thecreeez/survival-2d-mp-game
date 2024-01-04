class Item {
  constructor({ id = "air", maxStack = 1, onUse = (application, entity) => { }, onHold = (application, entity) => { }, onTake = (application, entity) => { }, onDrop = (application, entity) => { } } = {}) {
    this.id = id;
    this.maxStack = maxStack;
    this.onUse = onUse;
    this.onHold = onHold;
    this.onTake = onTake;
    this.onDrop = onDrop;
  }

  getId() {
    return this.id;
  }
}

export default Item;