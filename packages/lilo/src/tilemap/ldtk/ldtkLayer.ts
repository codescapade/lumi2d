import { Bit } from '../../lib';
import { LiloMath, Rectangle } from '../../math';
import { Tileset } from '../tileset';
import { LdtkEntity } from './ldtkEntity';
import { LayerInstanceJson, LayerType, Tile } from './ldtkJson';
import { LdtkTile } from './ldtkTile';

export class LdtkLayer {
  type: LayerType;
  tileset?: Tileset;
  id: string;
  tiles: LdtkTile[][];
  entities: LuaTable<string, LdtkEntity[]>;
  visibleBounds: Rectangle;

  constructor(layerJson?: LayerInstanceJson, tileset?: Tileset) {
    this.tileset = tileset;
    this.entities = new LuaTable<string, LdtkEntity[]>();
    this.tiles = [];
    this.visibleBounds = new Rectangle();

    if (layerJson) {
      this.type = layerJson.__type;
      this.id = layerJson.__identifier;

      if (this.type === 'Tiles') {
        this.tilesFromTileLayer(layerJson);
      } else if (this.type === 'Entities') {
        this.addEntities(layerJson);
      } else {
        this.tilesFromAutoLayer(layerJson);
      }
    } else {
      this.type = 'AutoLayer';
      this.id = 'Empty';
    }
  }

  draw(xPos: number, yPos: number): void {
    for (let y = this.visibleBounds.y; y < this.visibleBounds.height; y++) {
      for (let x = this.visibleBounds.x; x < this.visibleBounds.width; x++) {
        const tile = this.tiles[y][x];
        if (!tile.isEmpty() && this.tileset) {
          const quad = this.tileset.getQuad(tile.id);
          const totalX = xPos + x * tile.size + tile.getXOffset();
          const totalY = yPos + y * tile.size + tile.getYOffset();
          love.graphics.draw(this.tileset.image, quad, totalX, totalY);
        }
      }
    }
  }

  getTile(x: number, y: number): LdtkTile | undefined {
    if (x < 0 || x >= this.tiles[0].length || y < 0 || y >= this.tiles.length) {
      return;
    }
    return this.tiles[y][x];
  }

  setTile(x: number, y: number, tileId: number, flipX?: boolean, flipY?: boolean): void {
    if (x < 0 || x >= this.tiles[0].length || y < 0 || y >= this.tiles.length) {
      return;
    }
    this.tiles[y][x].set(tileId, flipX || false, flipY || false);
  }

  clone(): LdtkLayer {
    const layer = new LdtkLayer();
    layer.tileset = this.tileset;
    layer.type = this.type;
    layer.id = this.id;

    for (const key in this.entities) {
      const list = this.entities.get(key);
      const entities: LdtkEntity[] = [];

      for (const entity of list) {
        entities.push(entity.clone());
      }
      layer.entities.set(key, entities);
    }

    for (let y = 0; y < this.tiles.length; y++) {
      const row: LdtkTile[] = [];
      for (let x = 0; x < this.tiles[0].length; x++) {
        const tile = this.tiles[y][x];
        if (tile != null) {
          row.push(tile.clone());
        }
      }
      layer.tiles.push(row);
    }

    return layer;
  }

  getEntitiesByName(name: string): LdtkEntity[] {
    if (this.entities && this.entities.has(name)) {
      return this.entities.get(name);
    }

    return [];
  }

  pixelToTilePosition(xPos: number, yPos: number): LuaMultiReturn<[number, number]> {
    if (this.tileset) {
      const x = math.floor(xPos / this.tileset.tileWidth);
      const y = math.floor(yPos / this.tileset.tileHeight);

      return $multi(x, y);
    }

    return $multi(0, 0);
  }

  updateVisibleTiles(bounds: Rectangle): void {
    let [tlX, tlY] = this.pixelToTilePosition(bounds.x, bounds.y);
    tlX -= 1;
    tlY -= 1;
    tlX = LiloMath.clamp(tlX, 0, this.getWidth());
    tlY = LiloMath.clamp(tlY, 0, this.getHeight());

    let [brX, brY] = this.pixelToTilePosition(bounds.x + bounds.width, bounds.y + bounds.height);
    brX += 2;
    brY += 2;
    brX = LiloMath.clamp(brX, 0, this.getWidth());
    brY = LiloMath.clamp(brY, 0, this.getHeight());
    this.visibleBounds.set(tlX, tlY, brX, brY);
  }

  getWidth(): number {
    if (this.tiles.length > 0) {
      return this.tiles[0].length;
    }

    return 0;
  }

  getHeight(): number {
    return this.tiles.length;
  }

  private createEmptyTiles(width: number, height: number, tileSize: number): void {
    for (let y = 0; y < height; y++) {
      const row: LdtkTile[] = [];
      for (let x = 0; x < width; x++) {
        row.push(new LdtkTile(-1, false, false, tileSize));
      }
      this.tiles.push(row);
    }
  }

  private insertTiles(tileList: Tile[], tileSize: number): void {
    for (const tile of tileList) {
      const flipX = Bit.band(tile.f, 1) !== 0;
      const flipY = Bit.band(tile.f, 2) !== 0;
      const x = math.floor(tile.px[0] / tileSize);
      const y = math.floor(tile.px[1] / tileSize);
      this.tiles[y][x].set(tile.t, flipX, flipY);
    }
  }

  private addEntities(layerJson: LayerInstanceJson): void {
    for (const entityJson of layerJson.entityInstances) {
      const name = entityJson.__identifier;
      const entity = new LdtkEntity(entityJson);
      if (this.entities.has(name)) {
        this.entities.get(name).push(entity);
      } else {
        this.entities.set(name, []);
        this.entities.get(name).push(entity);
      }
    }
  }

  private tilesFromTileLayer(layerJson: LayerInstanceJson): void {
    this.createEmptyTiles(layerJson.__cWid, layerJson.__cHei, layerJson.__gridSize);
    this.insertTiles(layerJson.gridTiles, layerJson.__gridSize);
  }

  private tilesFromAutoLayer(layerJson: LayerInstanceJson): void {
    this.createEmptyTiles(layerJson.__cWid, layerJson.__cHei, layerJson.__gridSize);
    this.insertTiles(layerJson.autoLayerTiles, layerJson.__gridSize);
  }
}
