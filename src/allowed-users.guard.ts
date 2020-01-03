import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import env from './@shared/env-shared/env';

@Injectable()
/**
 * Only allow some users
 */
export class AllowedUsersGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Get required data
    const user: string = context.switchToHttp().getRequest().user;
    const allowedUsers: string[] = env.config.MESSAGING_ALLOWED_USERS ? env.config.MESSAGING_ALLOWED_USERS.split(',' ) : null;

    // Check data exitence
    if (!user || !allowedUsers) {
      return false;
    }

    // Return value
    return allowedUsers.includes(user);
  }
}
