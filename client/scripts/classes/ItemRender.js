class ItemRender {
  static render(ctx, itemEntity) {
    ctx.fillStyle = `brown`;
    ctx.fillRect(itemEntity.getPosition()[0] - 15, itemEntity.getPosition()[1] - 15, 30, 30);
  }
}

export default ItemRender;