module.exports = {
    env: {
        commonjs: true,
        node: true,
        browser: true,
        es6: true,
        jest: true,
    },
    extends: [''],
    globals: {},
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 2018,
        sourceType: 'module',
    },
    plugins: ['react', 'import', 'react-hooks'],
    ignorePatterns: ['node_modules/'],
    rules: {},
    settings: {
        react: {
            version: 'detect', // "detect" automatically picks the version you have installed.
        },
    },
};
