import { CTilemapLayer } from '../components/cTilemap';
import { Rectangle } from '../math';
import { LdtkLayer } from './ldtk/ldtkLayer';

/** @noSelf */
export class TilemapColliders {
  static generateFromGenericTiles(
    tiles: number[][],
    worldX: number,
    worldY: number,
    tileSize: number,
    collisionTileIds: number[]
  ): Rectangle[] {
    const collisionTiles: CollisionTile[][] = [];

    for (let y = 0; y < tiles.length; y++) {
      const row: CollisionTile[] = [];
      for (let x = 0; x < tiles[0].length; x++) {
        const id = tiles[y][x];
        row.push({ id, checked: false });
      }
      collisionTiles.push(row);
    }

    return TilemapColliders.generateColliders(collisionTiles, worldX, worldY, tileSize, collisionTileIds);
  }

  static generateFromCTilemapLayer(
    layer: CTilemapLayer,
    worldX: number,
    worldY: number,
    collisionTileIds: number[]
  ): Rectangle[] {
    return TilemapColliders.generateFromGenericTiles(
      layer.tiles,
      worldX,
      worldY,
      layer.tileset.tileWidth,
      collisionTileIds
    );
  }

  static generateFromLdtkLayer(
    layer: LdtkLayer,
    worldX: number,
    worldY: number,
    collisionTileIds: number[]
  ): Rectangle[] {
    const tiles: CollisionTile[][] = [];
    const tileSize = layer.tileset!.tileWidth;

    for (let y = 0; y < layer.getHeight(); y++) {
      const row: CollisionTile[] = [];
      for (let x = 0; x < layer.getWidth(); x++) {
        const tile = layer.getTile(x, y);
        row.push({ id: tile!.id, checked: false });
      }
      tiles.push(row);
    }

    return TilemapColliders.generateColliders(tiles, worldX, worldY, tileSize, collisionTileIds);
  }

  private static isColliderTile(id: number, collisionIds: number[]): boolean {
    if (collisionIds.length === 0) {
      return id !== -1;
    }

    return collisionIds.includes(id);
  }

  private static generateColliders(
    tiles: CollisionTile[][],
    worldX: number,
    worldY: number,
    tileSize: number,
    collisionIds: number[]
  ): Rectangle[] {
    const colliders: Rectangle[] = [];
    let startX = 0;
    let startY = 0;
    let currentX = 0;
    let currentY = 0;
    let checking = false;
    let foundLastY = false;

    for (let x = 0; x < tiles[0].length; x++) {
      for (let y = 0; y < tiles.length; y++) {
        let tile = tiles[y][x];

        if (!tile.checked && TilemapColliders.isColliderTile(tile.id, collisionIds)) {
          tile.checked = true;
          startX = x;
          startY = y;
          currentX = x;
          currentY = y;
          checking = true;
          foundLastY = false;

          while (checking) {
            if (foundLastY) {
              currentX++;
              if (currentX >= tiles[0].length) {
                checking = false;
                currentX--;
                break;
              }

              for (let i = startY; i <= currentY; i++) {
                tile = tiles[i][currentX];
                if (tile.checked || !TilemapColliders.isColliderTile(tile.id, collisionIds)) {
                  currentX--;
                  checking = false;
                } else {
                  tile.checked = true;
                }

                if (!checking) {
                  break;
                }
              }

              if (!checking) {
                for (let i = startY; i <= currentY; i++) {
                  tiles[i][currentX + 1].checked = false;
                }
              }
            } else {
              currentY++;
              if (currentY >= tiles.length) {
                foundLastY = true;
                currentY--;
              } else {
                tile = tiles[currentY][currentX];
                if (tile.checked || !TilemapColliders.isColliderTile(tile.id, collisionIds)) {
                  currentY--;
                  foundLastY = true;
                } else {
                  tile.checked = true;
                }
              }
            }
          }

          const distX = currentX - startX + 1;
          const distY = currentY - startY + 1;
          const xPos = worldX + startX * tileSize;
          const yPos = worldY + startY * tileSize;
          colliders.push(new Rectangle(xPos, yPos, tileSize * distX, tileSize * distY));
        }
      }
    }

    return colliders;
  }
}

interface CollisionTile {
  id: number;
  checked: boolean;
}
