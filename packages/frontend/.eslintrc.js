module.exports = {
  extends: ['../../.eslintrc.js', 'plugin:react/recommended'],
  plugins: ['react'],
  env: {
    browser: true,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    'react/prop-types': 'warn',
    'react/react-in-jsx-scope': 'off', // Not needed in React 17+
  },
};
