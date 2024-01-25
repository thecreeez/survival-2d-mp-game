export default [
  {
    id: "lamp",
    defaultWorldSize: [80, 120],
    states: {
      default: {
        spritePos: [0, 0],
        spriteSize: [2, 3],
        tags: ["light-source", "light-color:120,0,120", "light-level:16"],
      },
      blue: {
        spritePos: [0, 0],
        spriteSize: [2, 3],
        tags: ["light-source", "light-color:255,0,0", "light-level:16"],
      },
      broken: {
        spritePos: [2, 2],
        spriteSize: [2, 1],
        worldSize: [80, 40]
      }
    }
  },
  {
    id: "barrel",
    defaultWorldSize: [40, 40],
    states: {
      default: {
        spritePos: [0, 3],
        spriteSize: [1, 1],
      },
      two: {
        spritePos: [1, 3],
        spriteSize: [1, 1],
      }
    }
  },
  {
    id: "rock",
    defaultWorldSize: [40, 40],
    states: {
      default: {
        spritePos: [0, 4],
        spriteSize: [1, 1],
      },
      variant0: {
        spritePos: [0, 4],
        spriteSize: [1, 1],
      },
      variant1: {
        spritePos: [1, 4],
        spriteSize: [1, 1],
      },
      variant2: {
        spritePos: [2, 4],
        spriteSize: [1, 1],
      },
      variant3: {
        spritePos: [3, 4],
        spriteSize: [1, 1],
      },
      variant4: {
        spritePos: [4, 4],
        spriteSize: [1, 1],
      }
    }
  },
  {
    id: "desk",
    defaultWorldSize: [40, 40],
    states: {
      default: {
        spritePos: [0, 5],
        spriteSize: [1, 1],
      },
      horizontal_default: {
        spritePos: [0, 5],
        spriteSize: [1, 1],
      },
      vertical_default: {
        spritePos: [1, 5],
        spriteSize: [1, 1],
      },
      horizontal_broken: {
        spritePos: [2, 5],
        spriteSize: [1, 1],
      },
      vertical_broken: {
        spritePos: [3, 5],
        spriteSize: [1, 1],
      }
    }
  },
  {
    id: "red_car",
    defaultWorldSize: [120,120],
    states: {
      default: {
        spritePos: [0, 8],
        spriteSize: [2, 2],
        offset: [0, 30]
      },
      left: {
        spritePos: [0, 8],
        spriteSize: [2, 2],
        offset: [0, 30]
      },
      right: {
        spritePos: [2, 8],
        spriteSize: [2, 2],
        offset: [0, 30]
      },
      top: {
        spritePos: [4, 8],
        spriteSize: [2, 2],
        offset: [0, 15]
      },
      bottom: {
        spritePos: [6, 8],
        spriteSize: [2, 2],
      }
    }
  },
]