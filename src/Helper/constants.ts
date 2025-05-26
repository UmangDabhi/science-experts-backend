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
  BOOK = "BOOK",
}
export enum BALANCE_TYPE {
  WELCOME_BONUS = "WELCOME_BONUS",
  REFERRER_SIGNUP_BONUS = "REFERRER_SIGNUP_BONUS",
  REFEREE_SIGNUP_BONUS = "REFEREE_SIGNUP_BONUS",
  REFERRAL_PURCHASE_BONUS = "REFERRAL_PURCHASE_BONUS",
  OTHERS = "OTHERS",
};
export enum COIN_VALUE_TYPE {
  DIRECT = "DIRECT",
  PERCENTAGE = "PERCENTAGE"
};
export enum QUESTION_TYPE {
  MCQ = "MCQ",
  TRUE_FALSE = "TRUE_FALSE",
  MULTI_SELECT = "MULTI_SELECT"
};
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
