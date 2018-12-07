class TOOL {
  constructor() {}

  CreateId() {
    let S4 = function() {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
  }

  FindIndexById(array, idValue) {
    let index = array.map(function(e) {
      return e.id;
    }).indexOf(idValue);
    return index;
  }

  IsHit(obj1, obj2) {
    let a = obj1.x - obj2.x;
    let b = obj1.y - obj2.y;
    let r2 = obj1.r + obj2.r;
    let dist = Math.sqrt(a * a + b * b);
    if (dist > r2) {
      return false
    } else {
      return true
    }
  }

  Random(max) {
    let randy = Math.floor(Math.random() * max);
    return randy
  }

  RanTest(para1, para2 = undefined) {
      let min = para2 === undefined ? 0 : para1;
      let max = para2 === undefined ? para1 : para2;
      let randy = Math.floor(Math.random() * (max - min)) + min;
      return randy
  }

  isInArray(value, array) {
    return array.indexOf(value) > -1;
  }

  Constrain(num, min, max) {
    num = num >= max
      ? max
      : num;
    num = num <= min
      ? min
      : num;
    return num
  }

}
let tool = new TOOL();

module.exports = tool;
