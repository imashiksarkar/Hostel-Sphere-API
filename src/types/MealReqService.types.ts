import { ICreateMealRequestDto, IMealRequest } from './Meal.types'

export default interface IMealReqService {
  create: (meal: ICreateMealRequestDto) => Promise<IMealRequest>
}
