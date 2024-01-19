import Particle from "../world/Particle.js";

class ParticleSpawnPacket {
  static type = "particle_spawn_packet";

  static serverSend(server, users, { particle }) {
    users.forEach((user) => {
      user.write(`${this.type}/${particle.serialize()}`);
    })
  }

  static clientHandle(client, data) {
    let args = data.split("/")
    let particle = Particle.parse(args[1]);

    client.application.getWorld(particle.getWorldId()).spawnParticle(particle);
  }
}

export default ParticleSpawnPacket;