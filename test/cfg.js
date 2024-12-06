const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const fs = require('fs');

const code = fs.readFileSync('payload.js', 'utf-8');

const ast = parser.parse(code, {
  sourceType: 'module',
  plugins: ['optionalChaining'],
});

const steps = [];
traverse(ast, {
  FunctionDeclaration(path) {
    if (path.node.id.name === 'main') {
      path.traverse({
        CallExpression(innerPath) {
          const funcName = innerPath.node.callee.name;
          if (funcName) steps.push(funcName);
        },
      });
    }
  },
});

const mermaidCFG = ['graph TD'];
steps.forEach((step, index) => {
  if (index < steps.length - 1) {
    mermaidCFG.push(`${step} --> ${steps[index + 1]}`);
  }
});

fs.writeFileSync('cfg.mermaid', mermaidCFG.join('\n'));
console.log('сfg сохранён в cfg.mermaid');
