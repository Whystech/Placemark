import { assert } from "chai";
import { db } from "../../src/models/db.js";
import { testPois, statueOfLiberty } from "../fixtures.js";
import { assertSubset } from "../test-utils.js";

suite("POI Model tests", () => {
  let testUser = null;

  setup(async () => {
    db.init("mongo");
    await db.poiStore.deleteAllPois();
    await db.userStore.deleteAll();

    testUser = await db.userStore.addUser({
      firstName: "Test",
      lastName: "User",
      email: "test@user.com",
      password: "secret"
    });
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

  test("get poi category", async () => {
    for (let i = 0; i < testPois.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await db.poiStore.addPoi(testPois[i]);
    }
    const category = "Park"
    const categPoi = await db.poiStore.getPoisByCategory(category)
    categPoi.forEach(poi => {
       assert.equal(poi.category, category);
    });
  });

  test("add rating to POI", async () => {
  const poi = await db.poiStore.addPoi(statueOfLiberty);
  const updatedPoi = await db.poiStore.addOrUpdateRating(
    poi._id,
    testUser._id,  // fake userId
    5
  );
  assert.equal(updatedPoi.ratings.length, 1);
  assert.equal(updatedPoi.ratings[0].value, 5);
});

test("update existing rating", async () => {
  const poi = await db.poiStore.addPoi(statueOfLiberty);

  await db.poiStore.addOrUpdateRating(poi._id, testUser._id, 3);
  const updatedPoi = await db.poiStore.addOrUpdateRating(poi._id, testUser._id, 5);

  assert.equal(updatedPoi.ratings.length, 1);
  assert.equal(updatedPoi.ratings[0].value, 5);
});

test("multiple ratings average", async () => {
  const poi = await db.poiStore.addPoi(statueOfLiberty);

  await db.poiStore.addOrUpdateRating(poi._id, "507f1f77bcf86cd799439011", 5);
  await db.poiStore.addOrUpdateRating(poi._id, "507f1f77bcf86cd799439011", 3);
  await db.poiStore.addOrUpdateRating(poi._id, "507f1f77bcf86cd799439011", 4);

  const updatedPoi = await db.poiStore.getPoiById(poi._id);

  const sum = updatedPoi.ratings.reduce((s, r) => s + r.value, 0);
  const avg = sum / updatedPoi.ratings.length;

  assert.equal(avg, 4);
});

test("add comment to POI", async () => {
  const poi = await db.poiStore.addPoi(statueOfLiberty);

  const comment = {
    title: "Great place",
    text: "Amazing view",
    author: "John",
    authorId: testUser._id,
    date: new Date()
  };

  await db.poiStore.addPoiComment(poi._id, comment);

  const updatedPoi = await db.poiStore.getPoiById(poi._id);
  assert.equal(updatedPoi.comments.length, 1);
  assert.equal(updatedPoi.comments[0].title, "Great place");
});

test("invalid category fails Joi validation", async () => {
  const invalidPoi = {
    ...statueOfLiberty,
    category: "NotARealCategory"
  };

  try {
    await PoiSpec.validateAsync(invalidPoi);
    assert.fail("Validation should have failed");
  } catch (err) {
    assert.isFalse(err.message.includes("must be one of"));
  }
});

test("getAllPublicPois returns only public POIs", async () => {
  const p1 = await db.poiStore.addPoi({ ...statueOfLiberty, isPrivate: false });
  const p2 = await db.poiStore.addPoi({ ...statueOfLiberty, isPrivate: true });

  const publicPois = await db.poiStore.getAllPublicPois();

  assert.equal(publicPois.length, 1);
  assert.equal(publicPois[0].isPrivate, false);
});

});
