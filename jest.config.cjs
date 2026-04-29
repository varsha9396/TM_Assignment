const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: "node",
  extensionsToTreatAsEsm: [".ts"],
  preset: "ts-jest",
  globals: {
    "ts-jest": {
      useESM: true,
      tsconfig: {
        ignoreDeprecations: "6.0",
      },
    },
  },
  transform: {
    ...tsJestTransformCfg,
  },
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
};