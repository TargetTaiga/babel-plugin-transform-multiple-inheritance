# babel-plugin-transform-multiple-inheritance
Transforms sequence expression given after `extends`.

## Installing
`npm i babel-plugin-transform-multiple-inheritance`

## Example
Transforms following class declaration
```js
class RoboRabbit extends (Animal, Robot) {
}
```
Into:
```js
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
```