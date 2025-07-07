import { Test, TestingModule } from "@nestjs/testing";
import { MembershipService } from "../../src/membership.service";
import { MembershipPeriodRepository } from "../../src/repositories/membership-period.repository";
import { MembershipRepository } from "../../src/repositories/membership.repository";
import memberships from "../../../data/memberships.json";
import membershipPeriods from "../../../data/membership-periods.json";
import postRequestSnapshot from "../snapshots/post.valid-payload.json";
import postResponseSnapshot from "../snapshots/post.response.json";
import {
  createMembershipSchema,
  membershipSchema,
} from "../../src/entities/membership.entity";
import {
  MembershipPeriod,
  membershipPeriodSchema,
} from "../../src/entities/membership-period.entity";
import { MembershipStrategyFactory } from "../../src/strategies/membership-strategy-factory";

const mockMembershipRepository = () => ({
  getAll: jest.fn(),
  store: jest.fn(),
});
const mockMembershipPeriodRepository = () => ({
  getByMembershipId: jest.fn(),
  store: jest.fn(),
});

describe("MembershipService", () => {
  let membershipService: MembershipService;
  let membershipRepository: jest.Mocked<MembershipRepository>;
  let membershipPeriodRepository: jest.Mocked<MembershipPeriodRepository>;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        MembershipService,
        {
          provide: MembershipRepository,
          useFactory: mockMembershipRepository,
        },
        {
          provide: MembershipPeriodRepository,
          useFactory: mockMembershipPeriodRepository,
        },
      ],
    }).compile();

    membershipService = app.get<MembershipService>(MembershipService);
    membershipRepository = app.get(MembershipRepository);
    membershipPeriodRepository = app.get(MembershipPeriodRepository);
  });

  it("returns memberships with periods for getAll method", () => {
    const membership1 = membershipSchema.parse(memberships[0]);
    const membershipPeriodFor1 = membershipPeriodSchema.parse(
      membershipPeriods[0]
    );

    membershipRepository.getAll.mockReturnValue([membership1]);
    membershipPeriodRepository.getByMembershipId.mockReturnValue([
      membershipPeriodFor1,
    ]);
    expect(membershipService.getAll()).toStrictEqual([
      { membership: membership1, periods: [membershipPeriodFor1] },
    ]);
  });

  it("stores Membership and MembershipPeriods and respond with created resource", () => {
    const requestObject = createMembershipSchema.parse(postRequestSnapshot);
    const calculatedMembership = membershipSchema.parse(
      postResponseSnapshot.membership
    );
    const calculatedMembershipPeriods =
      postResponseSnapshot.membershipPeriods.map((item) =>
        membershipPeriodSchema.parse(item)
      );

    const spyMembershipRepository = jest
      .spyOn(membershipRepository, "store")
      .mockImplementation(() => calculatedMembership);
    const spyMembershipPeriodRepository = jest.spyOn(
      membershipPeriodRepository,
      "store"
    );
    spyMembershipPeriodRepository.mockReturnValue(
      calculatedMembershipPeriods[0]
    );
    membershipService.store(structuredClone(requestObject));

    expect(spyMembershipRepository).toHaveBeenCalledTimes(1);
    expect(spyMembershipRepository).toHaveBeenCalledWith({
      ...requestObject,
      validUntil: new Date("2023-06-30T23:00:00.000Z"),
    });
    expect(spyMembershipPeriodRepository).toHaveBeenCalledTimes(6);

    expect(spyMembershipPeriodRepository).toHaveBeenNthCalledWith(1, {
      start: new Date("2023-01-01T00:00:00.000Z"),
      end: new Date("2023-02-01T00:00:00.000Z"),
      membershipId: 5,
      state: "planned",
    });
    expect(spyMembershipPeriodRepository).toHaveBeenNthCalledWith(2, {
      start: new Date("2023-02-01T00:00:00.000Z"),
      end: new Date("2023-03-01T00:00:00.000Z"),
      membershipId: 5,
      state: "planned",
    });
  });

  const billingIntervals = ["monthly", "yearly", "weekly"];

  it.each(billingIntervals)(
    "uses strategy to calculate membership and membershipPeriods expiry dates",
    (billingInterval) => {
      postRequestSnapshot.billingInterval = billingInterval;
      postRequestSnapshot.billingPeriods = 2;
      const requestObject = createMembershipSchema.parse(postRequestSnapshot);

      const calculatedMembership = membershipSchema.parse(
        postResponseSnapshot.membership
      );
      jest
        .spyOn(membershipRepository, "store")
        .mockImplementation(() => calculatedMembership);
      const spyStrategyFactory = jest.spyOn(
        MembershipStrategyFactory,
        "makeStrategy"
      );
      membershipService.store(requestObject);
      expect(spyStrategyFactory).toHaveBeenCalledWith(billingInterval);
    }
  );
});
