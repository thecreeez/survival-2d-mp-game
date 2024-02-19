class SyncApplicationPacket {
  static type = "sync_application_packet";

  static serverSend(server, users, { time, tps }) {
    users.forEach((user) => {
      user.write(`${this.type}/${time}/${tps}`);
    })
  }

  static clientHandle(client, data) {
    let args = data.split("/")

    let time = args[1];
    let tps = args[2];

    client.application.serverTime = Number(time);
    client.screen.profiler.set("server_tps", Number(tps));
  }
}

export default SyncApplicationPacket;