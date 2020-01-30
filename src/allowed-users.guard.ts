import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import env from './@shared/env-shared/env';
import fetch, { Response } from 'node-fetch';

@Injectable()
/**
 * Only allow some users
 */
export class AllowedUsersGuard implements CanActivate {

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    // Check the bearer JSON token
    if (
      !context.switchToHttp().getRequest().headers ||
      !context.switchToHttp().getRequest().headers.authorization
    ) {
      return false;
    }

    // Get user ID from bearer token
    const response: Response = await fetch(env.config.AUTH_URL + '/api/me', {
      headers: {
        Authorization: context.switchToHttp().getRequest().headers.authorization,
      },
    });
    const jsonResponse = await response.json();
    if (!jsonResponse.user_id) {
      return false;
    }

    // Get required data
    const user: string = `${jsonResponse.user_id}`;
    const allowedUsers: string[] = env.config.ALLOWED_USERS ? env.config.ALLOWED_USERS.split(',' ) : null;

    // Check data exitence
    if (!user || !allowedUsers) {
      return false;
    }

    // Guard return
    return allowedUsers.includes(user);
  }
}
