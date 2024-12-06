const babel = require('@babel/core');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generator = require('@babel/generator').default;
const fs = require('fs');

const code = fs.readFileSync('main.js', 'utf-8');

const ast = parser.parse(code, { sourceType: 'module' });

traverse(ast, {
  FunctionDeclaration(path) {
    if (path.node.id.name !== 'main') {
      path.remove();
    }
  },
  VariableDeclaration(path) {
    if (!path.node.declarations.some(decl => decl.id.name === 'MODE_PARAM' || decl.id.name === 'MOBILE_MODE')) {
      path.remove();
    }
  },
});

const output = generator(ast, {}).code;

fs.writeFileSync('payload.js', output);
console.log('нагрузка извлечена');
