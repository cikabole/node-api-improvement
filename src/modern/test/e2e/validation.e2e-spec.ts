import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { App } from "supertest/types";
import { MembershipModule } from "../../src/membership.module";

describe("Validation rules", () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [MembershipModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  const payloadWithoutRequiredFields = [
    {},
    { name: "some name" },
    { recurringPrice: 1 },
  ];
  it.each(payloadWithoutRequiredFields)("required fields", async (payload) => {
    const response = await request(app.getHttpServer())
      .post("/memberships")
      .send(payload)
      .expect(400);
    expect(response.body.message).toBe("missingMandatoryFields");
  });

  it("recurringPrice must be positive number", async () => {
    const response = await request(app.getHttpServer())
      .post("/memberships")
      .send({ name: "Foo", recurringPrice: -1 })
      .expect(400);
    expect(response.body.message).toBe("negativeRecurringPrice");
  });

  it("billing interval must be present", async () => {
    const response = await request(app.getHttpServer())
      .post("/memberships")
      .send({ name: "Foo", recurringPrice: 1 })
      .expect(400);
    expect(response.body.message).toBe("invalidBillingInterval");
  });

  it("recurringPrice cannot be bigger than 100 when paymentMethod is cash", async () => {
    const response = await request(app.getHttpServer())
      .post("/memberships")
      .send({
        name: "Foo",
        billingInterval: "yearly",
        recurringPrice: 101,
        paymentMethod: "cash",
      })
      .expect(400);
    expect(response.body.message).toBe("cashPriceBelow100");
  });

  it("billingInterval = monthly and billingPeriods > 12 is not valid", async () => {
    const response = await request(app.getHttpServer())
      .post("/memberships")
      .send({
        name: "Foo",
        recurringPrice: 1,
        billingInterval: "monthly",
        billingPeriods: 13,
      })
      .expect(400);
    expect(response.body.message).toBe("billingPeriodsMoreThan12Months");
  });

  it("billingInterval = yearly and billingPeriods > 3 is not valid", async () => {
    const response = await request(app.getHttpServer())
      .post("/memberships")
      .send({
        name: "Foo",
        recurringPrice: 1,
        billingInterval: "yearly",
        billingPeriods: 4,
      })
      .expect(400);
    expect(response.body.message).toBe("billingPeriodsLessThan3Years");
  });

  it("billingInterval = yearly and billingPeriods > 10 is not valid", async () => {
    const response = await request(app.getHttpServer())
      .post("/memberships")
      .send({
        name: "Foo",
        recurringPrice: 1,
        billingInterval: "yearly",
        billingPeriods: 11,
      })
      .expect(400);
    expect(response.body.message).toBe("billingPeriodsMoreThan10Years");
  });
});
