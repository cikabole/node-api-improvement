import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { App } from "supertest/types";
import { MembershipModule } from "../../src/membership.module";
import getSnapshot from "../snapshots/get.default-response.json";
import postSnapshot from "../snapshots/post.response.json";

describe("Memberships (e2e)", () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [MembershipModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it("responds with membership collection", () => {
    return request(app.getHttpServer())
      .get("/memberships")
      .expect(200)
      .expect(getSnapshot);
  });

  it("creates a new membership with related membership periods", async () => {
    const response = await request(app.getHttpServer())
      .post("/memberships")
      .send(postSnapshot.membership)
      .expect(201);
    expect(response.body).toHaveProperty("membership");
    expect(response.body).toHaveProperty("membershipPeriods");
    expect(response.body.membership).toHaveProperty("user");
    expect(response.body.membership).not.toHaveProperty("userId");
    expect(response.body.membershipPeriods).toHaveLength(6);
  });
});
