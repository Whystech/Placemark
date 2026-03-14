import { assert } from "chai";
import { assertSubset } from "../test-utils.js";
import { poiService } from "./poi-service.js";
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
    // asser subset as the server adds _id and -v
    assert.containSubset(returnedPoi, testPois[0] ); 
    // using contianSubset a must have all testPois[0] fields and match - but it can also have others 
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

  /// add all pois then asser equal each poi against category
  test("get poi category", async () => {
    for (let i = 0; i < testPois.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await poiService.createPoi(testPois[i]);
    }
    const category = "Park"
    const categPoi = await poiService.getPoisByCategory(category)
    categPoi.forEach(poi => {
       assert.equal(poi.category, category);
    });
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
