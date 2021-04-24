/** */
import * as Constants from "../Constants";
import { Entity } from "./Entity";
import { intersectTwoRects, Rect } from "../Core/Utils";

export class Rhino extends Entity {
    assetName = Constants.RHINO;
    skier = null;
    skierIsCaught = false;
    speed = Constants.SKIER_STARTING_SPEED;

    constructor(skier, x, y) {
        super(x, y);
        this.skier = skier;
    }

    checkIfSkierIsCaught(skierPosition, assetManager) {
        let skierAsset = assetManager.getAsset(this.skier.getAssetName());
        let rhinoAsset = assetManager.getAsset(this.assetName);

        let skierBounds = new Rect(
            skierPosition.x - skierAsset.width / 2,
            skierPosition.y - skierAsset.height / 2,
            skierPosition.x + skierAsset.width / 2,
            skierPosition.y - skierAsset.height / 4
        );

        let rhinoBounds = new Rect(
            this.x - rhinoAsset.width / 2,
            this.y - rhinoAsset.height / 2,
            this.x + rhinoAsset.width / 2,
            this.y - rhinoAsset.height / 4
        );

        return intersectTwoRects(skierBounds, rhinoBounds);
    }

    async delay(seconds) {
        return await new Promise((resolve, reject) => setTimeout(resolve, (seconds * 1000)));
    }

    async eatSkier() {
        this.updateAsset(Constants.RHINO_MOUTH_OPEN);
        await this.delay(0.75);
        this.updateAsset(Constants.RHINO_EAT_ONE);
        await this.delay(0.75);
        this.updateAsset(Constants.RHINO_EAT_TWO);
        await this.delay(0.75);
        this.updateAsset(Constants.RHINO_EAT_DONE);
    }

    async move(assetManager) {
        let { x, y } = this.skier.getPosition();
        if (!this.skierIsCaught && this.checkIfSkierIsCaught({ x, y }, assetManager)) {
            this.skierIsCaught = true;
            this.eatSkier()
            return true;
        }

        if (this.x === x && this.y < y) {
            this.moveDown();
        }

        if (this.y >= y) {
            if (this.x < x) {
                this.moveRight();
            }

            if (this.x > x) {
                this.moveLeft();
            }
        }

        if (this.y < y) {
            if (this.x > x) {
                this.moveLeftDown();
            }

            if (this.x < x) {
                this.moveRightDown();
            }
        }

    }

    moveLeft() {
        this.x -= (Constants.SKIER_STARTING_SPEED / 2);
    }

    moveLeftDown() {
        this.x -= this.speed / Constants.SKIER_DIAGONAL_SPEED_REDUCER;
        this.y += this.speed / Constants.SKIER_DIAGONAL_SPEED_REDUCER;
    }

    moveDown() {
        this.y += (this.speed / 2);
    }

    moveRightDown() {
        this.x += this.speed / Constants.SKIER_DIAGONAL_SPEED_REDUCER;
        this.y += this.speed / Constants.SKIER_DIAGONAL_SPEED_REDUCER;
    }

    moveRight() {
        this.x += (Constants.SKIER_STARTING_SPEED / 2);
    }

    updateAsset(name) {
        this.assetName = name;
    }
}