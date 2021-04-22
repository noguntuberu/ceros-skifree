import "babel-polyfill";

import { Entity } from "./Entity";
import { Skier } from "./Skier";

jest.mock("./Entity");

beforeEach(() => {
    Entity.mockClear();
});

it('updateAsset does not return undefined even for non-existent directions: ', () => {
    const skier = new Skier(0, 0);
    skier.setDirection(9);
    expect(skier.getAssetName()).toBeDefined();
});