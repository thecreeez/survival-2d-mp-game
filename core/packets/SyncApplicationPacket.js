class SyncApplicationPacket {
  static type = "sync_application_packet";

  static serverSend(server, users, { time, tps, paused }) {
    users.forEach((user) => {
      user.write(`${this.type}/${time}/${tps}/${paused}`);
    })
  }

  static clientHandle(client, data) {
    let args = data.split("/")

    let time = args[1];
    let tps = args[2];
    let paused = args[3] == "true";

    client.application.serverTime = Number(time);

    client.application.paused = paused;
    client.screen.profiler.set("server_tps", Number(tps));
  }
}

export default SyncApplicationPacket;