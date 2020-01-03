import { AllowedUsersGuard } from './allowed-users.guard';

describe('AllowedUsersGuard', () => {
  it('should be defined', () => {
    expect(new AllowedUsersGuard()).toBeDefined();
  });
});
