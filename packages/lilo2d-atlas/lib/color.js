"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Color = void 0;
class Color {
    constructor(red, green, blue, alpha) {
        this.red = Math.floor(red);
        this.green = Math.floor(green);
        this.blue = Math.floor(blue);
        this.alpha = Math.floor(alpha);
    }
    equals(other) {
        return (this.red === other.red && this.green === other.green && this.blue === other.blue && this.alpha === other.alpha);
    }
}
exports.Color = Color;
