"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Image = void 0;
const fs_1 = __importDefault(require("fs"));
const pngjs_1 = require("pngjs");
const color_1 = require("./color");
class Image {
    get width() {
        return this._pngData.width;
    }
    get height() {
        return this._pngData.height;
    }
    get pngData() {
        return this._pngData;
    }
    static fromFile(path, trim, extrude) {
        const data = fs_1.default.readFileSync(path);
        const pngData = pngjs_1.PNG.sync.read(data);
        return new Image(pngData.width, pngData.height, pngData, trim, extrude);
    }
    constructor(width, height, pngData = null, trim = false, extrude = 0) {
        this.sourceWidth = width;
        this.sourceHeight = height;
        this.trimmed = trim;
        this.extrude = extrude;
        if (pngData) {
            this._pngData = new pngjs_1.PNG({ width, height });
            pngjs_1.PNG.bitblt(pngData, this._pngData, 0, 0, width, height, 0, 0);
            if (trim) {
                const [sourceX, sourceY] = this.trimTransparentPixels();
                this.sourceX = sourceX;
                this.sourceY = sourceY;
            }
            else {
                this.sourceX = 0;
                this.sourceY = 0;
            }
            if (extrude) {
                this.extrudeEdges(extrude);
            }
        }
        else {
            this._pngData = new pngjs_1.PNG({ width, height, fill: true });
            this.sourceX = 0;
            this.sourceY = 0;
        }
    }
    getPixels() {
        return this._pngData.data;
    }
    getPixel(x, y) {
        const start = (y * this.width + x) * 4;
        return new color_1.Color(this._pngData.data[start], this._pngData.data[start + 1], this._pngData.data[start + 2], this._pngData.data[start + 3]);
    }
    setPixel(x, y, color) {
        const start = (y * this.width + x) * 4;
        this._pngData.data[start] = color.red;
        this._pngData.data[start + 1] = color.green;
        this._pngData.data[start + 2] = color.blue;
        this._pngData.data[start + 3] = color.alpha;
    }
    extrudeEdges(amount) {
        const original = new Image(this.width, this.height, this._pngData);
        this._pngData = new pngjs_1.PNG({ width: this.width + amount * 2, height: this.height + amount * 2, fill: true });
        pngjs_1.PNG.bitblt(original._pngData, this._pngData, 0, 0, original.width, original.height, amount, amount);
        let color;
        for (let y = amount; y < original.height + amount; y++) {
            color = this.getPixel(amount, y);
            for (let x = 0; x < amount; x++) {
                this.setPixel(x, y, color);
            }
            color = this.getPixel(this.width - amount - 1, y);
            for (let x = this.width - amount - 1; x < this.width; x++) {
                this.setPixel(x, y, color);
            }
        }
        for (let x = amount; x < original.width + amount; x++) {
            color = this.getPixel(x, amount);
            for (let y = 0; y < amount; y++) {
                this.setPixel(x, y, color);
            }
            color = this.getPixel(x, this.height - amount - 1);
            for (let y = this.height - amount - 1; y < this.height; y++) {
                this.setPixel(x, y, color);
            }
        }
    }
    trimTransparentPixels() {
        const temp = new Image(this.width, this.height, this._pngData);
        let leftOffset = 0;
        let rightOffset = 0;
        let topOffset = 0;
        let bottomOffset = 0;
        for (let x = 0; x < this.width; x++) {
            if (!isColumnEmpty(temp, x)) {
                break;
            }
            leftOffset++;
        }
        for (let x = this.width - 1; x > 0; x--) {
            if (!isColumnEmpty(temp, x)) {
                break;
            }
            rightOffset++;
        }
        for (let y = 0; y < this.height; y++) {
            if (!isRowEmpty(temp, y)) {
                break;
            }
            topOffset++;
        }
        for (let y = this.height - 1; y > 0; y--) {
            if (!isRowEmpty(temp, y)) {
                break;
            }
            bottomOffset++;
        }
        const newWidth = temp.width - leftOffset - rightOffset;
        const newHeight = temp.height - topOffset - bottomOffset;
        this._pngData = new pngjs_1.PNG({ width: newWidth, height: newHeight, fill: true });
        pngjs_1.PNG.bitblt(temp._pngData, this._pngData, leftOffset, topOffset, newWidth, newHeight, 0, 0);
        return [leftOffset, topOffset];
    }
}
exports.Image = Image;
function isColumnEmpty(image, column) {
    for (let y = 0; y < image.height; y++) {
        if (image.getPixel(column, y).alpha !== 0) {
            return false;
        }
    }
    return true;
}
function isRowEmpty(image, row) {
    for (let x = 0; x < image.width; x++) {
        if (image.getPixel(x, row).alpha !== 0) {
            return false;
        }
    }
    return true;
}
