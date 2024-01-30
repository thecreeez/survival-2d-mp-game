import Vector from './Vector.js';

class MathUtils {
  static distanceBetween(pos0, pos1) {
    let vector = [...pos0];

    pos1.forEach((value, i) => {
      vector[i] = vector[i] - value;
    })

    let sum = 0;

    vector.forEach((value) => {
      sum += value * value;
    })

    return Math.sqrt(sum)
  }
  
  static degreesToRadians(degrees) {
    return degrees * (Math.PI / 180);
  }

  static radiansToDegrees(radians) {
    return radians / (Math.PI / 180);
  }

  static getDistance(pos0, pos1 = [0,0]) {
    let position = [pos0[0] - pos1[0], pos0[1] - pos1[1]];

    return Math.sqrt(Math.pow(position[0], 2) + Math.pow(position[1], 2));
  }

  // Need to be normalized
  static getRotation([...position]) {
    let rotation = new Vector(position).getAngle();

    return rotation;
  }
}

export default MathUtils;