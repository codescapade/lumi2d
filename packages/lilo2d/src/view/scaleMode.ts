/**
 * Helper type for the scale function returns.
 * Returns [viewWidth, viewHeight, scaleFactorX, scaleFactorY, xOffset, yOffset].
 */
type ScaleModeReturn = LuaMultiReturn<[number, number, number, number, number, number]>;

/** Scale mode type used for every scale mode function */
export type ScaleMode = (
  designWidth: number,
  designHeight: number,
  anchorX: number,
  anchorY: number
) => ScaleModeReturn;

/**
 * Fit view will use fill width or fill height depending what fill the screen the most.
 * @param designWidth
 * @param designHeight
 * @param anchorX
 * @param anchorY
 * @returns
 */
export function scaleModeFitView(
  designWidth: number,
  designHeight: number,
  anchorX: number,
  anchorY: number
): ScaleModeReturn {
  const windowWidth = love.graphics.getWidth();
  const windowHeight = love.graphics.getHeight();

  const designRatio = designWidth / designHeight;
  const windowRatio = windowWidth / windowHeight;

  let viewWidth = 0;
  let viewHeight = 0;
  if (windowRatio < designRatio) {
    viewWidth = designWidth;
    viewHeight = Math.ceil(viewWidth / windowRatio);
  } else {
    viewHeight = designHeight;
    viewWidth = Math.ceil(viewHeight * windowRatio);
  }

  const scaleFactor = windowWidth / viewWidth;

  const xOffset = (windowWidth - designWidth * scaleFactor) * anchorX;
  const yOffset = (windowHeight - designHeight * scaleFactor) * anchorY;

  return $multi(viewWidth, viewHeight, scaleFactor, scaleFactor, xOffset, yOffset);
}

/**
 * Fill the width of the screen by scaling the view.
 * @param designWidth
 * @param designHeight
 * @param anchorX
 * @param anchorY
 * @returns
 */
export function scaleModeFitWidth(
  designWidth: number,
  designHeight: number,
  anchorX: number,
  anchorY: number
): ScaleModeReturn {
  const windowWidth = love.graphics.getWidth();
  const windowHeight = love.graphics.getHeight();

  const windowRatio = windowWidth / windowHeight;
  const viewWidth = designWidth;
  const viewHeight = Math.ceil(viewWidth / windowRatio);

  const scaleFactor = windowWidth / viewWidth;

  const xOffset = (windowWidth - designWidth * scaleFactor) * anchorX;
  const yOffset = (windowHeight - designHeight * scaleFactor) * anchorY;

  return $multi(viewWidth, viewHeight, scaleFactor, scaleFactor, xOffset, yOffset);
}

/**
 * Fill the height of the screen by scaling the view.
 * @param designWidth
 * @param designHeight
 * @param anchorX
 * @param anchorY
 * @returns
 */
export function scaleModeFitHeight(
  designWidth: number,
  designHeight: number,
  anchorX: number,
  anchorY: number
): ScaleModeReturn {
  const windowWidth = love.graphics.getWidth();
  const windowHeight = love.graphics.getHeight();

  const windowRatio = windowWidth / windowHeight;
  const viewHeight = designHeight;
  const viewWidth = Math.ceil(viewHeight * windowRatio);

  const scaleFactor = windowHeight / viewHeight;

  const xOffset = (windowWidth - designWidth * scaleFactor) * anchorX;
  const yOffset = (windowHeight - designHeight * scaleFactor) * anchorY;

  return $multi(viewWidth, viewHeight, scaleFactor, scaleFactor, xOffset, yOffset);
}

/**
 * Don't scale the view at all.
 * @param designWidth
 * @param designHeight
 * @param anchorX
 * @param anchorY
 * @returns
 */
export function scaleModeNoScale(
  designWidth: number,
  designHeight: number,
  anchorX: number,
  anchorY: number
): ScaleModeReturn {
  const windowWidth = love.graphics.getWidth();
  const windowHeight = love.graphics.getHeight();
  const xOffset = (windowWidth - designWidth) * anchorX;
  const yOffset = (windowHeight - designHeight) * anchorY;

  return $multi(designWidth, designHeight, 1.0, 1.0, xOffset, yOffset);
}

/**
 * Stretch the width and height to fill the screen.
 * @param designWidth
 * @param designHeight
 * @param _anchorX
 * @param _anchorY
 * @returns
 */
export function scaleModeStretch(
  designWidth: number,
  designHeight: number,
  _anchorX: number,
  _anchorY: number
): ScaleModeReturn {
  const windowWidth = love.graphics.getWidth();
  const windowHeight = love.graphics.getHeight();

  const viewWidth = designWidth;
  const viewHeight = designHeight;

  const scaleFactorX = windowWidth / viewWidth;
  const scaleFactorY = windowHeight / viewHeight;

  return $multi(viewWidth, viewHeight, scaleFactorX, scaleFactorY, 0, 0);
}
