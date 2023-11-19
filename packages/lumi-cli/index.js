const fs = require('fs');
const luamin = require('luamin');
const path = require('path');
const archiver = require('archiver');

const { Command } = require('commander');
const program = new Command();

program.name('lumi').description('Lumi cli tools').version('0.0.1');

program
  .command('minify')
  .description('Minify a lua file')
  .argument('<string>', 'The path to the lua file')
  .action(async (luaPath) => {
    const filePath = path.join(process.cwd(), luaPath);

    const buffer = await fs.promises.readFile(filePath);
    const content = buffer.toString();

    const minified = luamin.minify(content);

    await fs.promises.writeFile(filePath, minified);
  });

program
  .command('pack')
  .description('Create a .love file from a folder.')
  .argument('<string>', 'The source folder')
  .argument('<string>', 'The output .love path')
  .action(async (source, destination) => {
    const outPath = path.join(process.cwd(), destination);
    const output = fs.createWriteStream(outPath);

    const archive = archiver('zip');
    archive.pipe(output);

    archive.directory(source, false);
    archive.finalize();
  });

program.parse();
