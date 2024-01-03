class WelcomePacket {
  static type = "welcome";

  static serverSend(users, { message }) {
    users.forEach((user) => {
      user.write(`${this.type}/${message}`);
    })
  }

  static clientHandle(client, data) {
    client.addLog(`INFO`, `Welcome message: ${data.split("/")[1]}`)
  }
}

export default WelcomePacket;