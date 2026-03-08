import { assert } from "chai";
import { assertSubset } from "../test-utils.js";
import { poiService } from "./poi-service.js"
import { maggie, maggieCredentials, testPois } from "../fixtures.js";

suite("POI API tests", () => {
  let user = null;

  setup(async () => {
    poiService.clearAuth();

    await poiService.createUser(maggie);
    await poiService.authenticate(maggieCredentials);

    await poiService.deleteAllPois();
    await poiService.deleteAllUsers();

    user = await poiService.createUser(maggie);
    await poiService.authenticate(maggieCredentials);
  });

  teardown(async () => {});

  test("create poi", async () => {
    const returnedPoi = await poiService.createPoi(testPois[0]);
    assertSubset(testPois[0], returnedPoi);
    assert.isDefined(returnedPoi._id);
  });

  test("create multiple pois", async () => {
    for (let i = 0; i < testPois.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await poiService.createPoi(testPois[i]);
    }

    const returnedPois = await poiService.getAllPois();
    assert.equal(returnedPois.length, testPois.length);

    for (let i = 0; i < returnedPois.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      const poi = await poiService.getPoi(returnedPois[i]._id);
      assertSubset(poi, returnedPois[i]);
    }
  });

  test("delete POIs", async () => {
    for (let i = 0; i < testPois.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await poiService.createPoi(testPois[i]);
    }

    let returnedPois = await poiService.getAllPois();
    assert.equal(returnedPois.length, testPois.length);

    for (let i = 0; i < returnedPois.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await poiService.deletePoi(returnedPois[i]._id);
    }

    returnedPois = await poiService.getAllPois();
    assert.equal(returnedPois.length, 0);
  });
});