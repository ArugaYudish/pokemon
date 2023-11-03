module.exports = {
  testEnvironment: 'jest-environment-jsdom',
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  moduleNameMapper: {
    "\\.(css|less|scss)$": "identity-obj-proxy"
  }
  // Konfigurasi lainnya...
};
