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

/**
 * VERTICAL
 */
let roadVerticalLeftRule = WorldRules.addRule("road_vertical_left", [
  ["core", 1, 6]
]).addTop()
  .addDown()
  .addLeft(commonRule);

let roadVerticalRightRule = WorldRules.addRule("road_vertical_right", [
  ["core", 2, 6]
]).addTop()
  .addDown()
  .addLeft(roadVerticalLeftRule)
  .addRight(commonRule);

/**
 * VERTICAL ROAD ENDS
 */
let roadVerticalLeftTopEndRule = WorldRules.addRule("road_vertical_left_top_end", [
  ["core", 0, 8]
]).addTop(commonRule)
  .addLeft(commonRule)
  .addDown(roadVerticalLeftRule)

let roadVerticalRightTopEndRule = WorldRules.addRule("road_vertical_right_top_end", [
  ["core", 1, 8]
]).addTop(commonRule)
  .addRight(commonRule)
  .addDown(roadVerticalRightRule)
  .addLeft(roadVerticalLeftTopEndRule);

let roadVerticalLeftBottomEndRule = WorldRules.addRule("road_vertical_left_bottom_end", [
  ["core", 1, 7]
]).addDown(commonRule)
  .addLeft(commonRule)
  .addTop(roadVerticalLeftRule)

let roadVerticalRightBottomEndRule = WorldRules.addRule("road_vertical_right_bottom_end", [
  ["core", 2, 7]
]).addDown(commonRule)
  .addRight(commonRule)
  .addTop(roadVerticalRightRule)
  .addLeft(roadVerticalLeftBottomEndRule);

/**
 * HORIZONTAL
 */
let roadHorizontalTopRule = WorldRules.addRule("road_horizontal_top", [
  ["core", 0, 6]
]).addTop(commonRule)
  .addLeft()
  .addRight();

let roadHorizontalBottomRule = WorldRules.addRule("road_horizontal_bottom", [
  ["core", 0, 7]
]).addTop(roadHorizontalTopRule)
  .addDown(commonRule)
  .addLeft()
  .addRight();

/**
 * HORIZONTAL ROAD ENDS
 */

/**
 * CROSSROADS
 */
let roadCrossroadTopLeftRule = WorldRules.addRule("road_crossroad_top_left", [
  ["core", 8, 5]
]).addTop(roadVerticalLeftRule)
  .addTop(roadVerticalLeftTopEndRule)
  .addLeft(roadHorizontalTopRule)

let roadCrossroadTopRightRule = WorldRules.addRule("road_crossroad_top_right", [
  ["core", 9, 5]
]).addTop(roadVerticalRightRule)
  .addTop(roadVerticalRightTopEndRule)
  .addLeft(roadCrossroadTopLeftRule)
  .addRight(roadHorizontalTopRule);

let roadCrossroadBottomLeftRule = WorldRules.addRule("road_crossroad_bottom_left", [
  ["core", 8, 6]
]).addTop(roadCrossroadTopLeftRule)
  .addDown(roadVerticalLeftRule)
  .addDown(roadVerticalLeftBottomEndRule)
  .addLeft(roadHorizontalBottomRule);

let roadCrossroadBottomRightRule = WorldRules.addRule("road_crossroad_bottom_right", [
  ["core", 9, 6]
]).addTop(roadCrossroadTopRightRule)
  .addLeft(roadCrossroadBottomLeftRule)
  .addDown(roadVerticalRightRule)
  .addDown(roadVerticalRightBottomEndRule)
  .addRight(roadHorizontalBottomRule);

export default WorldRules.rules;