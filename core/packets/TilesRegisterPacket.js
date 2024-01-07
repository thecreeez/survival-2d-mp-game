import Entity from "../world/entity/Entity.js";
import Tile from "../world/Tile.js";

class TilesRegisterPacket {
  static type = "tile_register_packet";

  /**
   * 
   * @param {Array} users 
   * @param {Entity} entity 
   */
  static serverSend(users, tiles) {
    users.forEach((user) => {
      user.write(`${this.type}/${tiles.join("/")}`);
    })
  }

  static clientHandle(client, data) {
    data.split("/").forEach((tileLine, i) => {
      if (i == 0) {
        return;
      }

      let tile = new Tile().load(tileLine.split(";"));

      client.application.setTile(tile);
    });
  }
}

export default TilesRegisterPacket;