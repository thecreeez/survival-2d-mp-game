import PackAssetsRegistry from "../../registry/PackAssetsRegistry.js";
import MapRenderer from "../MapRenderer.js";

class EntityRenderer {
  static Entity = null;

  static render(ctx, entity) {
    this.renderMain(ctx, entity);
    this.renderDebug(ctx, entity);

    //if (this.size && !this.sizeFormed) {
    //  this.size[0] = MapRenderer.tileSize;
    //  this.size[1] = MapRenderer.tileSize;
    //  this.sizeFormed = true;
    //  console.log(this.size);
    //}
  }

  static renderMain(ctx, entity) {
    ctx.fillStyle = `black`
    ctx.beginPath();
    ctx.arc(entity.getPosition()[0], entity.getPosition()[1], 25, 0, Math.PI * 2);
    ctx.fill();
  }

  static renderDebug(ctx, entity) {
    if (this.size) {
      ctx.strokeStyle = `black`;
      ctx.strokeRect(entity.getPosition()[0] - this.size[0] / 2, entity.getPosition()[1] - this.size[1], this.size[0], this.size[1])
    }

    ctx.font = `15px arial`;
    ctx.fillStyle = `white`
    ctx.textAlign = "center";
    ctx.fillText(`[${entity.getPosition()}]`, entity.getPosition()[0], entity.getPosition()[1] - this.size[1])
  }

  static updateEntity(entity, deltaTime) {
    
  }

  static getSpriteSheet(entity) {
    if (!PackAssetsRegistry.packs[entity.getPackId()].textures.entities[entity.getId()][entity.getTexture()]) {
      console.error(`Can't find entity spriteset ${entity.getFullId()}`)
      return false;
    }

    return PackAssetsRegistry.packs[entity.getPackId()].textures.entities[entity.getId()][entity.getTexture()];
  }
}

export default EntityRenderer;