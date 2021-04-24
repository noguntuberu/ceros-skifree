import * as Constants from "../Constants";
import { AssetManager } from "./AssetManager";
import { Canvas } from './Canvas';
import { Skier } from "../Entities/Skier";
import { Rhino } from "../Entities/Rhino";
import { ObstacleManager } from "../Entities/Obstacles/ObstacleManager";
import { Rect } from './Utils';

export class Game {
    gameWindow = null;

    constructor() {
        this.assetManager = new AssetManager();
        this.canvas = new Canvas(Constants.GAME_WIDTH, Constants.GAME_HEIGHT);
        this.skier = new Skier(0, 0);
        this.rhino = new Rhino(this.skier, 0,0);
        this.obstacleManager = new ObstacleManager();

        document.addEventListener('keydown', this.handleKeyDown.bind(this));
    }

    init() {
        this.obstacleManager.placeInitialObstacles();
    }

    async load() {
        await this.assetManager.loadAssets(Constants.ASSETS);
    }

    run() {
        this.canvas.clearCanvas();

        this.updateGameWindow();
        this.drawGameWindow();

        requestAnimationFrame(this.run.bind(this));
    }

    updateGameWindow() {
        try {
            this.skier.move();

            setTimeout(() => {
                this.rhino.move(this.assetManager).then(isCaught => {
                    if (isCaught) this.skier.setIsCaught();
                });
            }, 2000)
            
            const previousGameWindow = this.gameWindow;
            this.calculateGameWindow();
            
            this.obstacleManager.placeNewObstacle(this.gameWindow, previousGameWindow);
            
            this.skier.checkIfSkierHitObstacle(this.obstacleManager, this.assetManager);
        } catch (e) {
            this.updateGameWindow();
        }
    }
    
    drawGameWindow() {
        this.canvas.setDrawOffset(this.gameWindow.left, this.gameWindow.top);
        
        this.skier.draw(this.canvas, this.assetManager);
        // setTimeout(() => {
            this.rhino.draw(this.canvas, this.assetManager);
        // }, 2000);


        this.obstacleManager.drawObstacles(this.canvas, this.assetManager);
    }

    calculateGameWindow() {
        const skierPosition = this.skier.getPosition();
        const left = skierPosition.x - (Constants.GAME_WIDTH / 2);
        const top = skierPosition.y - (Constants.GAME_HEIGHT / 2);

        this.gameWindow = new Rect(left, top, left + Constants.GAME_WIDTH, top + Constants.GAME_HEIGHT);
    }

    handleKeyDown(event) {
        switch (event.which) {
            case Constants.KEYS.LEFT:
                this.skier.turnLeft();
                break;
            case Constants.KEYS.RIGHT:
                this.skier.turnRight();
                break;
            case Constants.KEYS.UP:
                this.skier.turnUp();
                break;
            case Constants.KEYS.DOWN:
                this.skier.turnDown();
                break;
            default:
                this.skier.jump();
        }

        event.preventDefault();
    }
} 