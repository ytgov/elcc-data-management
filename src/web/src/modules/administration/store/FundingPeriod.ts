import { defineStore } from "pinia";

import { useNotificationStore } from "@/store/NotificationStore";
import { useApiStore } from "@/store/ApiStore";
import { FUNDING_PERIOD_URL } from "@/urls";

let m = useNotificationStore();

interface AdminState {
  periods: Array<FundingPeriod>;
  selectedPeriod: FundingPeriod | undefined;
  isLoading: Boolean;
}

export const useFundingPeriodStore = defineStore("periodAdmin", {
  state: (): AdminState => ({
    periods: [],
    isLoading: false,
    selectedPeriod: undefined,
  }),
  getters: {
    periodCount(state) {
      if (state && state.periods) return state.periods.length;
      return 0;
    },
  },
  actions: {
    async getAllFundingPeriods() {
      this.isLoading = true;
      let api = useApiStore();
      await api
        .secureCall("get", FUNDING_PERIOD_URL)
        .then((resp) => {
          this.periods = resp.data;
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    selectPeriod(user: any) {
      this.selectedPeriod = user;
    },
    unselectPeriod() {
      this.selectedPeriod = undefined;
    },
    async savePeriod() {
      this.isLoading = true;
      let api = useApiStore();

      if (this.selectedPeriod) {
        await api
          .secureCall("put", `${FUNDING_PERIOD_URL}/${this.selectedPeriod.id}`, this.selectedPeriod)
          .then((resp) => {
            this.periods = resp.data;
            this.unselectPeriod();
          })
          .finally(() => {
            this.isLoading = false;
          });

        m.notify({ text: "Funding Period saved", variant: "success" });
        this.getAllFundingPeriods();
      }
    },
  },
});

export interface FundingPeriod {
  id: number;
  fiscal_year: string;
  from_date: Date;
  to_date: Date;
  title: string;
  is_fiscal_year: boolean;
  is_school_month: boolean;
}
