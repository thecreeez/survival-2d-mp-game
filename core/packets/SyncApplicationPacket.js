class SyncApplicationPacket {
  static type = "sync_application_packet";

  static serverSend(server, users, { time }) {
    users.forEach((user) => {
      user.write(`${this.type}/${time}`);
    })

    console.log(`sending time: ${time}`)
  }

  static clientHandle(client, data) {
    let args = data.split("/")

    let time = args[1];

    client.application.serverTime = Number(time);
  }
}

export default SyncApplicationPacket;