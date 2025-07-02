module.exports = {
    env: {
        node: true,
        commonjs: true,
        es2021: true,
        jest: true,
    },
    extends: ['eslint:recommended', 'plugin:node/recommended', 'plugin:prettier/recommended'],
    parserOptions: {
        ecmaVersion: 2022,
    },
    rules: {
        'no-console': 'warn',
        'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
        'node/no-unsupported-features/es-syntax': 'off',
        'node/no-unpublished-require': [
            'warn',
            {
                allowModules: ['supertest'],
            },
        ],
        'prettier/prettier': 'warn',
    },
};
