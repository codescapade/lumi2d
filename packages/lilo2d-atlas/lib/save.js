"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveJsonData = exports.saveAtlasImage = void 0;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const pngjs_1 = require("pngjs");
function saveAtlasImage(name, saveFolder, atlas) {
    const path = path_1.default.join(saveFolder, `${name}.png`);
    if (atlas.packedImage) {
        const buffer = pngjs_1.PNG.sync.write(atlas.packedImage.pngData, { colorType: 6 });
        (0, fs_1.writeFileSync)(path, buffer);
    }
}
exports.saveAtlasImage = saveAtlasImage;
function saveJsonData(name, saveFolder, atlas) {
    const frames = [];
    for (const rect of atlas.packedRects) {
        const image = atlas.images.get(rect.name);
        if (image) {
            frames.push({
                filename: rect.name,
                frame: {
                    x: rect.x + Number(image.extrude),
                    y: rect.y + Number(image.extrude),
                    w: rect.width - Number(image.extrude) * 2,
                    h: rect.height - Number(image.extrude) * 2,
                },
                rotated: false,
                trimmed: image.trimmed,
                spriteSourceSize: {
                    x: image.sourceX,
                    y: image.sourceY,
                    w: image.sourceWidth,
                    h: image.sourceHeight,
                },
                sourceSize: {
                    w: image.sourceWidth,
                    h: image.sourceHeight,
                },
            });
        }
    }
    const path = path_1.default.join(saveFolder, `${name}.json`);
    const content = JSON.stringify({ frames: frames }, null, 2);
    (0, fs_1.writeFileSync)(path, content);
}
exports.saveJsonData = saveJsonData;
