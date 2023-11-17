// json types for verion 1.3.4

export interface ProjectJson {
  jsonVersion: string;
  iid: string;
  worldLayout?: WorldLayout;
  worldGridWidth?: number;
  worldGridHeight?: number;
  defs: DefinitionsJson;
  levels: LevelJson[];
  worlds: WorldJson[];
  bgColor: string;
  externalLevels: boolean;
  toc: TableOfContentEntry[];
}

export interface WorldJson {
  iid: string;
  identifier: string;
  levels: LevelJson[];
  worldLayout: WorldLayout;
  worldGridWidth: number;
  worldGridHeight: number;
}

export interface LevelJson {
  uid: number;
  iid: string;
  identifier: string;
  worldX: number;
  worldY: number;
  worldDepth: number;
  pxWid: number;
  pxHei: number;
  __bgColor: string;
  layerInstances?: LayerInstanceJson[];
  fieldInstances: FieldInstanceJson[];
  externalRelPath?: string;
  __neighbours: NeighbourLevel[];
  bgRelPath?: string;
  __bgPos?: LevelBgPosInfos;
}

export interface LayerInstanceJson {
  __identifier: string;
  __type: LayerType;
  __cWid: number;
  __cHei: number;
  __gridSize: number;
  __opacity: number;
  __pxTotalOffsetX: number;
  __pxTotalOffsetY: number;
  __tilesetDefUid?: number;
  __tilesetRelPath?: string;
  iid: string;
  levelId: number;
  layerDefUid: number;
  visible: boolean;
  pxOffsetX: number;
  pxOffsetY: number;
  intGridCsv: number[];
  gridTiles: Tile[];
  overrideTilesetUid?: number;
  autoLayerTiles: Tile[];
  entityInstances: EntityInstanceJson[];
}

export interface Tile {
  px: number[];
  py: number[];
  f: number;
  t: number;
  a: number;
}

export interface TilesetRect {
  tilesetUid: number;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface EntityInstanceJson {
  __identifier: string;
  __grid: number[];
  __pivot: number[];
  __tags: string[];
  __worldX: number;
  __worldY: number;
  width: number;
  height: number;
  __tile?: TilesetRect;
  __smartColor: string;
  iid: string;
  defUid: number;
  px: number[];
  fieldInstances: FieldInstanceJson[];
}

export interface FieldInstanceJson {
  __identifier: string;
  __value: unknown;
  __type: string;
  __tile?: TilesetRect;
  defUid: number;
}

export interface DefinitionsJson {
  layers: LayerDefJson[];
  entities: EntityDefJson[];
  tilesets: TilesetDefJson[];
  enums: EnumDefJson[];
  levelFields: FieldDefJson[];
  externalEnums: EnumDefJson[];
}

export interface LayerDefJson {
  identifier: string;
  __type: string;
  uid: number;
  gridSize: number;
  pxOffsetX: number;
  pxOffsetY: number;
  parallaxFaxtorX: number;
  parallaxFactorY: number;
  parallaxScaling: boolean;
  intGridValues: IntGridValueDef[];
  autoSourceLayerDefUid?: number;
  tilesetDefUid?: number;
}

export interface AutoLayerRuleGroupJson {
  uid: number;
  name: string;
  active: boolean;
  isOptional: boolean;
  usesWizard: boolean;
}

export interface EntityDefJson {
  identifier: string;
  uid: number;
  width: number;
  height: number;
  color: string;
  tilesetId?: number;
  tileRect?: TilesetRect;
  tileRenderMode: EntityTileRenderMode;
  nineSliceBorders: number[];
  pivotX: number;
  pivotY: number;
}

export interface FieldDefJson {
  identifier: string;
  doc?: string;
  uid: number;
  __type: string;
  type: FieldType;
  isArray: boolean;
  canBeNull: boolean;
  arrayMinLength?: number;
  arrayMaxLength?: number;
  min?: number;
  max?: number;
  regex?: string;
  acceptFileTypes?: string[];
  defaultOverride?: unknown;
}

export interface TilesetDefJson {
  __cWid: number;
  __cHei: number;
  identifier: string;
  uid: number;
  embedAtlas?: EmbedAtlas;
  relPath?: string;
  pxWid: number;
  pxHei: number;
  tileGridSize: number;
  spacing: number;
  padding: number;
  tagSourceEnumUid?: number;
  enumTags: EnumTagValue[];
  customData: TileCustomMetadata[];
  tags: string[];
}

export interface EnumDefJson {
  uid: number;
  identifier: string;
  values: EnumDefValues[];
  iconTilesetUid?: number;
  externalRelPath?: string;
  tags: string[];
}

export interface EnumDefValues {
  id: string;
  tileRect?: TilesetRect;
  color: number;
}

export interface NeighbourLevel {
  levelIid: string;
  dir: string;
}

export interface LevelBgPosInfos {
  topLeftPx: number[];
  scale: number[];
  cropRect: number[];
}

export interface IntGridValueInstance {
  coordId: number;
  v: number;
}

export interface IntGridValueDef {
  value: number;
  identifier?: string;
  color: string;
  tile?: TilesetRect;
}

export interface EnumTagValue {
  enumValueId: string;
  tileIds: number[];
}

export interface TileCustomMetadata {
  tileId: number;
  data: string;
}

export interface EntityReferenceInfos {
  entityIid: string;
  layerIid: string;
  levelIid: string;
  worldIid: string;
}

export interface GridPoint {
  cx: number;
  cy: number;
}

export interface CustomCommand {
  command: string;
  when: CustomCommandTrigger;
}

export interface TableOfContentEntry {
  identifier: string;
  instances: EntityReferenceInfos[];
}

export type WorldLayout = 'Free' | 'GridVania' | 'LinearHorizontal' | 'LinearVertical';
export type LayerType = 'IntGrid' | 'Entities' | 'Tiles' | 'AutoLayer';
export type AutoLayerRuleTileMode = 'Single' | 'Stamp';
export type AutoLayerRuleCheckerMode = 'None' | 'Horizontal' | 'Vertical';
export type FieldDisplayPosition = 'Above' | 'Center' | 'Beneath';
export type FieldType =
  | 'F_Int'
  | 'F_Float'
  | 'F_String'
  | 'F_Text'
  | 'F_Bool'
  | 'F_Color'
  | 'F_Enum'
  | 'F_Point'
  | 'F_Path'
  | 'F_EntityRef'
  | 'F_Tile';
export type EntityRenderMode = 'Rectangle' | 'Ellipse' | 'Tile' | 'Cross';
export type EntityTileRenderMode =
  | 'Cover'
  | 'FitInside'
  | 'Repeat'
  | 'Stretch'
  | 'FullSizeCropped'
  | 'FullSizeUncropped'
  | 'NineSlice';
export type EmbedAtlas = 'LdtkIcons';
export type CustomCommandTrigger = 'Manual' | 'AfterLoad' | 'BeforeSave' | 'AfterSave';
