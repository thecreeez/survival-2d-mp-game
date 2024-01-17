import Registry from "/core/utils/Registry.js";
import SpriteSheet from "../graphic/SpriteSheet.js";
import Application from "/core/Application.js";

const DEFAULT_PATH_TO_ASSETS = `/client/assets`;

class PackAssetsRegistry extends Registry {
  static packs = {};

  static DEFAULT_ENTITY_SPRITE_SIZE = [32,32];
  static DEFAULT_TILE_SPRITE_SIZE = [8, 8];

  static register(packId, packData) {
    this.packs[packId] = {
      textures: {
        entities: {},
        tileset: false
      }
    };

    this._registerEntities(packId, packData);
    this._registerTileset(packId, packData);
  }

  static _registerEntities(packId, packData) {
    packData.entitiesClasses.forEach((entityClass) => {
      this.packs[packId].textures.entities[entityClass.empty().getId()] = {};
      let entityTextureData = this.packs[packId].textures.entities[entityClass.empty().getId()];

      if (entityClass.empty().states) {
        entityClass.empty().states.forEach((stateName) => {
          let path = `${DEFAULT_PATH_TO_ASSETS}/${packId}/entities/${entityClass.id}/${stateName}.png`;

          entityTextureData[stateName] = new SpriteSheet({ path, spriteSize: this.DEFAULT_ENTITY_SPRITE_SIZE });
        })
      } else {
        let path = `${DEFAULT_PATH_TO_ASSETS}/${packId}/entities/${entityClass.id}.png`;

        entityTextureData["default"] = new SpriteSheet({ path, spriteSize: this.DEFAULT_ENTITY_SPRITE_SIZE });
      }
    });
  }

  static _registerTileset(packId, packData) {
    let path = `${DEFAULT_PATH_TO_ASSETS}/${packId}/tileset.png`;
    this.packs[packId].textures.tileset = new SpriteSheet({ path, spriteSize: this.DEFAULT_TILE_SPRITE_SIZE });
  }

  static getPacksId() {
    let packs = [];

    for (let packId in this.packs) {
      packs.push(packId);
    }

    return packs
  }
}

export default PackAssetsRegistry;