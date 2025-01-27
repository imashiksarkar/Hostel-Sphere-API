import { Err } from 'http-staror'
import User from '../models/User.model'
import IAuthService from '../types/AuthService.types'
import { UserAttr } from '../types/User.types'
import { setCustomUserClaims } from './firebase.service'

export default class AuthService implements IAuthService {
  createUser = async (userInput: UserAttr) => {
    const existingUser = await User.findOne({ fbId: userInput.fbId })
    if (existingUser)
      throw Err.setStatus('Conflict').setMessage('User already exists')

    const user = new User(userInput)

    await setCustomUserClaims(userInput.fbId, {
      role: 'user',
      userId: user._id,
    })

    return await user.save()
  }

  listUsers = async (searchText?: string) => {
    const search = searchText ? { $text: { $search: searchText } } : {}

    const users = await User.find(search)
    return users
  }
}
