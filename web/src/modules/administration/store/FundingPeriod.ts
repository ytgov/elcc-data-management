import { defineStore } from "pinia"

import { useNotificationStore } from "@/store/NotificationStore"
import { useApiStore } from "@/store/ApiStore"
import { FUNDING_PERIOD_URL } from "@/urls"

const m = useNotificationStore()

interface AdminState {
  periods: FundingPeriod[]
  selectedPeriod: FundingPeriod | undefined
  isLoading: boolean
}

export const useFundingPeriodStore = defineStore("periodAdmin", {
  state: (): AdminState => ({
    periods: [],
    isLoading: false,
    selectedPeriod: undefined,
  }),
  getters: {
    periodCount(state) {
      if (state && state.periods) return state.periods.length
      return 0
    },
  },
  actions: {
    async getAllFundingPeriods() {
      this.isLoading = true
      const api = useApiStore()
      await api
        .secureCall("get", FUNDING_PERIOD_URL)
        .then((resp) => {
          this.periods = resp.data
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    selectPeriod(user: any) {
      this.selectedPeriod = user
    },
    unselectPeriod() {
      this.selectedPeriod = undefined
    },
    async savePeriod() {
      this.isLoading = true
      const api = useApiStore()

      if (this.selectedPeriod != null) {
        await api
          .secureCall("put", `${FUNDING_PERIOD_URL}/${this.selectedPeriod.id}`, this.selectedPeriod)
          .then((resp) => {
            this.periods = resp.data
            this.unselectPeriod()
          })
          .finally(() => {
            this.isLoading = false
          })

        m.notify({ text: "Funding Period saved", variant: "success" })
        this.getAllFundingPeriods()
      }
    },
  },
})

export interface FundingPeriod {
  id: number
  fiscalYear: string
  fromDate: Date
  toDate: Date
  title: string
  isFiscalYear: boolean
  isSchoolMonth: boolean
}
