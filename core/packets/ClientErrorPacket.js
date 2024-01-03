class ClientErrorPacket {
  static type = "error";

  static ErrorType = {
    userWithThatNameAlreadyPlaying: "user_already_playing"
  }

  static serverSend(users, { errorType, message }) {
    users.forEach((user) => {
      user.write(`${this.type}/${errorType}/${message}`);
    })
  }

  static clientHandle(client, data) {
    let args = data.split("/");
    client.addLog(`ERROR`, `${args[2]}`);

    switch(args[1]) {
      case ClientErrorPacket.ErrorType.userWithThatNameAlreadyPlaying: client.setUsername(prompt(args[2], "Player")); client.connectionHandler.handshake(); break;
    }
  }
}

export default ClientErrorPacket;