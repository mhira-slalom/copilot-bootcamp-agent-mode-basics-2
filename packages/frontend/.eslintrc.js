module.exports = {
    extends: ['react-app', 'react-app/jest', 'plugin:prettier/recommended'],
    rules: {
        'no-console': 'warn',
        'prettier/prettier': 'warn',
        'testing-library/no-unnecessary-act': 'warn',
        'testing-library/no-wait-for-multiple-assertions': 'warn',
    },
};
