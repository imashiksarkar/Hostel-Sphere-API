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

  listUsers = async (searchText?: string, skip: number = 0) => {
    const search = searchText ? { $text: { $search: searchText } } : {}

    const totalDocs = await User.find(search).countDocuments()
    const users = await User.find(search).skip(skip).limit(10)

    return { totalDocs, users }
  }

  changeUserRole = async (userId: string, role: 'admin' | 'user') => {
    const user = await User.findById(userId)
    if (!user) throw Err.setStatus('NotFound').setMessage('User not found')

    user.role = role

    await setCustomUserClaims(user.fbId, {
      role,
      userId: user._id,
    })

    return await user.save()
  }
}
