import Entity from "../world/entity/Entity.js";
import Chunk from "../world/Chunk.js";

class ChunkRegisterPacket {
  static type = "chunk_register_packet";

  /**
   * 
   * @param {Array} users 
   * @param {Entity} entity 
   */
  static serverSend(users, chunk) {
    users.forEach((user) => {
      user.write(`${this.type}/${chunk.serialize()}`);
    })
  }

  static clientHandle(client, data) {
    let chunk = Chunk.parse(data.split("/")[1]);
    
    client.getPlayer().getWorld().setChunk(chunk);
  }
}

export default ChunkRegisterPacket;