import {
  Body,
  Controller,
  Get,
  Post,
  UseInterceptors,
  UsePipes,
} from "@nestjs/common";
import { MembershipService } from "./membership.service";
import {
  CreateMembershipDto,
  createMembershipSchema,
} from "./entities/membership.entity";
import { ZodValidationPipe } from "./zod-validation.pipe";
import {
  PostMembershipResponseResource,
  GetMembershipResponseResource,
} from "./membership.types";
import { ResponseTransformInterceptor } from "./membership.interceptor";

@UseInterceptors(new ResponseTransformInterceptor())
@Controller("memberships")
export class MembershipController {
  constructor(private readonly membershipService: MembershipService) {}

  @Get()
  getAll(): GetMembershipResponseResource[] {
    return this.membershipService.getAll();
  }

  @Post()
  @UsePipes(new ZodValidationPipe(createMembershipSchema))
  store(
    @Body() membershipDto: CreateMembershipDto
  ): PostMembershipResponseResource {
    return this.membershipService.store(membershipDto);
  }
}
