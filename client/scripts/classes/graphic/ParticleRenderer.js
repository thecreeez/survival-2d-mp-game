import PackAssetsRegistry from "../registry/PackAssetsRegistry.js";

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

class ParticleRenderer {
  constructor(screen) {
    this.screen = screen;
  }

  render() {
    this.screen.client.getPlayer().getWorld().getParticles().forEach(particle => {
      let particleSheet = PackAssetsRegistry.getParticleSheet(particle.getPack(), particle.getId());

      if (particle.currentSprite < particleSheet.sheetSize[0]) {
        ctx.drawImage(particleSheet.get(particle.currentSprite, 0), particle.getPosition()[0] - particle.getSize()[0] / 2, particle.getPosition()[1] - particle.getSize()[1], particle.getSize()[0], particle.getSize()[1]);
      }
    })
  }

  update() {
    let world = this.screen.client.getPlayer().getWorld();
    this.screen.profiler.set("particles", world.getParticles().length);
    world.getParticles().forEach(particle => {
      let deltaTime = 1;
      let particleSheet = PackAssetsRegistry.getParticleSheet(particle.getPack(), particle.getId());

      if (particle.currentSprite < particleSheet.sheetSize[0]) {
        if (particle.attachedEntity) {
          particle.position.setValue(particle.attachedEntity.getPosition());
        }

        if (particle.lastRenderUpdate) {
          deltaTime = Date.now() - particle.lastRenderUpdate;
        }

        particle.currentSpriteTime += deltaTime;

        if (particle.currentSpriteTime > 50) {
          particle.currentSprite++;
          particle.currentSpriteTime = 0;
        }

        particle.lastRenderUpdate = Date.now();
        return;
      }

      // Particle already played
      world.removeParticle(particle);
    })
  }

  getParticlesLength() {
    return this.screen.client.getPlayer().getWorld().getParticles().length;
  }
}

export default ParticleRenderer;