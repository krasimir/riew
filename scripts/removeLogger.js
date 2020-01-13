const fs = require('fs');
const esprima = require('esprima');
const { visit } = require('ast-types');
const escodegen = require('escodegen');

const file = `${__dirname}/../riew.production.js`;
const prodFileContent = fs.readFileSync(file).toString('utf-8');
const ast = esprima.parseScript(prodFileContent);
const found = [];

visit(ast, {
  visitCallExpression(path) {
    const callee = path.node.callee;
    if (callee.type === 'MemberExpression') {
      const object = callee.object;
      const property = callee.property;
      if (
        object &&
        object.property &&
        object.property.name === 'logger' &&
        property &&
        property.name === 'log'
      ) {
        found.push(escodegen.generate(path.node));
        path.prune();
      }
    }
    this.traverse(path);
  },
});

const result = escodegen.generate(ast);

fs.writeFileSync(file, result);
console.log('-----------------------------------------');
console.log(`logger.log removed ${found.length} times.`);
console.log(JSON.stringify(found, null, 2));
console.log('-----------------------------------------');
// console.log(found);
