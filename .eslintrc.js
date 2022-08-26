module.exports = {
  extends: ['@fengyinchao/eslint-config-fed/typescript-base', '@fengyinchao/eslint-config-fed/react'],
  parserOptions: {
    project: [
      './packages/bridge/tsconfig.bridge.json',
      './packages/client/tsconfig.client.json',
      './packages/server/tsconfig.server.json',
      './packages/utils/tsconfig.utils.json',
    ],
    sourceType: 'module',
  },
  rules: {
    'react/react-in-jsx-scope': 0,
    'import/no-unresolved': [2, { ignore: ['.img$', '.css$', '.d.ts$'] }],
  },
};
