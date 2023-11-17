import { PolygonShape, World } from 'love.physics';
import { Camera, Color } from '../../graphics';

const bodyColor = new Color(0, 0.45, 0.8);
const staticBodyColor = new Color(0, 0.8, 0);
const kinematicBodyColor = new Color(0.2, 0.45, 0);

export function lovePhysDraw(world: World, camera?: Camera): void {
  if (camera) {
    love.graphics.push();
    love.graphics.applyTransform(camera.transform);
  }

  const bodies = world.getBodies();
  for (const body of bodies) {
    const type = body.getType();
    if (type === 'dynamic') {
      love.graphics.setColor(bodyColor.red, bodyColor.green, bodyColor.blue, 1.0);
    } else if (type === 'kinematic') {
      love.graphics.setColor(kinematicBodyColor.red, kinematicBodyColor.green, kinematicBodyColor.blue, 1.0);
    } else {
      love.graphics.setColor(staticBodyColor.red, staticBodyColor.green, staticBodyColor.blue, 1.0);
    }

    const fixtures = body.getFixtures();
    for (const fixture of fixtures) {
      const shape = fixture.getShape();
      if (shape.typeOf('CircleShape')) {
        const [shapeX, shapeY] = shape.getPoint();
        const [cx, cy] = body.getWorldPoint(shapeX, shapeY);
        love.graphics.circle('line', cx, cy, shape.getRadius());
      } else if (shape.typeOf('PolygonShape')) {
        love.graphics.polygon('line', ...body.getWorldPoints(...shape.getPoints()));
      } else {
        love.graphics.line(...body.getWorldPoints(...(shape as PolygonShape).getPoints()));
      }
    }
  }

  if (camera) {
    love.graphics.pop();
  }
}
