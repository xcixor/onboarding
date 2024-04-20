module.exports = {
    testPathIgnorePatterns: ["<rootDir>/.next/", "<rootDir>/node_modules/"],
    setupFilesAfterEnv: ["<rootDir>/tests/setupTests.ts"],
    setupFiles: ["dotenv/config"],
    preset: "ts-jest",
    testEnvironment: "node",
    moduleNameMapper: {
      "@/lib/(.*)": "<rootDir>/lib/$1",
      "@/constants": "<rootDir>/constants/index",
      "^.+\\.(css|less|scss)$": "identity-obj-proxy",
    },
    transform: {
      // '^.+\\.[tj]sx?$' to process js/ts with `ts-jest`
      // '^.+\\.m?[tj]sx?$' to process js/ts/mjs/mts with `ts-jest`
      "^.+\\.tsx?$": [
        "ts-jest",
        {
          diagnostics: {
            warnOnly: true, // <- This is the key
          },
        },
      ],
    },
  };