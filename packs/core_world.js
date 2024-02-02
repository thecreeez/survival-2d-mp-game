class GenerateRules {
  static rules = [];

  static addRule(weight = 1, tiles, { left = ["common"], right = ["common"], top = ["common"], bottom = ["common"] } = {}) {
    this.rules.push({
      tiles,
      weight,
      tags: {
        left,
        right,
        top,
        bottom
      }
    })
  }
}

// Common
GenerateRules.addRule(500, [
  ["core", 0, 0],
  ["core", 0, 2],
  ["core", 0, 3],
  ["core", 1, 2],
  ["core", 1, 3]
]);

/**
 * 
 * 
 * ROAD
 * 
 * 
 */

// Horizontal
GenerateRules.addRule(7, [
  ["core", 0, 6, "0:0"], ["core", 0, 6, "1:0"],
  ["core", 0, 7, "0:1"], ["core", 0, 7, "1:1"],
], {
  left: ["road"],
  right: ["road"]
});

// Vertical
GenerateRules.addRule(7, [
  ["core", 1, 6, "0:0"], ["core", 2, 6, "1:0"],
  ["core", 1, 6, "0:1"], ["core", 2, 6, "1:1"],
], {
  top: ["road"],
  bottom: ["road"]
});

// Crossroad
GenerateRules.addRule(1, [
  ["core", 8, 5, "0:0"], ["core", 9, 5, "1:0"],
  ["core", 8, 6, "0:1"], ["core", 9, 6, "1:1"],
], {
  top: ["road"],
  left: ["road"],
  right: ["road"],
  bottom: ["road"]
});

// Right end
GenerateRules.addRule(1, [
  ["core", 0, 6, "0:0"], ["core", 3, 5, "1:0"],
  ["core", 0, 7, "0:1"], ["core", 3, 6, "1:1"],
], {
  left: ["road"]
});

// Left end
GenerateRules.addRule(1, [
  ["core", 3, 7, "0:0"], ["core", 0, 6, "1:0"],
  ["core", 3, 8, "0:1"], ["core", 0, 7, "1:1"],
], {
  right: ["road"]
});

// Top end
GenerateRules.addRule(1, [
  ["core", 0, 8, "0:0"], ["core", 1, 8, "1:0"],
  ["core", 1, 6, "0:1"], ["core", 2, 6, "1:1"],
], {
  bottom: ["road"]
});

// Bottom end
GenerateRules.addRule(1, [
  ["core", 1, 6, "0:0"], ["core", 2, 6, "1:0"],
  ["core", 1, 7, "0:1"], ["core", 2, 7, "1:1"],
], {
  top: ["road"]
});

// Rotates
GenerateRules.addRule(1, [
  ["core", 4, 5, "0:0"], ["core", 5, 5, "1:0"],
  ["core", 4, 6, "0:1"], ["core", 5, 6, "1:1"],
], {
  bottom: ["road"],
  right: ["road"]
});

GenerateRules.addRule(1, [
  ["core", 6, 5, "0:0"], ["core", 7, 5, "1:0"],
  ["core", 6, 6, "0:1"], ["core", 7, 6, "1:1"],
], {
  bottom: ["road"],
  left: ["road"]
});

GenerateRules.addRule(1, [
  ["core", 4, 7, "0:0"], ["core", 5, 7, "1:0"],
  ["core", 4, 8, "0:1"], ["core", 5, 8, "1:1"],
], {
  top: ["road"],
  right: ["road"]
});

GenerateRules.addRule(1, [
  ["core", 6, 7, "0:0"], ["core", 7, 7, "1:0"],
  ["core", 6, 8, "0:1"], ["core", 7, 8, "1:1"],
], {
  top: ["road"],
  left: ["road"]
});

export default GenerateRules.rules;