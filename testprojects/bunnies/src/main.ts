import { Game } from 'lilo2d';
import { LoadScene } from './scenes/loadScene';

love.window.setTitle('Bunnies');

Game.start(800, 600, LoadScene);
Game.showDebugInfo = true;
