class RoboRabbit extends (function () {
  function ProxySuperClass() {
    Object.assign(this, new Robot(), new Animal());
  }

  ProxySuperClass.prototype = new Proxy({}, {
    get(target, prop) {
      return target[prop] || Animal.prototype[prop] || Robot.prototype[prop];
    },

    getPrototypeOf() {
      return Animal.prototype;
    }

  });
  return ProxySuperClass;
})() {}