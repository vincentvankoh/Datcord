module.exports = async () => {
  global.testServer = await require('./__tests__/server.test.js/server');
};
