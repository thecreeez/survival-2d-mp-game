class PlayerRender {
  static render(ctx, playerEntity) {
    ctx.fillStyle = playerEntity.getColor();

    if (playerEntity.b_sitting.getValue()) {
      // todo
    }

    ctx.fillRect(playerEntity.getPosition()[0] - 10, playerEntity.getPosition()[1] - 10, 20, 20);
    ctx.font = `15px arial`;
    ctx.fillText(playerEntity.health.getValue(), playerEntity.getPosition()[0], playerEntity.getPosition()[1] - 20);
  }
}

export default PlayerRender;