import { Err } from 'http-staror'
import User from '../models/User.model'
import IAuthService from '../types/AuthService.types'
import { UserAttr } from '../types/User.types'

export default class AuthService implements IAuthService {
  createUser = async (userInput: UserAttr) => {
    const existingUser = await User.findOne({ fbId: userInput.fbId })
    if (existingUser) throw Err.setStatus('Conflict').setMessage('User already exists')

    const user = new User(userInput)
    return await user.save()
  }
}
