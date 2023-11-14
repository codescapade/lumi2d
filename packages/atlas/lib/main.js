"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const j_toml_1 = __importDefault(require("@ltd/j-toml"));
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const atlas_1 = require("./atlas");
const save_1 = require("./save");
function run() {
    const args = process.argv;
    if (args.length === 3 && args[2] === 'init') {
        const templatePath = path_1.default.join(require.main.path, '../template/template.toml');
        const destination = path_1.default.join(process.cwd(), 'atlas.toml');
        (0, fs_1.copyFileSync)(templatePath, destination);
        return;
    }
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
    const fullPath = path_1.default.join(process.cwd(), configPath);
    const dir = path_1.default.dirname(fullPath);
    if (!(0, fs_1.existsSync)(fullPath)) {
        process.stdout.write(`${fullPath} does not exist.\n`);
        return;
    }
    process.chdir(dir);
    const tomlString = (0, fs_1.readFileSync)(fullPath).toString();
    const atlasConfig = j_toml_1.default.parse(tomlString);
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
        const atlas = new atlas_1.Atlas(config);
        if (!atlas.pack()) {
            process.stdout.write(`Unable to pack atlas ${config.name}.\n`);
            continue;
        }
        const saveFolder = path_1.default.join(process.cwd(), config.saveFolder);
        if (!(0, fs_1.existsSync)(saveFolder)) {
            (0, fs_1.mkdirSync)(saveFolder, { recursive: true });
        }
        (0, save_1.saveAtlasImage)(config.name, saveFolder, atlas);
        if (!config.noData) {
            (0, save_1.saveJsonData)(config.name, saveFolder, atlas);
        }
    }
}
run();
