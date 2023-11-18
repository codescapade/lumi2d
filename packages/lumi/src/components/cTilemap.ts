import { Color } from '../graphics';
import { LumiMath, Rectangle } from '../math';
import { Tileset } from '../tilemap';

/**
 * Tilemap component.
 */
export class CTilemap {
  /**
   * The layers to draw.
   */
  layers: CTilemapLayer[] = [];

  /**
   * Tint for the whole tilemap.
   */
  color = Color.WHITE.clone();

  /**
   * Table to easily get a layer by name.
   */
  private layerMap = new LuaTable<string, CTilemapLayer>();

  /**
   * The bounds of tiles that will be drawn.
   */
  private visibleBounds = new Rectangle();

  /**
   * Create a new tilemap component.
   * @param layers The layers to draw.
   */
  constructor(layers?: CTilemapLayer[]) {
    if (layers) {
      for (const layer of layers) {
        this.addLayer(layer);
      }
    }
  }

  /**
   * Add a new layer to the tilemap. Will be added on top.
   * @param layer The layer to add.
   */
  addLayer(layer: CTilemapLayer): void {
    this.layers.push(layer);
    this.layerMap.set(layer.name, layer);
    const [width, height] = this.getSizeInPixels();
    this.updateVisibleTiles(new Rectangle(0, 0, width, height));
  }

  /**
   * Remove a layer from the tilemap.
   * @param name The name of the layer to remove.
   */
  removeLayer(name: string): void {
    this.layerMap.delete(name);
    const index = this.layers.findIndex((layer) => {
      return layer.name === name;
    });

    if (index !== -1) {
      this.layers.splice(index, 1);
    }
  }

  /**
   * Get the tile id of a position in the tilemap.
   * @param layerName The layer to get the tile from.
   * @param x The x position in tiles.
   * @param y The y position in tiles.
   * @returns The tile id.
   */
  getTitle(layerName: string, x: number, y: number): number {
    const [width, height] = this.getSizeInTiles();
    if (x < 0 || x >= width || y < 0 || y >= height) {
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

  /**
   * Set the tile id of a position in the tilemap.
   * @param layerName The layer to set the tile in.
   * @param x The x position in tiles.
   * @param y The y position in tiles.
   * @param newId The new tile id
   */
  setTile(layerName: string, x: number, y: number, newId: number): void {
    const [width, height] = this.getSizeInTiles();
    if (x < 0 || x >= width || y < 0 || y >= height) {
      print(`tile position is out of bounds x: ${x}, y: ${y}`);
      return;
    }

    const layer = this.layerMap.get(layerName);
    if (layer !== undefined) {
      layer.tiles[y][x] = newId;
    } else {
      print(`tilemap layer "${layerName}" does not exist.`);
    }
  }

  /**
   * Draw the tilemap.
   * @param xPos The x offset in pixels.
   * @param yPos The y offset in pixels.
   */
  draw(xPos: number, yPos: number): void {
    for (const layer of this.layers) {
      const tiles = layer.tiles;
      const tileset = layer.tileset;
      for (let y = this.visibleBounds.y; y < this.visibleBounds.height; y++) {
        for (let x = this.visibleBounds.x; x < this.visibleBounds.width; x++) {
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

  /**
   * Convert a pixel position to a tile position.
   * @param xPos The x position in pixels.
   * @param yPos The y position in pixels.
   * @returns The x and y position in tiles.
   */
  pixelToTilePosition(xPos: number, yPos: number): LuaMultiReturn<[number, number]> {
    if (this.layers.length > 0) {
      const tileset = this.layers[0].tileset;
      const x = math.floor(xPos / tileset.tileWidth);
      const y = math.floor(yPos / tileset.tileHeight);

      return $multi(x, y);
    }

    return $multi(0, 0);
  }

  /**
   * Set new draw bounds for the visible tiles. Only these tiles will be drawn.
   * @param bounds The new bounds in pixels.
   */
  updateVisibleTiles(bounds: Rectangle): void {
    const [width, height] = this.getSizeInTiles();

    let [tlX, tlY] = this.pixelToTilePosition(bounds.x, bounds.y);
    tlX -= 1;
    tlY -= 1;
    tlX = LumiMath.clamp(tlX, 0, width);
    tlY = LumiMath.clamp(tlY, 0, height);

    let [brX, brY] = this.pixelToTilePosition(bounds.x + bounds.width, bounds.y + bounds.height);
    brX += 2;
    brY += 2;
    brX = LumiMath.clamp(brX, 0, width);
    brY = LumiMath.clamp(brY, 0, height);
    this.visibleBounds.set(tlX, tlY, brX, brY);
  }

  /**
   * Get the width and height of the tilemap in tiles.
   * @returns The width and height.
   */
  getSizeInTiles(): LuaMultiReturn<[number, number]> {
    const width = this.layers.length > 0 ? this.layers[0].tiles[0].length : 0;
    const height = this.layers.length > 0 ? this.layers[0].tiles.length : 0;

    return $multi(width, height);
  }

  /**
   * Get the width and height of the tilemap in pixels.
   * @returns The width and height.
   */
  getSizeInPixels(): LuaMultiReturn<[number, number]> {
    const width =
      this.layers.length > 0 && this.layers[0].tileset !== undefined
        ? this.layers[0].tiles[0].length * this.layers[0].tileset.tileWidth
        : 0;

    const height =
      this.layers.length > 0 && this.layers[0].tileset !== undefined
        ? this.layers[0].tiles.length * this.layers[0].tileset.tileWidth
        : 0;

    return $multi(width, height);
  }
}

/**
 * A layer in the tilemap component.
 */
export type CTilemapLayer = {
  /**
   * The name to get and set tiles.
   */
  name: string;
  /**
   * The tiles in the map.
   */
  tiles: number[][];
  /**
   * The tileset to use for drawing.
   */
  tileset: Tileset;
};
