import ShopInteractPacket from "../../../../core/packets/ShopInteractPacket.js";
import EntityRendererRegistry from "./EntityRendererRegistry.js";
import Screen from "./Screen.js";

class Hotbar {
  static size = [200, 50];
  static entities = ["core:human_guard_entity", "core:spider_entity", null, null];
  static highlightedSlot = -1;
  static selectedSlot = -1;

  static client = false;

  static render(canvas, ctx, client) {
    this._renderHotbar(canvas, ctx, client);

    if (!this.client) {
      this.client = client;
    }

    if (this.selectedSlot !== -1) {
      let mousePos = client.controlsHandler.mousePos;
      
      if (this.entities[this.selectedSlot] && EntityRendererRegistry[this.entities[this.selectedSlot]])
        EntityRendererRegistry[this.entities[this.selectedSlot]].renderOnScreen({
          ctx,
          pos: mousePos,
          entityData: {}
        });
    }
  }

  static _renderHotbar(canvas, ctx, client) {
    let pos = [canvas.width / 2 - this.size[0] / 2, canvas.height - this.size[1] - 5];

    ctx.fillStyle = `black`;
    ctx.fillRect(pos[0] - 5, pos[1] - 5, this.size[0] + 10, this.size[1] + 10);

    for (let i = 0; i < 4; i++) {
      let slotPos = [pos[0] + i * this.size[0] / 4, pos[1]];
      ctx.fillStyle = `gray`;

      if (this.highlightedSlot === i) {
        ctx.fillStyle = `white`;
      }
      ctx.fillRect(slotPos[0], slotPos[1], this.size[0] / 4, this.size[1]);

      if (this.entities[i] && EntityRendererRegistry[this.entities[i]])
        EntityRendererRegistry[this.entities[i]].renderOnScreen({
          ctx,
          pos: slotPos,
          entityData: {}
        });
    }

    Screen.renderNumber([pos[0] + 5, canvas.height - this.size[1]], client.getPlayer().getFollowers(), 3);
    Screen.renderNumber([pos[0] + this.size[0] - 10, canvas.height - this.size[1]], client.getPlayer().getMoney(), 4);
  }

  static getSlot(mousePos) {
    let canvas = document.querySelector("canvas");
    let pos = [canvas.width / 2 - this.size[0] / 2, canvas.height - this.size[1] - 5];

    for (let i = 0; i < 4; i++) {
      let slotPos = [pos[0] + i * this.size[0] / 4, pos[1]];
      let slotSize = [this.size[0] / 4, this.size[1]];

      if (slotPos[0] < mousePos[0] && slotPos[0] + slotSize[0] > mousePos[0] &&
          slotPos[1] < mousePos[1] && slotPos[1] + slotSize[1] > mousePos[1]
        ) {
        return i;
      }
    }

    return -1;
  }

  static handleMouseMove(mousePos) {
    this.highlightedSlot = this.getSlot(mousePos);

    return this.highlightedSlot !== -1;
  }

  static handleMouseDown(mousePos) {
    let slotOnMouse = this.getSlot(mousePos);

    if (this.selectedSlot !== -1 && slotOnMouse === -1) {
      ShopInteractPacket.clientSend(this.client.connectionHandler.getSocket(), 
      { type: ShopInteractPacket.InteractType.Buy, entityId: this.entities[this.selectedSlot], position: Screen.getMousePosOnWorld(this.client) })
    }

    this.selectedSlot = slotOnMouse;

    return this.selectedSlot !== -1;
  }
}

export default Hotbar;