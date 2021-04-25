import * as Constants from "../Constants";
import { Entity } from "./Entity";
import { intersectTwoRects, Rect } from "../Core/Utils";

export class Skier extends Entity {
    assetName = Constants.SKIER_DOWN;

    direction = Constants.SKIER_DIRECTIONS.DOWN;
    isCaught = false;
    isPaused = false;
    speed = Constants.SKIER_STARTING_SPEED;


    constructor(x, y) {
        super(x, y);
    }

    setDirection(direction) {
        this.direction = direction;
        this.updateAsset();
    }

    setIsCaught() {
        this.isCaught = true;
    }

    updateAsset() {
        this.assetName = Constants.SKIER_DIRECTION_ASSET[this.direction] || this.assetName;
    }

    pause(isPaused) {
        this.isPaused = isPaused;
    }

    move() {
        if (this.isCaught || this.isPaused) return;

        switch (this.direction) {
            case Constants.SKIER_DIRECTIONS.LEFT_DOWN:
                this.moveSkierLeftDown();
                break;
            case Constants.SKIER_DIRECTIONS.JUMP:
            case Constants.SKIER_DIRECTIONS.DOWN:
                this.moveSkierDown();
                break;
            case Constants.SKIER_DIRECTIONS.RIGHT_DOWN:
                this.moveSkierRightDown();
                break;
        }
    }

    moveSkierLeft() {
        this.x -= Constants.SKIER_STARTING_SPEED;
    }

    moveSkierLeftDown() {
        this.x -= this.speed / Constants.SKIER_DIAGONAL_SPEED_REDUCER;
        this.y += this.speed / Constants.SKIER_DIAGONAL_SPEED_REDUCER;
    }

    moveSkierDown() {
        this.y += this.speed;
    }

    moveSkierRightDown() {
        this.x += this.speed / Constants.SKIER_DIAGONAL_SPEED_REDUCER;
        this.y += this.speed / Constants.SKIER_DIAGONAL_SPEED_REDUCER;
    }

    moveSkierRight() {
        this.x += Constants.SKIER_STARTING_SPEED;
    }

    moveSkierUp() {
        this.y -= Constants.SKIER_STARTING_SPEED;
    }

    jump() {
        this.setDirection(Constants.SKIER_DIRECTIONS.JUMP);

        setTimeout(() => {
            this.setDirection(Constants.SKIER_DIRECTIONS.DOWN);
        }, 250);
    }

    turnLeft() {
        if (this.direction === Constants.SKIER_DIRECTIONS.LEFT) {
            this.moveSkierLeft();
        }
        else if (this.direction === 0) {
            this.setDirection(2);
        }
        else {
            this.setDirection(this.direction - 1);
        }
    }

    turnRight() {
        if (this.direction === Constants.SKIER_DIRECTIONS.RIGHT) {
            this.moveSkierRight();
        }
        else if (this.direction === 0) {
            this.setDirection(4);
        }
        else {
            this.setDirection(this.direction + 1);
        }
    }

    turnUp() {
        if (this.direction === Constants.SKIER_DIRECTIONS.LEFT || this.direction === Constants.SKIER_DIRECTIONS.RIGHT) {
            this.moveSkierUp();
        }
    }

    turnDown() {
        this.setDirection(Constants.SKIER_DIRECTIONS.DOWN);
    }

    checkIfObstacleIsJumpable(obstacleName) {
        return (obstacleName === Constants.ROCK1 || obstacleName === Constants.ROCK2) && this.direction === Constants.SKIER_DIRECTIONS.JUMP;
    }

    checkIfSkierHitObstacle(obstacleManager, assetManager) {
        const asset = assetManager.getAsset(this.assetName);
        const skierBounds = new Rect(
            this.x - asset.width / 2,
            this.y - asset.height / 2,
            this.x + asset.width / 2,
            this.y - asset.height / 4
        );

        let obstacleName = '';
        const collision = obstacleManager.getObstacles().find((obstacle) => {
            obstacleName = obstacle.getAssetName();
            const obstacleAsset = assetManager.getAsset(obstacle.getAssetName());
            const obstaclePosition = obstacle.getPosition();
            const obstacleBounds = new Rect(
                obstaclePosition.x - obstacleAsset.width / 2,
                obstaclePosition.y - obstacleAsset.height / 2,
                obstaclePosition.x + obstacleAsset.width / 2,
                obstaclePosition.y
            );

            return intersectTwoRects(skierBounds, obstacleBounds);
        });


        if (collision) {
            if (obstacleName === Constants.RAMP) {
                if (this.direction === Constants.SKIER_DIRECTIONS.JUMP) {
                    return;
                } // included to prevent multiple jump updations
                this.jump();
            } else if (this.checkIfObstacleIsJumpable()) {
                return;
            } else {
                this.setDirection(Constants.SKIER_DIRECTIONS.CRASH);
            }
        }

        return { collision, obstacleName };
    };
}