import IUser, { UserAttr } from './User.types'

export default interface IAuthService {
  createUser: (user: UserAttr) => Promise<IUser>
  listUsers: (
    searchText?: string,
    skip?: number
  ) => Promise<{ totalDocs: number; users: IUser[] }>
  changeUserRole: (userId: string, role: 'admin' | 'user') => Promise<IUser>
}
