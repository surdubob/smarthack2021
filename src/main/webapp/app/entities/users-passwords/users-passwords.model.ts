import { IUser } from 'app/entities/user/user.model';

export interface IUsersPasswords {
  id?: string;
  secret?: string | null;
  type?: string | null;
  platform?: string | null;
  user?: IUser | null;
}

export class UsersPasswords implements IUsersPasswords {
  constructor(
    public id?: string,
    public secret?: string | null,
    public type?: string | null,
    public platform?: string | null,
    public user?: IUser | null
  ) {}
}

export function getUsersPasswordsIdentifier(usersPasswords: IUsersPasswords): string | undefined {
  return usersPasswords.id;
}
