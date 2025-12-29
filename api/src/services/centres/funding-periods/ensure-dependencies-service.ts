import { Centre, FundingPeriod } from "@/models"
import BaseService from "@/services/base-service"
import EnsureChildrenService from "./ensure-children-service"

/**
 * @deprecated - use EnsureChildrenService instead
 */
export class EnsureDependenciesService extends BaseService {
  constructor(
    private centre: Centre,
    private fundingPeriod: FundingPeriod
  ) {
    super()
  }

  async perform(): Promise<void> {
    return EnsureChildrenService.perform(this.centre, this.fundingPeriod)
  }
}

export default EnsureDependenciesService
