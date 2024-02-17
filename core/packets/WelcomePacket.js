class WelcomePacket {
  static type = "welcome";

  static serverSend(users, { message }) {
    users.forEach((user) => {
      user.write(`${this.type}/${message}`);
    })
  }

  static clientHandle(client, data) {
    client.screen.subtitleRenderer.addSubtitle(`Server`, data.split("/")[1], 5000);
  }
}

export default WelcomePacket;