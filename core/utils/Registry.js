class Registry {
  static getById(pack, id = false) {
    if (!id) {
      return this[`${pack}`];
    }

    return this[`${pack}:${id}`];
  }

  static register(pack, id, registryClass) {
    this[`${pack}:${id}`] = registryClass;
  }
}

export default Registry;