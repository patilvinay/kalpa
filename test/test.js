/* eslint-disable guard-for-in */
/* eslint-disable import/no-unresolved */
/* eslint-disable import/newline-after-import */
/* eslint strict: ["error", "global"] */

const test = require("kalpa-tester");
const yaml = require("yamljs");
const obj = yaml.load("test.yaml").testing;
// console.log(testData)

// eslint-disable-next-line guard-for-in
// eslint-disable-next-line no-restricted-syntax
for (const i in obj) {
  const testData = obj[i];
  let result = false;
  if (Object.prototype.hasOwnProperty.call(testData, "param")) {
    result = test.test(testData.param, testData.expect);
    if (result) console.log("test passed");
    else console.log("test failed");
  }
}
