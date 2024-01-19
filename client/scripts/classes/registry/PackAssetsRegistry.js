import Registry from "/core/utils/Registry.js";
import SpriteSheet from "../graphic/SpriteSheet.js";

const DEFAULT_PATH_TO_ASSETS = `/client/assets`;

class PackAssetsRegistry extends Registry {
  static packs = {};

  static DEFAULT_ENTITY_SPRITE_SIZE = [16,16];
  static DEFAULT_TILE_SPRITE_SIZE = [16, 16];
  static DEFAULT_PARTICLE_SPRITE_SIZE = [8, 8];

  static register(packId, packData) {
    this.packs[packId] = {
      textures: {
        entities: {},
        particles: {},
        tileset: false,
      }
    };

    this._registerEntities(packId, packData);
    this._registerTileset(packId, packData);
    this._registerParticles(packId, packData)
  }

  static _registerEntities(packId, packData) {
    let entities = this.packs[packId].textures.entities;

    packData.entitiesClasses.forEach((entityClass) => {
      let path = `${DEFAULT_PATH_TO_ASSETS}/${packId}/entities/${entityClass.id}/default.png`;

      entities[entityClass.id] = {
        default: new SpriteSheet({ path, spriteSize: this.DEFAULT_ENTITY_SPRITE_SIZE, makeAlsoReversed: true })
      };

      if (packData.entitiesTextures[entityClass.id]) {
        packData.entitiesTextures[entityClass.id].forEach(entityTexture => {
          let path = `${DEFAULT_PATH_TO_ASSETS}/${packId}/entities/${entityClass.id}/${entityTexture}.png`;
          entities[entityClass.id][entityTexture] = new SpriteSheet({ path, spriteSize: this.DEFAULT_ENTITY_SPRITE_SIZE, makeAlsoReversed: true });
        })
      }
    });
  }

  static _registerTileset(packId, packData) {
    let path = `${DEFAULT_PATH_TO_ASSETS}/${packId}/tileset.png`;
    this.packs[packId].textures.tileset = new SpriteSheet({ path, spriteSize: this.DEFAULT_TILE_SPRITE_SIZE });
  }

  static _registerParticles(packId, packData) {
    let pathToParticles = `${DEFAULT_PATH_TO_ASSETS}/${packId}/particles`;

    packData.particlesTextures.forEach((particleTexture) => {
      let path = pathToParticles+`/${particleTexture}.png`;
      this.packs[packId].textures.particles[particleTexture] = new SpriteSheet({ path, spriteSize: "height" });
    })
  }

  static getPacksId() {
    let packs = [];

    for (let packId in this.packs) {
      packs.push(packId);
    }

    return packs
  }

  static getTile(pack, pos) {
    if (!PackAssetsRegistry.packs[pack]) {
      console.error(`Pack isn't exist...`);
      return false;
    }

    return PackAssetsRegistry.packs[pack].textures.tileset.get(pos[0], pos[1]);
  }

  static getParticleSheet(pack, id) {
    if (!PackAssetsRegistry.packs[pack]) {
      console.error(`Pack isn't exist...`);
      return false;
    }

    return PackAssetsRegistry.packs[pack].textures.particles[id];
  }
}

export default PackAssetsRegistry;