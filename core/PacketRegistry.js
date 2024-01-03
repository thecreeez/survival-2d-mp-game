class PacketRegistry {
  static register(packetsClass) {
    this[packetsClass.type] = packetsClass;
  }
}

export default PacketRegistry;