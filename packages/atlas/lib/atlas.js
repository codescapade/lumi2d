"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Atlas = void 0;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const pngjs_1 = require("pngjs");
const image_1 = require("./image");
const packer_1 = require("./packer");
const rect_1 = require("./rect");
class Atlas {
    constructor(config) {
        this.packedRects = [];
        this.images = new Map();
        this.rects = [];
        this.imagePaths = [];
        this.errorFound = false;
        this.config = config;
        if (config.folders) {
            for (const folder of config.folders) {
                const fullPath = path_1.default.join(process.cwd(), folder);
                if ((0, fs_1.existsSync)(fullPath) && (0, fs_1.lstatSync)(fullPath).isDirectory()) {
                    const paths = this.getAllImagesPathsFromFolder(fullPath);
                    this.imagePaths = this.imagePaths.concat(paths);
                }
                else {
                    process.stdout.write(`Error: folder ${fullPath} does not exist.\n`);
                }
            }
        }
        if (config.files) {
            for (const file of config.files) {
                const fullPath = path_1.default.join(process.cwd(), file);
                const imagePath = this.getFullImagePath(fullPath);
                if (imagePath) {
                    this.imagePaths.push(imagePath);
                }
            }
        }
        if (this.imagePaths.length === 0) {
            this.errorFound = true;
            process.stdout.write('No images to pack.\n');
            return;
        }
        let duplicates = false;
        const names = [];
        for (const path of this.imagePaths) {
            const name = config.folderInName ? `${path.folderName}_${path.fileName}` : path.fileName;
            if (names.includes(name)) {
                duplicates = true;
                process.stdout.write(`Error: "${name}" already exists. Cannot have duplicate names.\n`);
                continue;
            }
            else {
                names.push(name);
            }
            const image = image_1.Image.fromFile(path.fullPath, config.trimmed ?? true, config.extrude ?? 0);
            this.images.set(name, image);
            this.rects.push(new rect_1.Rect(0, 0, image.width, image.height, name));
        }
        if (duplicates) {
            process.stdout.write('Error: Duplicate image names found. Try using the "folderInName" config option.\n');
            this.errorFound = true;
        }
    }
    pack() {
        if (this.errorFound) {
            return false;
        }
        const packer = new packer_1.Packer(this.rects, this.config.packMethod ?? 'optimal', this.config.maxWidth ?? 4096, this.config.maxHeight ?? 4096);
        if (!packer.pack()) {
            return false;
        }
        if (!packer.smallestBounds) {
            return false;
        }
        this.packedImage = new image_1.Image(packer.smallestBounds.width, packer.smallestBounds.height);
        for (const rect of packer.smallestLayout) {
            const img = this.images.get(rect.name);
            if (img) {
                pngjs_1.PNG.bitblt(img.pngData, this.packedImage.pngData, 0, 0, img.width, img.height, rect.x, rect.y);
            }
        }
        this.packedRects = packer.smallestLayout;
        process.stdout.write(`Atlas "${this.config.name}" has been packed.\n`);
        return true;
    }
    getAllImagesPathsFromFolder(path) {
        const imagePaths = [];
        for (const file of (0, fs_1.readdirSync)(path)) {
            const fullPath = path_1.default.join(path, file);
            if ((0, fs_1.lstatSync)(fullPath).isFile()) {
                const imagePath = this.getFullImagePath(fullPath);
                if (imagePath) {
                    imagePaths.push(imagePath);
                }
            }
        }
        return imagePaths;
    }
    getFullImagePath(path) {
        if (path_1.default.extname(path) === '.png') {
            const folders = path_1.default.dirname(path).split(path_1.default.sep);
            const folder = folders[folders.length - 1];
            return {
                fullPath: path,
                folderName: folder,
                fileName: path_1.default.basename(path, path_1.default.extname(path)),
            };
        }
        else {
            process.stdout.write(`${path} is not a png image.\n`);
            return null;
        }
    }
}
exports.Atlas = Atlas;
