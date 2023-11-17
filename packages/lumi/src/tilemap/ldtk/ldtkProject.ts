import { Assets } from '../../assets';
import { Json } from '../../lib';
import { Tileset } from '../tileset';
import { LevelJson, ProjectJson } from './ldtkJson';
import { LdtkLevel } from './ldtkLevel';

export class LdtkProject {
  data: ProjectJson;
  hasExternalLevels: boolean;
  private levels = new LuaTable<string, LdtkLevel>();
  private tilesets = new LuaTable<number, Tileset>();
  private assets: typeof Assets;

  constructor(jsonData: string, assets: typeof Assets) {
    this.data = Json.decode(jsonData);
    this.assets = assets;
    this.hasExternalLevels = this.data.externalLevels;

    for (const tileset of this.data.defs.tilesets) {
      const image = assets.getImage(tileset.identifier);
      if (image !== undefined) {
        this.tilesets.set(
          tileset.uid,
          new Tileset(image, tileset.tileGridSize, tileset.tileGridSize, tileset.spacing, tileset.padding)
        );
      }
    }

    for (const level of this.data.levels) {
      this.levels.set(level.identifier, new LdtkLevel(level, this.tilesets));
    }
  }

  getLevel(name: string): LdtkLevel | undefined {
    if (this.hasExternalLevels) {
      print('Levels need to be loaded separately, because they are external files.');
      return;
    }

    return this.levels.get(name);
  }

  loadExternalLevel(name: string, projectFolder: string): LdtkLevel | undefined {
    const basicData = this.levels.get(name);
    if (basicData && basicData.externalRelPath) {
      const relativePath = basicData.externalRelPath;
      const fullPath = `${projectFolder}/${relativePath}`;
      const levelText = this.assets.loadText('level', fullPath, false);
      const levelData: LevelJson = Json.decode(levelText);

      return new LdtkLevel(levelData, this.tilesets);
    }

    return;
  }
}
