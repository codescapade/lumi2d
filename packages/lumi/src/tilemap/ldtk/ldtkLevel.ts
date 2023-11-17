import { Tileset } from '../tileset';
import { LevelJson } from './ldtkJson';
import { LdtkLayer } from './ldtkLayer';

export class LdtkLevel {
  worldX: number;
  worldY: number;
  width: number;
  height: number;
  externalRelPath?: string;
  private layers = new LuaTable<string, LdtkLayer>();

  constructor(levelData: LevelJson, tilesets: LuaTable<number, Tileset>) {
    this.worldX = levelData.worldX;
    this.worldY = levelData.worldY;
    this.width = levelData.pxWid;
    this.height = levelData.pxHei;
    this.externalRelPath = levelData.externalRelPath;

    if (levelData.layerInstances) {
      for (const layer of levelData.layerInstances) {
        let tileset: Tileset | undefined = undefined;
        if (layer.__tilesetDefUid) {
          tileset = tilesets.get(layer.__tilesetDefUid);
        }
        this.layers.set(layer.__identifier, new LdtkLayer(layer, tileset));
      }
    }
  }

  getLayer(name: string): LdtkLayer {
    return this.layers.get(name);
  }
}
