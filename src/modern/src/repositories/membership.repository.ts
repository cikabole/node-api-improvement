import { Injectable } from "@nestjs/common";
import memberships from "../../../data/memberships.json";
import { v4 as generateUuidV4 } from "uuid";
import {
  CreateMembershipDto,
  GetMembership,
  Membership,
  membershipSchema,
} from "../entities/membership.entity";

export interface IMembershipRepository {
  getAll(): GetMembership[];
  store(membership: CreateMembershipDto): Membership;
}

@Injectable()
export class MembershipRepository {
  private parsedMemberships: Membership[];

  constructor() {
    this.parsedMemberships = memberships.map((item) =>
      membershipSchema.parse(item)
    );
  }

  getAll(): GetMembership[] {
    return this.parsedMemberships.map((item) => membershipSchema.parse(item));
  }

  store(membership: CreateMembershipDto): Membership {
    const storedMembership = {
      id: this.parsedMemberships.length + 1,
      uuid: generateUuidV4(),
      ...membership,
    };

    this.parsedMemberships.push(storedMembership);
    return storedMembership;
  }
}
