const fs = require('fs');
const path = require('path');

const argv = process.argv;
const file = path.normalize(__dirname + '/../' + argv[2]);
const str = argv[3];
const newValue = argv[4];

if (fs.existsSync(file)) {
  const content = fs.readFileSync(file).toString('utf8');

  fs.writeFileSync(file, content.replace(new RegExp(str, 'g'), newValue));
  console.log(' -- Script: replaceInFiles.js --');
  console.log(` > replaced "${ str }" with "${ newValue }"`);
  console.log(` > in ${ file }`);
} else {
  throw new Error(`${ file } can not be found.`);
}
