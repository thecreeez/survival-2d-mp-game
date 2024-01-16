class Registry {
  static getById(pack, id) {
    return this[`${pack}:${id}`];
  }

  static register(pack, id, registryClass) {
    this[`${pack}:${id}`] = registryClass;
  }
}

export default Registry;