import {
  ICreateMealRequestDto,
  IMealRequest,
  MealReqStatus,
} from './Meal.types'

export default interface IMealReqService {
  create: (meal: ICreateMealRequestDto) => Promise<IMealRequest>
  updateStatus: (
    userId: string,
    userRole: 'admin' | 'user',
    id: string,
    status: MealReqStatus
  ) => Promise<IMealRequest>
}
