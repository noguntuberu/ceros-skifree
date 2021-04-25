import "babel-polyfill";

import { Entity } from "./Entity";
import { Skier } from "./Skier";

jest.mock("./Entity");

beforeEach(() => {
    Entity.mockClear();
});

it('updateAsset does not return undefined: ', () => {
    const skier = new Skier(0, 0);
    skier.getAssetName.mockReturnValue(skier.assetName);
    expect(skier.getAssetName()).toBeDefined();
});