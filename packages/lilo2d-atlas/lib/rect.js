"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rect = void 0;
class Rect {
    constructor(x, y, width, height, name = '') {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.name = name;
    }
    clone() {
        return new Rect(this.x, this.y, this.width, this.height, this.name);
    }
    area() {
        return this.width * this.height;
    }
}
exports.Rect = Rect;
