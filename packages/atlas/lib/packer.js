"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Packer = void 0;
const rect_1 = require("./rect");
class Packer {
    constructor(rects, packMethod, maxWidth, maxHeight) {
        this.smallestLayout = [];
        this.placedRects = [];
        this.gridRows = [];
        this.gridColumns = [];
        this.grid = [];
        this.placed = 0;
        this.biggestWidth = 0;
        this.rects = rects;
        this.packMethod = packMethod;
        this.maxWidth = maxWidth;
        this.maxHeight = maxHeight;
        this.sortRects();
        this.bounds = this.setStartBounds();
        this.resetPlacements();
    }
    pack() {
        if (this.packMethod === 'basic') {
            if (!this.packRectangles()) {
                process.stdout.write('Error: Unable to fit the images inside the bounds.\n');
                return false;
            }
            return true;
        }
        else {
            let success = true;
            let done = false;
            while (!done) {
                if (this.packRectangles()) {
                    this.bounds.width -= 1;
                    if (this.bounds.width < this.biggestWidth) {
                        done = true;
                    }
                    else {
                        this.resetPlacements();
                    }
                }
                else {
                    if (!this.smallestBounds) {
                        process.stdout.write('Error: Unable to fit the images inside the bounds.\n');
                        success = false;
                    }
                    done = true;
                }
            }
            return success;
        }
    }
    setStartBounds() {
        let boundsWidth = 0;
        let boundsHeight = 0;
        for (const rect of this.rects) {
            if (boundsHeight === 0 || rect.height > boundsHeight) {
                boundsHeight = rect.height;
            }
            boundsWidth += rect.width;
            if (this.biggestWidth === 0 || rect.width > this.biggestWidth) {
                this.biggestWidth = rect.width;
            }
        }
        if (boundsWidth > this.maxWidth) {
            boundsWidth = this.maxWidth;
        }
        return new rect_1.Rect(0, 0, boundsWidth, boundsHeight);
    }
    packRectangles() {
        while (this.placed < this.rects.length) {
            const rect = this.rects[this.placed];
            if (this.placeRect(rect)) {
                this.placedRects.push(rect);
                this.placed++;
            }
            else {
                this.bounds.height += rect.height;
                if (this.bounds.height > this.maxHeight) {
                    return false;
                }
                this.resetPlacements();
            }
        }
        let totalWidth = 0;
        for (let x = 0; x < this.gridColumns.length; x++) {
            for (let y = 0; y < this.gridRows.length; y++) {
                if (this.grid[y][x]) {
                    totalWidth += this.gridColumns[x];
                    break;
                }
            }
        }
        this.bounds.width = totalWidth;
        if (!this.smallestBounds || this.bounds.area() < this.smallestBounds.area()) {
            this.smallestBounds = this.bounds.clone();
            this.smallestLayout = [];
            for (const rect of this.placedRects) {
                this.smallestLayout.push(rect.clone());
            }
        }
        return true;
    }
    resetPlacements() {
        this.placedRects = [];
        this.placed = 0;
        this.grid = [[false]];
        this.gridColumns = [this.bounds.width];
        this.gridRows = [this.bounds.height];
    }
    placeRect(rect) {
        if (this.packMethod === 'basic') {
            for (let row = 0; row < this.gridRows.length; row++) {
                for (let column = 0; column < this.gridColumns.length; column++) {
                    if (!this.grid[row][column]) {
                        if (this.findPlace(column, row, rect)) {
                            return true;
                        }
                    }
                }
            }
        }
        else {
            for (let column = 0; column < this.gridColumns.length; column++) {
                for (let row = 0; row < this.gridRows.length; row++) {
                    if (!this.grid[row][column]) {
                        if (this.findPlace(column, row, rect)) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }
    findPlace(startColumn, startRow, rect) {
        let endColumn = startColumn;
        let endRow = startRow;
        let totalWidth = this.gridColumns[startColumn];
        let totalHeight = this.gridRows[startRow];
        while (endRow < this.gridRows.length) {
            if (this.grid[endRow][endColumn]) {
                return false;
            }
            if (totalHeight >= rect.height) {
                break;
            }
            endRow++;
            if (endRow < this.gridRows.length) {
                totalHeight += this.gridRows[endRow];
            }
        }
        if (endRow >= this.gridRows.length) {
            return false;
        }
        while (endColumn < this.gridColumns.length) {
            for (let y = startRow; y < endRow + 1; y++) {
                if (this.grid[y][endColumn]) {
                    return false;
                }
            }
            if (totalWidth >= rect.width) {
                break;
            }
            endColumn++;
            if (endColumn < this.gridColumns.length) {
                totalWidth += this.gridColumns[endColumn];
            }
        }
        if (endColumn >= this.gridColumns.length) {
            return false;
        }
        this.insertRect(totalWidth, totalHeight, startColumn, startRow, endColumn, endRow, rect);
        return true;
    }
    insertRect(totalWidth, totalHeight, startColumn, startRow, endColumn, endRow, rect) {
        const widthLeft = totalWidth - rect.width;
        const heightLeft = totalHeight - rect.height;
        if (heightLeft > 0) {
            this.gridRows[endRow] = this.gridRows[endRow] - heightLeft;
            this.gridRows.splice(endRow + 1, 0, heightLeft);
            this.insertRow(endRow + 1);
        }
        if (widthLeft > 0) {
            this.gridColumns[endColumn] = this.gridColumns[endColumn] - widthLeft;
            this.gridColumns.splice(endColumn + 1, 0, widthLeft);
            this.insertColumn(endColumn + 1);
        }
        for (let y = startRow; y < endRow + 1; y++) {
            for (let x = startColumn; x < endColumn + 1; x++) {
                this.grid[y][x] = true;
            }
        }
        let xPos = 0;
        for (let col = 0; col < startColumn; col++) {
            xPos += this.gridColumns[col];
        }
        let yPos = 0;
        for (let row = 0; row < startRow; row++) {
            yPos += this.gridRows[row];
        }
        rect.x = xPos;
        rect.y = yPos;
    }
    insertRow(index) {
        const copy = [...this.grid[index - 1]];
        this.grid.splice(index, 0, copy);
    }
    insertColumn(index) {
        for (const row of this.grid) {
            row.splice(index, 0, row[index - 1]);
        }
    }
    sortRects() {
        this.packMethod === 'basic' ? this.sortByName() : this.sortByHeight();
    }
    sortByHeight() {
        this.rects.sort((a, b) => {
            if (a.height > b.height) {
                return -1;
            }
            else if (a.height < b.height) {
                return 1;
            }
            return 0;
        });
    }
    sortByName() {
        this.rects.sort((a, b) => {
            if (a.name > b.name) {
                return 1;
            }
            else if (a.name < b.name) {
                return -1;
            }
            return 0;
        });
    }
}
exports.Packer = Packer;
