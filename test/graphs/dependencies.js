const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const fs = require('fs');

const code = fs.readFileSync('payload.js', 'utf-8');

// парсинг AST
const ast = parser.parse(code, {
  sourceType: 'module',
  plugins: ['optionalChaining'],
});

// сбор зависимостей
const dependencies = {};
const mainCalls = []; // Зсбор вызовов мэин

traverse(ast, {
  CallExpression(path) {
    let caller = null;

    // обработка MemberExpression
    if (path.node.callee.type === 'MemberExpression') {
      const objectName = path.node.callee.object.name || 'undefined';
      const methodName = path.node.callee.property.name || 'undefined';
      caller = `${objectName}.${methodName}`;
    } else if (path.node.callee.name) {
      // обработка  вызовов 
      caller = path.node.callee.name;
    } else {
      caller = 'undefined';
    }

    // связываем main с вызываемой функцией
    const parentFunction = path.getFunctionParent();
    if (parentFunction && parentFunction.node.id && parentFunction.node.id.name === 'main') {
      mainCalls.push(caller);
    }

    if (!dependencies[caller]) dependencies[caller] = [];

    // сбор аргументов вызова
    path.node.arguments.forEach(arg => {
      if (arg.type === 'Identifier') {
        dependencies[caller].push(arg.name || 'undefined');
      } else if (arg.type === 'Literal') {
        dependencies[caller].push(`[literal: ${arg.value || 'undefined'}]`);
      } else if (arg.type === 'ObjectExpression') {
        dependencies[caller].push('[object]');
      } else if (arg.type === 'FunctionExpression' || arg.type === 'ArrowFunctionExpression') {
        dependencies[caller].push('[callback]');
      } else {
        dependencies[caller].push('undefined');
      }
    });
  }
});

// создание Mermaid-графа
const mermaidDependencies = ['graph TD'];
const uniqueMainCalls = [...new Set(mainCalls)]; // Убираем дубликаты вызовов

// связываем main со всеми вызовами внутри 
uniqueMainCalls.forEach(call => {
  mermaidDependencies.push(`main --> ${call}`);
});

for (const [caller, args] of Object.entries(dependencies)) {
  args.forEach(arg => {
    mermaidDependencies.push(`${caller} --> ${arg}`);
  });
}

fs.writeFileSync('dependencies.mermaid', mermaidDependencies.join('\n'));
console.log('Граф зависимостей сохранён');
