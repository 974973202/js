module.exports = function (source) {
  console.log(this.query, source, 'xxx')
  // return source.replace('666666', 'lz x')
  const json = source.replace('666666', 'lllllll');
  this.callback(null, json)
}