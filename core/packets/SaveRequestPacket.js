class SaveRequestPacket {
  static type = "save_request_packet";

  static clientSend(socket, { username, coreVersion }) {
    socket.send(`${this.type}`);
  }

  /**
   * 
   * @param {Server} server 
   * @param {*} conn 
   * @param {String} data 
   */
  static serverHandle(server, conn, data) {
    if (!server.getPlayerByConnection(conn)) {
      return false;
    }

    server.save("save_001.json");
  }
}

export default SaveRequestPacket;