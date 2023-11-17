import { Json } from '../lib';

export class TiledMap {
  width: number;
  height: number;
  tileLayers = new LuaTable<string, number[][]>();
  objectLayers = new LuaTable<string, TiledObject[]>();

  constructor(data: string) {
    const mapData: TileMapData = Json.decode(data);
    this.width = mapData.width;
    this.height = mapData.height;

    for (const layer of mapData.layers) {
      if (layer.type === 'tilelayer') {
        const tiles = this.layerDataTo2dArray(layer.data, layer.width, layer.height);
        this.tileLayers.set(layer.name, tiles);
      } else if (layer.type === 'objectgroup') {
        const objects: TiledObject[] = [];
        for (const obj of layer.objects) {
          const tiledProps: TiledObjectProp[] = [];
          if (obj.properties !== null) {
            for (const prop of obj.properties) {
              tiledProps.push({ name: prop.name, type: prop.type, value: prop.value });
            }
          }

          const object = new TiledObject(
            obj.id,
            obj.x,
            obj.y,
            obj.width,
            obj.height,
            obj.name,
            obj.type,
            obj.rotation,
            obj.visible,
            tiledProps,
            obj.polygon
          );
          objects.push(object);
        }
        this.objectLayers.set(layer.name, objects);
      }
    }
  }

  private layerDataTo2dArray(data: number[], width: number, height: number): number[][] {
    let y = 0;
    let pos = 0;
    const map: number[][] = [];

    while (y < height) {
      const row: number[] = [];
      for (let x = 0; x < width; x++) {
        row.push(data[pos] - 1);
        pos++;
      }
      map.push(row);
      y++;
    }

    return map;
  }
}

export interface TiledLayer {
  data: number[];
  objects: TiledObject[];
  type: 'tilelayer' | 'objectgroup';
  width: number;
  height: number;
  name: string;
}

export interface TileMapData {
  width: number;
  height: number;
  layers: TiledLayer[];
}

export class TiledObject {
  constructor(
    public id: number,
    public x: number,
    public y: number,
    public width: number,
    public height: number,
    public name: string,
    public type: string,
    public rotation: number,
    public visible: boolean,
    public properties: TiledObjectProp[] = [],
    public polygon: TiledPoint[] = []
  ) {}
}

export interface TiledObjectProp {
  name: string;
  type: string;
  value: unknown;
}

export interface TiledPoint {
  x: number;
  y: number;
}

export interface TiledTileset {
  name: string;
  image: string;
  margin: number;
  spacing: number;
  tilewidth: number;
  tileheight: number;
}
