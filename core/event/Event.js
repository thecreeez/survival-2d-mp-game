const SharedData = require("../SharedData");

class Event {
  constructor(id, args) {
    this._id = id;
    this._args = args;
  }

  serialize() {
    return `ev${SharedData.SEPARATOR}${this._args.join(SharedData.SEPARATOR)}${SharedData.SEPARATOR}`;
  }
}

module.exports = Event;