import TOML from '@ltd/j-toml';
import { copyFileSync, existsSync, mkdirSync, readFileSync } from 'fs';
import Path from 'path';

import { Atlas } from './atlas';
import { AtlasConfig } from './config';
import { saveAtlasImage, saveJsonData } from './save';

// Pack the images into atlases based on the config provided.
function run(): void {
  const args = process.argv;

  if (args.length === 3 && args[2] === 'init') {
    const templatePath = Path.join(require.main.path, '../template/template.toml');
    const destination = Path.join(process.cwd(), 'atlas.toml');

    copyFileSync(templatePath, destination);
    return;
  }

  // Get the .toml file if specified
  let configPath = 'atlas.toml';
  let projectIndex = args.indexOf('--project');
  if (projectIndex === -1) {
    projectIndex = args.indexOf('-p');
  }

  if (projectIndex !== -1) {
    if (args.length - 1 >= projectIndex + 1) {
      configPath = args[projectIndex + 1];
    }
  }

  if (!configPath.endsWith('.toml')) {
    process.stdout.write('No .toml path config provided.\n');
    return;
  }

  const fullPath = Path.join(process.cwd(), configPath);
  const dir = Path.dirname(fullPath);
  if (!existsSync(fullPath)) {
    process.stdout.write(`${fullPath} does not exist.\n`);
    return;
  }

  // Set the working directory to the folder of the .toml file to make it easier to get relative paths for the images.
  process.chdir(dir);

  // Load the atlas.json config data.
  const tomlString = readFileSync(fullPath).toString();
  const atlasConfig: AtlasConfig = TOML.parse(tomlString) as unknown as AtlasConfig;

  // Create the atlases for each config in the file.
  for (const config of atlasConfig.atlas) {
    if (config.extrude) {
      config.extrude = Number(config.extrude);
    }
    if (config.maxWidth) {
      config.maxWidth = Number(config.maxWidth);
    }
    if (config.maxHeight) {
      config.maxHeight = Number(config.maxHeight);
    }

    const atlas = new Atlas(config);

    if (!atlas.pack()) {
      process.stdout.write(`Unable to pack atlas ${config.name}.\n`);
      continue;
    }

    // Create the save folder if it does not exist.
    const saveFolder = Path.join(process.cwd(), config.saveFolder);
    if (!existsSync(saveFolder)) {
      mkdirSync(saveFolder, { recursive: true });
    }

    saveAtlasImage(config.name, saveFolder, atlas);

    if (!config.noData) {
      saveJsonData(config.name, saveFolder, atlas);
    }
  }
}

run();
