exports.hashPassword = function hashCode(str) {
  return str.split('').reduce((prevHash, currVal) =>
    (((prevHash << 5) - prevHash) + currVal.charCodeAt(0))|0, 0);
}

exports.isInteger = function(str) {
  var regex = /^-?[0-9]*[1-9][0-9]*$/;
  return regex.test(str);
}