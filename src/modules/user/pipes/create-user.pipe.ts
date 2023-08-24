import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { CreateUserDto, CreateUserWithRolesDto } from '../dto/create-user.dto';

@Injectable()
export class CreateUserPipe implements PipeTransform {
  transform(value: CreateUserWithRolesDto, metadata: ArgumentMetadata) {
    if (value.roles && value.roles instanceof Array && value.roles.length > 0) {
      // Roles[]
      if (value.roles[0]['id']) {
        value.roles = value.roles.map((role) => role);
      }
      // number[]
    }
    return value;
  }
}
