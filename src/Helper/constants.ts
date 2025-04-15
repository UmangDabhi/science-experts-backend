import { SetMetadata } from '@nestjs/common';
import { join } from 'path';

export enum Role {
  ADMIN = 'admin',
  TUTOR = 'tutor',
  STUDENT = 'student',
}

export enum PURCHASE_OF_TYPE {
  COURSE = 'COURSE',
  MATERIAL = 'MATERIAL',
}

export const Is_Paid = {
  YES: true,
  NO: false,
};
export const Is_Approved = {
  YES: true,
  NO: false,
};
export const Is_Free_To_Watch = {
  YES: true,
  NO: false,
};

export const ResponseMessage = (message: string) =>
  SetMetadata('responseMessage', message);

export const localStoragePath: string = join(
  __dirname,
  '..',
  '..',
  'public',
  'uploads',
);
