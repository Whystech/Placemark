import { assert } from "chai";
import { poiService } from "./poi-service.js";
import { decodeToken } from "../../src/api/jwt-utils.js";
import { maggie, maggieCredentials } from "../fixtures.js";

suite("Authentication API tests", async () => {
  setup(async () => {
    poiService.clearAuth();
    await poiService.createUser(maggie);
    await poiService.authenticate(maggieCredentials);
    await poiService.deleteAllUsers();
  });

  test("authenticate", async () => {
    const returnedUser = await poiService.createUser(maggie);
    const response = await poiService.authenticate(maggieCredentials);
    assert(response.success);
    assert.isDefined(response.token);
  });

  test("verify Token", async () => {
    const returnedUser = await poiService.createUser(maggie);
    const response = await poiService.authenticate(maggieCredentials);

    const userInfo = decodeToken(response.token);
    assert.equal(userInfo.email, returnedUser.email);
    assert.equal(userInfo.userId, returnedUser._id);
  });

  test("check Unauthorized", async () => {
    poiService.clearAuth();
    try {
      await poiService.deleteAllUsers();
      assert.fail("Route not protected");
    } catch (error) {
      assert.equal(error.response.data.statusCode, 401);
    }
  });
});
