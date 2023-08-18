const request = require('../../utils/request');

module.exports = function () {
  return request({
    url: '/project/template',
  });
};
