class SharedData {
  // Строки
  static STR_T = ["STR_T"]

  // Числовые значения
  static NUM_T = ["NUM_T", (elem) => Number(elem)];

  // JSON формат
  static JSN_T = ["JSN_T", (elem) => JSON.parse(elem), (elem) => JSON.stringify(elem)];

  // true/false
  static BUL_T = ["BUL_T", (elem) => elem == "1" ? true : false, (elem) => elem ? 1 : 0];

  // Позиция (числовой массив)
  static POS_T = ["POS_T", (elem) => elem.split(":").map((pos) => Number(pos)), (elem) => elem.join(":")];

  static SEPARATOR = `|`

  constructor(id, type, value) {
    this._id = id;
    this._type = type;
    this._value = value;

    this.needToSerialize = true;
    this.bUpdated = false;
  }

  static parse(data) {
    let dataFragments = data.split(SharedData.SEPARATOR);

    let type = SharedData[dataFragments[0]];
    let id = dataFragments[1]
    let value = dataFragments[2];

    if (!type) {
      return false;
    }

    if (type.length > 1) {
      value = type[1](value);
    }

    return new SharedData(id, type, value);
  }

  serialize() {
    let value = this._value;

    if (this._type[2])
      value = this._type[2](this._value);

    return `${this._type[0]}${SharedData.SEPARATOR}${this._id}${SharedData.SEPARATOR}${value}`;
  }

  makeImportant() {
    this.bForcedSend = true;

    return this;
  }

  setValue(value) {
    this._value = value;
    this.bUpdated = true;
  }

  getValue() {
    return this._value;
  }

  getId() {
    return this._id;
  }

  toString() {
    return `${this.getId()}:${this.getValue()}`
  }
}

export default SharedData;