import { Image, Quad } from 'love.graphics';

export class Tileset {
  image: Image;
  tileWidth: number;
  tileHeight: number;
  tiledImageName: string;

  private tiles: Quad[] = [];

  constructor(
    image: Image,
    tileWidth: number,
    tileHeight: number,
    spacing: number,
    margin: number,
    tiledImageName = ''
  ) {
    this.image = image;
    this.tileWidth = tileWidth;
    this.tileHeight = tileHeight;
    this.tiledImageName = tiledImageName;

    const width = image.getWidth();
    const height = image.getHeight();
    const horizontalTiles = math.floor((width - margin * 2 + spacing) / (tileWidth + spacing));
    const verticalTiles = math.floor((height - margin * 2 + spacing) / (tileHeight + spacing));

    for (let y = 0; y < verticalTiles; y++) {
      for (let x = 0; x < horizontalTiles; x++) {
        const xPos = margin + x * tileWidth + x * spacing;
        const yPos = margin + y * tileHeight + y * spacing;
        this.tiles.push(love.graphics.newQuad(xPos, yPos, tileWidth, tileHeight, width, height));
      }
    }
  }

  getQuad(index: number): Quad {
    if (index < 0 || index >= this.tiles.length) {
      print(`Tile index ${index} is out of range.`);
    }

    return this.tiles[index];
  }
}
