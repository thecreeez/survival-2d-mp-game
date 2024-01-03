class EntityUpdatePacket {
  static type = "entity_update_packet";

  static serverSend(users, { data }) {
    users.forEach((user) => {
      user.write(`${this.type}/${data}`);
    })
  }

  static clientHandle(client, data) {
    let args = data.split("/");
    let updatedEntityData = args[1];

    client.application.updateEntity(updatedEntityData);
  }
}

export default EntityUpdatePacket;