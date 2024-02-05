class GenerateRules {
  static rules = [];

  static addRule(weight = 1, tiles, { left = ["common"], right = ["common"], top = ["common"], bottom = ["common"] } = {}, { spawnOnceRules = [], spawnRules = [] } = {}) {
    this.rules.push({
      tiles,
      weight,
      tags: {
        left,
        right,
        top,
        bottom
      },
      spawnOnceRules,
      spawnRules
    });
  }
}


/**
 * 
 * 
 * DIRT
 * 
 * 
 */
// Full Dirt
GenerateRules.addRule(500, [
    ["core", 0, 9],
    ["core", 1, 9],
    ["core", 2, 9],
    ["core", 3, 9],
    ["core", 4, 9],
    ["core", 5, 9]
], {
    left: ["dirt", "dirt-to-common"],
    right: ["dirt", "dirt-to-common"],
    bottom: ["dirt", "dirt-to-common"],
    top: ["dirt", "dirt-to-common"]
});


// TRANSITION

// TOP-LEFT
GenerateRules.addRule(1, [
    ["core", 6, 9, "0:0"], ["core", 7, 9, "1:0"],
    ["core", 6, 10, "0:1"], ["core", 0, 9, "1:1"],
], {
    left: ["common"],
    right: ["dirt-to-common"],
    bottom: ["dirt-to-common"],
    top: ["common"]
});
// TOP-MID
GenerateRules.addRule(1, [
    ["core", 7, 9, "0:0"], ["core", 7, 9, "1:0"],
    ["core", 0, 9, "0:1"], ["core", 0, 9, "1:1"],
], {
    left: ["dirt-to-common"],
    right: ["dirt-to-common"],
    bottom: ["dirt"],
    top: ["common"]
});
// TOP-RIGHT
GenerateRules.addRule(1, [
    ["core", 7, 9, "0:0"], ["core", 8, 9, "1:0"],
    ["core", 0, 9, "0:1"], ["core", 8, 10, "1:1"],
], {
    left: ["dirt-to-common"],
    right: ["common"],
    bottom: ["dirt-to-common"],
    top: ["common"]
});
// MIDDLE-LEFT
GenerateRules.addRule(1, [
    ["core", 6, 10, "0:0"], ["core", 0, 9, "1:0"],
    ["core", 6, 10, "0:1"], ["core", 0, 9, "1:1"],
], {
    left: ["common"],
    right: ["dirt"],
    bottom: ["dirt-to-common"],
    top: ["dirt-to-common"]
});
// MIDDLE-RIGHT
GenerateRules.addRule(1, [
    ["core", 0, 9, "0:0"], ["core", 8, 10, "1:0"],
    ["core", 0, 9, "0:1"], ["core", 8, 10, "1:1"],
], {
    left: ["dirt"],
    right: ["common"],
    bottom: ["dirt-to-common"],
    top: ["dirt-to-common"]
});
// BOTTOM-LEFT
GenerateRules.addRule(1, [
    ["core", 6, 10, "0:0"], ["core", 0, 9, "1:0"],
    ["core", 6, 11, "0:1"], ["core", 7, 11, "1:1"],
], {
    left: ["common"],
    right: ["dirt-to-common"],
    bottom: ["common"],
    top: ["dirt-to-common"]
});
// BOTTOM-MID
GenerateRules.addRule(1, [
    ["core", 0, 9, "0:0"], ["core", 0, 9, "1:0"],
    ["core", 7, 11, "0:1"], ["core", 7, 11, "1:1"],
], {
    left: ["dirt-to-common"],
    right: ["dirt-to-common"],
    bottom: ["common"],
    top: ["dirt"]
});
// BOTTOM-RIGHT
GenerateRules.addRule(1, [
    ["core", 0, 9, "0:0"], ["core", 8, 10, "1:0"],
    ["core", 7, 11, "0:1"], ["core", 8, 11, "1:1"],
], {
    left: ["dirt-to-common"],
    right: ["common"],
    bottom: ["common"],
    top: ["dirt-to-common"]
});

/**
 * 
 * 
 * COMMON
 * 
 * 
 */

// Common
GenerateRules.addRule(600, [
  ["core", 0, 0],
  ["core", 0, 2],
  ["core", 0, 3],
  ["core", 1, 2],
  ["core", 1, 3]
], {}, {
  spawnOnceRules: ["core:prop_entity/rock"],
  spawnRules: ["core:spider-entity"]
});

/**
 * 
 * 
 * ROAD
 * 
 * 
 */

// Horizontal
GenerateRules.addRule(15, [
  ["core", 0, 6, "0:0"], ["core", 0, 6, "1:0"],
  ["core", 0, 7, "0:1"], ["core", 0, 7, "1:1"],
], {
  left: ["road"],
  right: ["road"]
}, {
  spawnOnceRules: ["core:prop_entity/barrel", "core:prop_entity/red_car"]
});

// Vertical
GenerateRules.addRule(15, [
  ["core", 1, 6, "0:0"], ["core", 2, 6, "1:0"],
  ["core", 1, 6, "0:1"], ["core", 2, 6, "1:1"],
], {
  top: ["road"],
  bottom: ["road"]
}, {
  spawnOnceRules: ["core:prop_entity/barrel", "core:prop_entity/red_car"]
});

// Crossroad
GenerateRules.addRule(2, [
  ["core", 8, 5, "0:0"], ["core", 9, 5, "1:0"],
  ["core", 8, 6, "0:1"], ["core", 9, 6, "1:1"],
], {
  top: ["road"],
  left: ["road"],
  right: ["road"],
  bottom: ["road"]
}, {
  spawnOnceRules: ["core:prop_entity/barrel", "core:prop_entity/red_car"]
});

// Right end
GenerateRules.addRule(1, [
  ["core", 0, 6, "0:0"], ["core", 3, 5, "1:0"],
  ["core", 0, 7, "0:1"], ["core", 3, 6, "1:1"],
], {
  left: ["road"]
}, {
  spawnOnceRules: ["core:prop_entity/barrel", "core:prop_entity/red_car"]
});

// Left end
GenerateRules.addRule(1, [
  ["core", 3, 7, "0:0"], ["core", 0, 6, "1:0"],
  ["core", 3, 8, "0:1"], ["core", 0, 7, "1:1"],
], {
  right: ["road"]
}, {
  spawnOnceRules: ["core:prop_entity/barrel", "core:prop_entity/red_car"]
});

// Top end
GenerateRules.addRule(1, [
  ["core", 0, 8, "0:0"], ["core", 1, 8, "1:0"],
  ["core", 1, 6, "0:1"], ["core", 2, 6, "1:1"],
], {
  bottom: ["road"]
}, {
  spawnOnceRules: ["core:prop_entity/barrel", "core:prop_entity/red_car"]
});

// Bottom end
GenerateRules.addRule(1, [
  ["core", 1, 6, "0:0"], ["core", 2, 6, "1:0"],
  ["core", 1, 7, "0:1"], ["core", 2, 7, "1:1"],
], {
  top: ["road"]
}, {
  spawnOnceRules: ["core:prop_entity/barrel", "core:prop_entity/red_car"]
});

// Rotates
GenerateRules.addRule(1, [
  ["core", 4, 5, "0:0"], ["core", 5, 5, "1:0"],
  ["core", 4, 6, "0:1"], ["core", 5, 6, "1:1"],
], {
  bottom: ["road"],
  right: ["road"]
}, {
  spawnOnceRules: ["core:prop_entity/barrel", "core:prop_entity/red_car"]
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
}, {
  spawnOnceRules: ["core:prop_entity/barrel", "core:prop_entity/red_car"]
});

GenerateRules.addRule(1, [
  ["core", 6, 7, "0:0"], ["core", 7, 7, "1:0"],
  ["core", 6, 8, "0:1"], ["core", 7, 8, "1:1"],
], {
  top: ["road"],
  left: ["road"]
}, {
  spawnOnceRules: ["core:prop_entity/barrel", "core:prop_entity/red_car"]
});

export default GenerateRules.rules;