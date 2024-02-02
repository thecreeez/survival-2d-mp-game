class WorldRules {
  static rules = {};

  /**
   * @returns {Rule}
   */
  static addRule(name, tiles) {
    this.rules[name] = new Rule(name, tiles);
    return this.rules[name];
  }
}

class Rule {
  constructor(name, tiles) {
    this.name = name;
    this.tiles = tiles;
    this.connections = {
      top: [],
      bottom: [],
      left: [],
      right: []
    }
  }

  addLeft(rule = "self") {
    if (rule === "self")
      rule = this;

    this.connections.left.push(rule.name);

    if (rule !== this)
      rule.connections.right.push(this.name);

    return this;
  }

  addRight(rule = "self") {
    if (rule === "self")
      rule = this;

    this.connections.right.push(rule.name);

    if (rule !== this)
      rule.connections.left.push(this.name);

    return this;
  }

  addTop(rule = "self") {
    if (rule === "self")
      rule = this;

    this.connections.top.push(rule.name);

    if (rule !== this)
      rule.connections.bottom.push(this.name);

    return this;
  }

  addDown(rule = "self") {
    if (rule === "self")
      rule = this;

    this.connections.bottom.push(rule.name);

    if (rule !== this)
      rule.connections.top.push(this.name);

    return this;
  }
}

/**
 * COMMON
 */
let commonRule = WorldRules.addRule("common", [
  ["core", 0, 0],
  ["core", 0, 2],
  ["core", 0, 3],
  ["core", 1, 2],
  ["core", 1, 3]
]).addTop()
  .addDown()
  .addLeft()
  .addRight();

let verticalRoad = WorldRules.addRule("vertical_road", [
  ["core", 1, 6, "0:0"], ["core", 2, 6, "1:0"],
  ["core", 1, 6, "0:1"], ["core", 2, 6, "1:1"],
]).addLeft(commonRule)
  .addRight(commonRule)
  .addTop()
  .addDown();

let horizontalRoad = WorldRules.addRule("horizontal_road", [
  ["core", 0, 6, "0:0"], ["core", 0, 6, "1:0"],
  ["core", 0, 7, "0:1"], ["core", 0, 7, "1:1"],
]).addLeft()
  .addRight()
  .addTop(commonRule)
  .addDown(commonRule);

let rotateRightToDown = WorldRules.addRule("road_rotate_right_to_down", [
  ["core", 4, 5, "0:0"], ["core", 5, 5, "1:0"],
  ["core", 4, 6, "0:1"], ["core", 5, 6, "1:1"],
]).addRight(horizontalRoad)
  .addLeft(commonRule)
  .addTop(commonRule);

let rotateRightToTop = WorldRules.addRule("road_rotate_right_to_top", [
  ["core", 4, 7, "0:0"], ["core", 5, 7, "1:0"],
  ["core", 4, 8, "0:1"], ["core", 5, 8, "1:1"],
]).addRight(horizontalRoad)
  .addTop(verticalRoad)
  .addLeft(commonRule)
  .addDown(horizontalRoad)
  .addDown(commonRule);

let rotateLeftToDown = WorldRules.addRule("road_rotate_left_to_down", [
  ["core", 6, 5, "0:0"], ["core", 7, 5, "1:0"],
  ["core", 6, 6, "0:1"], ["core", 7, 6, "1:1"],
]).addLeft(horizontalRoad)
  .addDown(verticalRoad)
  .addRight(commonRule)
  .addTop(commonRule)
  .addLeft(rotateRightToTop)

let rotateLeftToTop = WorldRules.addRule("road_rotate_left_to_top", [
  ["core", 6, 7, "0:0"], ["core", 7, 7, "1:0"],
  ["core", 6, 8, "0:1"], ["core", 7, 8, "1:1"],
]).addRight(commonRule)
  .addDown(commonRule)
  .addLeft(horizontalRoad)
  .addTop(rotateLeftToDown)
  .addTop(verticalRoad)
  .addTop(rotateRightToDown);

let crossroad = WorldRules.addRule("crossroad", [
  ["core", 8, 5, "0:0"], ["core", 9, 5, "1:0"],
  ["core", 8, 6, "0:1"], ["core", 9, 6, "1:1"],
]).addLeft(horizontalRoad)
  .addRight(horizontalRoad)
  .addTop(verticalRoad)
  .addDown(verticalRoad)
  .addDown(rotateLeftToTop)
  .addTop(rotateRightToDown);

export default WorldRules.rules;