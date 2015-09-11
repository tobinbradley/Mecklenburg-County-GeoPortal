// iterate through stuff like querySelectorAll

var forEach = function (array, callback, scope) {
  for (var i = 0; i < array.length; i++) {
    callback.call(scope, i, array[i]); // passes back stuff we need
  }
};

if (typeof module === 'object') {
    module.exports = forEach;
}
