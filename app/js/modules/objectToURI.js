var objectToURI = function(obj) {
    var data, key, value;
    data = [];
    for (key in obj) {
      value = obj[key];
      data.push(escape(key) + '=' + escape(value));
    }
    return '?' + data.join('&');
  };

 module.exports = objectToURI;
