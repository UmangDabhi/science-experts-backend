import { Request } from 'express';

export interface RequestWithUser extends Request {
  user?: any; // Adjust the type here if you know the exact user type, e.g., `User`
}
