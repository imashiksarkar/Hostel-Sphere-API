import {
  ICreateMealRequestDto,
  IMealRequest,
  MealReqStatus,
} from './Meal.types'

export default interface IMealReqService {
  create: (meal: ICreateMealRequestDto) => Promise<IMealRequest>
  find: (userId?: string) => Promise<IMealRequest[]> // return all meal requests if the user id is not provided
  updateStatus: (
    userId: string,
    userRole: 'admin' | 'user',
    id: string,
    status: MealReqStatus
  ) => Promise<IMealRequest>
}
