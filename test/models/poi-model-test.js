import { assert } from "chai";
import { db } from "../../src/models/db.js";
import { testPois, statueOfLiberty } from "../fixtures.js";
import { assertSubset } from "../test-utils.js";

suite("POI Model tests", () => {
  setup(async () => {
    db.init("mongo");
    await db.poiStore.deleteAllPois();
  });

  test("create single POI", async () => {
    const poi = await db.poiStore.addPoi(statueOfLiberty);
    assert.isNotNull(poi._id);
    assertSubset(statueOfLiberty, poi);
  });

  test("create multiple POIs", async () => {
    for (let i = 0; i < testPois.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await db.poiStore.addPoi(testPois[i]);
    }

    const pois = await db.poiStore.getAllPois();
    assert.equal(pois.length, testPois.length);
  });

  test("get POI - success", async () => {
    const poi = await db.poiStore.addPoi(statueOfLiberty);
    const foundPoi = await db.poiStore.getPoiById(poi._id);
    assertSubset(statueOfLiberty, foundPoi);
  });

  test("get POI - bad params", async () => {
    assert.isNull(await db.poiStore.getPoiById(""));
    assert.isNull(await db.poiStore.getPoiById());
  });

  test("delete one POI - success", async () => {
    const poi = await db.poiStore.addPoi(testPois[0]);
    await db.poiStore.deletePoi(poi._id);
    const pois = await db.poiStore.getAllPois();
    const deletedPoi = await db.poiStore.getPoiById(poi._id);
    assert.isNull(deletedPoi);
    assert.equal(pois.length, 0);
  });

  test("delete one POI - fail", async () => {
    await db.poiStore.deletePoi("bad-id");
    const pois = await db.poiStore.getAllPois();
    assert.equal(pois.length, 0);
  });

  test("delete all POIs", async () => {
    for (let i = 0; i < testPois.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await db.poiStore.addPoi(testPois[i]);
    }

    let pois = await db.poiStore.getAllPois();
    assert.equal(pois.length, testPois.length);
    await db.poiStore.deleteAllPois();
    pois = await db.poiStore.getAllPois();
    assert.equal(pois.length, 0);
  });
});
