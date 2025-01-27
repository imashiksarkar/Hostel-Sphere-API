import { model, Schema, Document, Model } from 'mongoose'
import IUser, { UserAttr } from '../types/User.types'
import { USER_ROLES } from '../constants/userRoles'

type UserDocument = Document & IUser
type UserModel = Model<IUser>

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const allowedRoles = Object.values(USER_ROLES)

const UserSchema = new Schema<UserDocument>(
  {
    fbId: {
      type: String,
      trim: true,
      required: [true, 'Firebase user id is required.'],
    },
    name: {
      type: String,
      trim: true,
      required: [true, 'Name is required.'],
    },
    email: {
      type: String,
      required: [true, 'Author email is required.'],
      trim: true,
      validate: {
        validator: (authorEmail: string) => emailRegex.test(authorEmail),
        message: 'Author email must be valid.',
      },
    },
    role: {
      type: String,
      enum: allowedRoles,
      default: 'user',
    },
    image: {
      type: String,
      trim: true,
    },
    subscription: {
      type: Schema.Types.ObjectId,
      default: null,
      ref: 'Subscription',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
)

const UserModel = model<UserDocument, UserModel>('User', UserSchema)

export default class User extends UserModel {
  constructor(private input: UserAttr) {
    super(input)
  }
}
