import ShopInteractPacket from "../../../../core/packets/ShopInteractPacket.js";
import EntityRendererRegistry from "./EntityRendererRegistry.js";

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

class Hotbar {
  constructor(screen) {
    this.screen = screen;
    this.size = [200, 50];
    this.entities = ["core:human_guard_entity", "core:spider_entity", null, null];
    this.highlightedSlot = -1;
    this.selectedSlot = -1;
  }

  render() {
    this._renderHotbar();
    let client = this.screen.client;

    if (this.selectedSlot !== -1) {
      let mousePos = client.controlsHandler.mousePos;
      
      if (this.entities[this.selectedSlot] && EntityRendererRegistry[this.entities[this.selectedSlot]]) {
        ctx.translate(mousePos[0] - 25, mousePos[1]);
        ctx.rotate(client.controlsHandler.deltaMousePos[0] / 20)
        EntityRendererRegistry[this.entities[this.selectedSlot]].renderOnScreen({
          ctx,
          pos: [0,0],
          entityData: {}
        });
        ctx.rotate(-client.controlsHandler.deltaMousePos[0] / 20)
        ctx.translate(-mousePos[0] + 25, -mousePos[1]);
      }
    }
  }

  update(deltaTime) {
    
  }

  _renderHotbar() {
    let client = this.screen.client;
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

    this.screen.renderNumber([pos[0] + 5, canvas.height - this.size[1]], client.getPlayer().getFollowers(), 3);
    this.screen.renderNumber([pos[0] + this.size[0] - 10, canvas.height - this.size[1]], client.getPlayer().getMoney(), 4);
  }

  getSlot(mousePos) {
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

  handleMouseMove(mousePos) {
    this.highlightedSlot = this.getSlot(mousePos);

    return this.highlightedSlot !== -1;
  }

  handleMouseDown(mousePos) {
    let client = this.screen.client;
    let slotOnMouse = this.getSlot(mousePos);
    let isHandled = slotOnMouse !== -1;

    if (this.selectedSlot !== -1 && slotOnMouse === -1) {
      ShopInteractPacket.clientSend(client.connectionHandler.getSocket(), 
        { type: ShopInteractPacket.InteractType.Buy, entityId: this.entities[this.selectedSlot], position: Screen.toWorldPos(client, [mousePos[0], mousePos[1] + 50]) });

      isHandled = true;
    }

    this.selectedSlot = slotOnMouse;

    return isHandled;
  }
}

export default Hotbar;