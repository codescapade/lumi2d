const luamin = require('luamin');
const fs = require('fs');
const path = require('path');

async function minify() {
  const args = process.argv;

  if (args.length < 3) {
    return;
  }

  const filePath = path.join(process.cwd(), args[2]);

  const buffer = await fs.promises.readFile(filePath);
  const content = buffer.toString();

  const minified = luamin.minify(content);

  await fs.promises.writeFile(filePath, minified);
}

minify();
