import { MembershipMonthlyStrategy } from "../../../src/strategies/membership-monthly-strategy";

describe("MembershipMonthlyStrategy", () => {
  const inputData = [
    { billingPeriods: 1, resultDate: new Date("2025-02-01T00:00:00.000Z") },
    { billingPeriods: 2, resultDate: new Date("2025-03-01T00:00:00.000Z") },
    { billingPeriods: 3, resultDate: new Date("2025-03-31T23:00:00.000Z") },
  ];

  it.each(inputData)(
    "calculates correct membership expiry date",
    ({ billingPeriods, resultDate }) => {
      const strategy = new MembershipMonthlyStrategy();
      expect(
        strategy.calculateMembershipExpiry(
          new Date("2025-01-01"),
          billingPeriods
        )
      ).toStrictEqual(resultDate);
    }
  );

  const periodDates = [
    {
      startDate: new Date("2025-01-01T00:00:00.000Z"),
      endDate: new Date("2025-02-01T00:00:00.000Z"),
    },
    {
      startDate: new Date("2025-02-01T00:00:00.000Z"),
      endDate: new Date("2025-03-01T00:00:00.000Z"),
    },
    {
      startDate: new Date("2025-03-01T00:00:00.000Z"),
      endDate: new Date("2025-03-31T23:00:00.000Z"),
    },
  ];

  it.each(periodDates)(
    "calculates correct membership period expiry date",
    ({ startDate, endDate }) => {
      const strategy = new MembershipMonthlyStrategy();
      expect(strategy.calculateMembershipPeriodExpiry(startDate)).toStrictEqual(
        endDate
      );
    }
  );
});
