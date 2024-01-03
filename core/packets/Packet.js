class Packet {
  static type = "default";

  static clientSend(socket, data) {
    socket.send(`${this.type}/${data}`);
  }

  static serverHandle(conn, data) {
    console.log(data);
  }

  static serverSend(server, users, data) {
    users.forEach((user) => {
      user.write(`${this.type}/${data}`);
    })
  }

  static clientHandle(client, data) {
    console.log(data);
  }

  static getType() {
    return this.type;
  }
}

export default Packet;