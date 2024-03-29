module.exports = {
  parser: 'babel-eslint',
  extends: 'airbnb',
  env: {
    browser: true,
    es6: true,
    node: true,
    jest: true,
  },
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      defaultParams: true,
    },
  },
  rules: {
    // A jsx extension is not required for files containing jsx
    'react/jsx-filename-extension': 0,
    // This rule struggles with flow and class properties
    'react/sort-comp': 0,
    // ignore linebreak style. the CRLF / LF endings wont matter
    // if a windows user correctly converts CRLF to LF upon commits otherwise
    // there are errors every line.
    'linebreak-style': 0,
    'keyword-spacing': [2, { before: true, after: true }],
    semi: ['error', 'always'],
    'max-len': 0, //['error', { code: 120 }],
    'arrow-body-style': 0, // ["error", "always"],
    'import/no-extraneous-dependencies': 0,
    'import/no-unresolved': 0,
    'import/extensions': 0,
    'no-unused-vars': 0,
    'no-plusplus': 0,
    'no-mixed-operators': 0,
    'one-var': 0,
    'no-param-reassign': 0,
    'react/prefer-stateless-function': 0,
    'no-underscore-dangle': 0,
    'class-methods-use-this': 0,
    'no-shadow': 0,
    'prefer-destructuring': 0,
    'react/prop-types': 0,
    'no-console': 0,
    'react/jsx-no-bind': 0,
    'jsx-a11y/no-static-element-interactions': 0,
    'react/no-unused-state': 0,
    'no-useless-constructor': 0,
    'react/jsx-no-target-blank': 0,
    'jsx-a11y/alt-text': 0,
    'jsx-a11y/no-static-element-interactions': 0,
    'jsx-a11y/click-events-have-key-events': 0,
    'no-script-url': 0,
    'jsx-a11y/anchor-is-valid': 0,
    'jsx-a11y/no-noninteractive-element-interactions': 0,
    'react/no-array-index-key': 0,
    'import/no-duplicates': 0,
    'no-redeclare': 0,
    'array-callback-return': 0,
    'no-restricted-syntax': 0,
    'guard-for-in': 0,
    'no-restricted-globals': 0,
    'consistent-return': 0,
    'jsx-a11y/anchor-has-content': 0,
    radix: 0,
    'jsx-a11y/no-noninteractive-tabindex': 0,
    'jsx-a11y/tabindex-no-positive': 0,
    'jsx-a11y/tabindex-no-positive': 0,
    'react/no-multi-comp': 0,
    'jsx-a11y/label-has-for': 0,
    'function-paren-newline': 0,
    'react/require-default-props': 0,
    'object-curly-newline': 0,
    'react/no-did-update-set-state': 0,
    'react/destructuring-assignment': 0,
    'no-else-return': 0,
    'operator-linebreak': 0,
    'react/jsx-one-expression-per-line': 0,
    'implicit-arrow-linebreak': 0,
    'react/no-access-state-in-setstate': 0,
    'lines-between-class-members': 0,
    'import/prefer-default-export': 0,
    'react/no-unescaped-entities': 0,
    'no-unreachable': 0,
    // [
    //   'error',
    //   {
    //     ObjectExpression: { multiline: true, minProperties: 1 },
    //     ObjectPattern: { multiline: true, minProperties: 4 },
    //     ImportDeclaration: { multiline: true, minProperties: 4 },
    //     ExportDeclaration: { multiline: true, minProperties: 4 },
    //   },
    // ],
  },
};
