import { Rectangle } from '../math';
import { LdtkLayer, LdtkTile } from '../tilemap';

/**
 * Component to render Ldtk tilemaps.
 */
export class CLdtkTilemap {
  /**
   * The tilemap layers.
   */
  layers: LdtkLayer[] = [];

  /**
   * Table to easily get a layer by id.
   */
  private layerMap = new LuaTable<string, LdtkLayer>();

  /**
   * Create a new LdtkTilemap component.
   * @param layers Layers to add to the component.
   */
  constructor(layers?: LdtkLayer[]) {
    if (layers) {
      for (const layer of layers) {
        this.addLayer(layer);
      }
    }
  }

  /**
   * Add a new layer to the component. Will render on top.
   * @param layer The layer to add.
   */
  addLayer(layer: LdtkLayer): void {
    const clone = layer.clone();
    if (clone.tileset) {
      clone.updateVisibleTiles(
        new Rectangle(0, 0, clone.getWidth() * clone.tileset.tileWidth, clone.getHeight() * clone.tileset.tileHeight)
      );
    }

    this.layers.push(clone);
    this.layerMap.set(clone.id, clone);
  }

  /**
   * Remove a layer from the component using the id.
   * @param layerId The layer id to remove.
   */
  removeLayer(layerId: string): void {
    this.layerMap.delete(layerId);
    const index = this.layers.findIndex((layer) => layer.id === layerId);
    if (index !== -1) {
      this.layers.splice(index, 1);
    }
  }

  /**
   * Draw the tilemap layers.
   * @param x The x offset in pixels.
   * @param y The y offset in pixels.
   */
  draw(x: number, y: number): void {
    for (const layer of this.layers) {
      layer.draw(x, y);
    }
  }

  /**
   * Get a layer from this component.
   * @param id The id of the layer.
   * @returns The layer.
   */
  getLayer(id: string): LdtkLayer {
    return this.layerMap.get(id);
  }

  /**
   * Get a tile on a layer in the component.
   * @param layerId The id if the layer.
   * @param x The x position in tiles.
   * @param y The y position in tiles.
   * @returns The tile if it exists.
   */
  getTile(layerId: string, x: number, y: number): LdtkTile | undefined {
    if (this.layerMap.has(layerId)) {
      return this.layerMap.get(layerId).getTile(x, y);
    }

    return undefined;
  }

  /**
   * Update a tile in a layer.
   * @param layerId The layer to update.
   * @param x The x position in tiles.
   * @param y The y position in tiles.
   * @param tileId The tile id in the tileset.
   * @param flipX If true flipped horizontally.
   * @param flipY If true flipped vertically.
   */
  updateTile(layerId: string, x: number, y: number, tileId: number, flipX?: boolean, flipY?: boolean): void {
    if (this.layerMap.has(layerId)) {
      this.layerMap.get(layerId).setTile(x, y, tileId, flipX, flipY);
    }
  }

  /**
   * Set the bounds for visible tiles. The bounds are in pixels.
   * @param bounds The bounds to render.
   */
  updateVisibleTiles(bounds: Rectangle): void {
    for (const layer of this.layers) {
      layer.updateVisibleTiles(bounds);
    }
  }
}
