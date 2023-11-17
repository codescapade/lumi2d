import { Color } from '../graphics';
import { Tileset } from '../tilemap';

export class CTilemap {
  layers: CTilemapLayer[] = [];
  layerMap = new LuaTable<string, CTilemapLayer>();
  color = Color.WHITE.clone();

  constructor(layers?: CTilemapLayer[]) {
    if (layers) {
      for (const layer of layers) {
        this.addLayer(layer);
      }
    }
  }

  addLayer(layer: CTilemapLayer): void {
    this.layers.push(layer);
    this.layerMap.set(layer.name, layer);
  }

  removeLayer(name: string): void {
    this.layerMap.delete(name);
    const index = this.layers.findIndex((layer) => {
      return layer.name === name;
    });

    if (index !== -1) {
      this.layers.splice(index, 1);
    }
  }

  getTitle(layerName: string, x: number, y: number): number {
    if (x < 0 || x >= this.getWidthInTiles() || y < 0 || y >= this.getHeightInTiles()) {
      print(`tile position is out of bounds x: ${x}, y: ${y}`);
      return -1;
    }

    const layer = this.layerMap.get(layerName);
    if (layer !== undefined) {
      return layer.tiles[y][x];
    } else {
      print(`tilemap layer "${layerName}" does not exist.`);
      return -1;
    }
  }

  setTile(layerName: string, x: number, y: number, newIndex: number): void {
    if (x < 0 || x >= this.getWidthInTiles() || y < 0 || y >= this.getHeightInTiles()) {
      print(`tile position is out of bounds x: ${x}, y: ${y}`);
      return;
    }

    const layer = this.layerMap.get(layerName);
    if (layer !== undefined) {
      layer.tiles[y][x] = newIndex;
    } else {
      print(`tilemap layer "${layerName}" does not exist.`);
    }
  }

  draw(xPos: number, yPos: number): void {
    for (const layer of this.layers) {
      const tiles = layer.tiles;
      const tileset = layer.tileset;
      for (let y = 0; y < tiles.length; y++) {
        for (let x = 0; x < tiles[0].length; x++) {
          const tile = tiles[y][x];
          if (tile >= 0) {
            love.graphics.draw(
              tileset.image,
              tileset.getQuad(tile),
              xPos + x * tileset.tileWidth,
              yPos + y * tileset.tileHeight
            );
          }
        }
      }
    }
  }

  getWidthInTiles(): number {
    if (this.layers.length === 0) {
      return 0;
    }

    return this.layers[0].tiles[0].length;
  }

  getHeightInTiles(): number {
    if (this.layers.length === 0) {
      return 0;
    }

    return this.layers[0].tiles.length;
  }

  getWidthInPixels(): number {
    if (this.layers.length === 0 || this.layers[0].tileset === undefined) {
      return 0;
    }

    return this.layers[0].tiles[0].length * this.layers[0].tileset.tileWidth;
  }

  getHeightInPixels(): number {
    if (this.layers.length === 0 || this.layers[0].tileset === undefined) {
      return 0;
    }

    return this.layers[0].tiles.length * this.layers[0].tileset.tileWidth;
  }
}

export interface CTilemapLayer {
  name: string;
  tiles: number[][];
  tileset: Tileset;
}
