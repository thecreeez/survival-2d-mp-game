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
        props: {},
        ui: {},
        tileset: false,
        propSet: false
      }
    };

    this._registerProps(packId, packData);
    this._registerEntities(packId, packData);
    this._registerTileset(packId, packData);
    this._registerParticles(packId, packData);
    this._registerUI(packId, packData);
  }

  static _registerProps(packId, packData) {
    let props = this.packs[packId].textures.props;

    let path = `${DEFAULT_PATH_TO_ASSETS}/${packId}/props.png`;
    let spriteSheet = new SpriteSheet({ path, spriteSize: this.DEFAULT_TILE_SPRITE_SIZE });

    packData.props.forEach((prop) => {
      props[prop.id] = prop;
      
      for (let stateId in props[prop.id].states) {
        spriteSheet.onload((spriteSheet) => {
          let state = props[prop.id].states[stateId];

          if (!state.worldSize) {
            state.worldSize = prop.defaultWorldSize ? [...prop.defaultWorldSize] : [40,40];
          }

          let canvas = document.createElement("canvas");
          let ctx = canvas.getContext("2d");

          canvas.width = state.spriteSize[0] * this.DEFAULT_TILE_SPRITE_SIZE[0];
          canvas.height = state.spriteSize[1] * this.DEFAULT_TILE_SPRITE_SIZE[1];

          for (let w = 0; w < state.spriteSize[0]; w++) {
            for (let h = 0; h < state.spriteSize[1]; h++) {
              ctx.drawImage(spriteSheet.get(w + state.spritePos[0], h + state.spritePos[1]), w * this.DEFAULT_TILE_SPRITE_SIZE[0], h * this.DEFAULT_TILE_SPRITE_SIZE[1]);
            }
          }

          state.canvas = canvas;
        })
      }
    })
  }

  static _registerEntities(packId, packData) {
    let entities = this.packs[packId].textures.entities;

    packData.entities.forEach((entityClass) => {
      if (entityClass.customTextureBehavior) {
        return;
      }

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

    packData.particles.forEach((particleTexture) => {
      let path = pathToParticles+`/${particleTexture}.png`;
      this.packs[packId].textures.particles[particleTexture] = new SpriteSheet({ path, spriteSize: "height" });
    })
  }

  static _registerUI(packId, packData) {
    let uis = this.packs[packId].textures.ui;
    packData.ui.forEach((ui) => {
      let path = `${DEFAULT_PATH_TO_ASSETS}/${packId}/ui/${ui.name}.png`;

      uis[ui.name] = new SpriteSheet({ path, spriteSize: ui.spriteSize, makeAlsoReversed: true })
    });
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

  static getUISheet(pack, id) {
    if (!PackAssetsRegistry.packs[pack]) {
      console.error(`Pack isn't exist...`);
      return false;
    }

    return PackAssetsRegistry.packs[pack].textures.ui[id];
  }

  static getProp(pack, id, state) {
    if (!PackAssetsRegistry.packs[pack]) {
      console.error(`Pack isn't exist...`);
      return false;
    }

    return PackAssetsRegistry.packs[pack].textures.props[id].states[state];
  }
}

export default PackAssetsRegistry;