import { Test, TestingModule } from "@nestjs/testing";
import { MembershipController } from "../../src/membership.controller";
import { MembershipService } from "../../src/membership.service";
import memberships from "../../../data/memberships.json";
import membershipPeriods from "../../../data/membership-periods.json";
import {
  createMembershipSchema,
  membershipSchema,
} from "../../src/entities/membership.entity";
import { membershipPeriodSchema } from "../../src/entities/membership-period.entity";

const mockMembershipService = () => ({
  getAll: jest.fn(),
  store: jest.fn(),
});
describe("MembershipController", () => {
  let membershipController: MembershipController;
  let membershipService: jest.Mocked<MembershipService>;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [MembershipController],
      providers: [
        {
          provide: MembershipService,
          useFactory: mockMembershipService,
        },
      ],
    }).compile();

    membershipController = app.get<MembershipController>(MembershipController);
    membershipService = app.get(MembershipService);
  });

  it("should respond with structured data got GET / endpoint", () => {
    const membership = membershipSchema.parse(memberships[0]);
    const result = [{ membership, periods: [] }];

    membershipService.getAll.mockReturnValue(result);

    expect(membershipController.getAll()).toBe(result);
  });

  it("should store Membership and respond with created resource", () => {
    const requestMembership = createMembershipSchema.parse(memberships[0]);
    const responseMembership = membershipSchema.parse(memberships[0]);
    const period = membershipPeriodSchema.parse(membershipPeriods[0]);
    const result = {
      membership: responseMembership,
      membershipPeriods: [period],
    };
    membershipService.store.mockReturnValue(result);
    expect(membershipController.store(requestMembership)).toBe(result);
  });
});
