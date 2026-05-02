export default (randFunc: () => number) =>
  (min = 1, max?: number): number => {
    let mi = min
    let ma = max

    if (ma === undefined) {
      ma = mi
      mi = 0
    }

    return randFunc() * (ma - mi) + mi
  }
