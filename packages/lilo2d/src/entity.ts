export interface Entity {
  active: boolean;
  layer: number;

  update?: (dt: number) => void;
  lateUpdate?: (dt: number) => void;
  draw?: () => void;
  destroy?: () => void;
}
