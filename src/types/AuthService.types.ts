import IUser, { UserAttr } from './User.types'

export default interface IAuthService {
  createUser: (user: UserAttr) => Promise<IUser>
}
