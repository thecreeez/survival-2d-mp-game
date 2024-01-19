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
}

export default MathUtils;