const fs = require('fs');
const path = require('path');

const argv = process.argv;
const file = path.normalize(`${__dirname}/../${argv[2]}`);
const str = argv[3];
const newValue = argv[4];

if (fs.existsSync(file)) {
  const r = new RegExp(str, 'g');
  const content = fs.readFileSync(file).toString('utf8');
  const found = content.search(r);

  fs.writeFileSync(file, content.replace(r, newValue));
  console.log(' -- Script: replaceInFiles.js --');
  console.log(
    ` > replaced "${str}" with "${newValue}" (${
      found < 0 ? 0 : found
    } matches found.)`
  );
  console.log(` > in ${file}`);
} else {
  throw new Error(`${file} can not be found.`);
}
