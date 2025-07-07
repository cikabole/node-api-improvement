import { PipeTransform, BadRequestException } from "@nestjs/common";
import { ZodType, ZodError } from "zod/v4";

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodType) {}

  transform(value: unknown) {
    try {
      return this.schema.parse(value);
    } catch (error) {
      let errorMessage = "validation error";
      if (error instanceof ZodError) {
        errorMessage = error.issues[0].message;
      }
      throw new BadRequestException(errorMessage);
    }
  }
}
