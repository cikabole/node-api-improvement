import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

export interface Response<T> {
  data: T;
}

@Injectable()
export class ResponseTransformInterceptor<MembershipResponseResource>
  implements
    NestInterceptor<
      MembershipResponseResource,
      Response<MembershipResponseResource>
    >
{
  intercept(
    _: ExecutionContext,
    next: CallHandler
  ): Observable<Response<MembershipResponseResource>> {
    return next.handle().pipe(
      map((data) => {
        if (data instanceof Array) {
          data.map((item: MembershipResponseResource) => {
            this.transformMembership(item);
            return item;
          });
        } else {
          this.transformMembership(data);
        }
        return data;
      })
    );
  }

  private transformMembership(item) {
    const isPostResponse = !!item.membershipPeriods;
    item.membership.validFrom = this.displayDateFormat(
      item.membership.validFrom,
      isPostResponse
    );
    if (item.membership.validUntil instanceof Date) {
      item.membership.validUntil = this.displayDateFormat(
        item.membership.validUntil,
        isPostResponse
      );
    }

    if (isPostResponse) {
      item.membership.user = structuredClone(item.membership.userId);
      delete item.membership.userId;
    }
    // } else {
    //     item.membership.userId = structuredClone(item.membership.userId);
    //     delete item.membership.userId;
    // }

    const periods = item.membershipPeriods ?? item.periods;

    periods.map((period) => {
      period.start = this.displayDateFormat(period.start, isPostResponse);
      period.end = this.displayDateFormat(period.end, isPostResponse);
    });
  }

  private displayDateFormat(date: Date | string, isPostResponse: boolean) {
    if (typeof date === "string" || isPostResponse) {
      return date;
    }
    return date.toISOString().split("T")[0];
  }
}
