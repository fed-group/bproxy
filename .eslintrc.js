module.exports = {
  extends: [
    '@fengyinchao/eslint-config-fed/typescript-base',
    '@fengyinchao/eslint-config-fed/react',
    'plugin:import/typescript',
  ],
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
    'no-unused-vars': 1,
    'import/no-cycle': 0,
    '@typescript-eslint/ban-types': 0,
    'react/react-in-jsx-scope': 0,
    'import/no-unresolved': [2, { ignore: ['.img$', '.css$'] }],
    'import/prefer-default-export': 0,
    '@typescript-eslint/consistent-type-imports': [
      'error',
      {
        prefer: 'type-imports',
        disallowTypeAnnotations: false,
      },
    ],
  },
};
