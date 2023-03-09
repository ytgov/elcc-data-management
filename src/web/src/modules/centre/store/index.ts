import { defineStore } from "pinia";
import { uniq } from "lodash";
import { useNotificationStore } from "@/store/NotificationStore";
import { useApiStore } from "@/store/ApiStore";
import { CENTRE_URL } from "@/urls";

let m = useNotificationStore();

interface CentreState {
  centres: Array<ChildCareCentre>;
  selectedCentre: ChildCareCentre | undefined;
  isLoading: Boolean;
  enrollmentChartLoading: Boolean;
  enrollmentChartData: number[];
  worksheets: any[];
}

export const useCentreStore = defineStore("centre", {
  state: (): CentreState => ({
    centres: new Array<ChildCareCentre>(),
    selectedCentre: undefined,
    isLoading: false,
    enrollmentChartLoading: true,
    enrollmentChartData: [],
    worksheets: [],
  }),
  getters: {
    centreCount(state) {
      if (state.centres && state.centres.length > 0) return state.centres.length;
      return 0;
    },
    communityCount(state) {
      if (state.centres && state.centres.length > 0) return uniq(state.centres.map((c) => c.community)).length;
      return 0;
    },
  },
  actions: {
    async initialize() {
      console.log("Initializing Centre Store");
      await this.getAllCentres();
    },

    async getAllCentres() {
      this.isLoading = true;
      let api = useApiStore();
      await api
        .secureCall("get", CENTRE_URL)
        .then((resp) => {
          this.centres = resp.data;
        })
        .finally(() => {
          this.isLoading = false;
        });
    },

    selectCentre(centre: ChildCareCentre) {
      this.selectedCentre = centre;
    },
    selectCentreById(id: number) {
      if (this.isLoading || this.centres.length == 0) {
        let self = this;

        let handle = window.setInterval(() => {
          if (self.isLoading || this.centres.length == 0) {
          } else {
            window.clearInterval(handle);
            this.selectedCentre = this.centres.filter((c) => c.id == id)[0];
          }
        }, 100);
      } else {
        this.selectedCentre = this.centres.filter((c) => c.id == id)[0];
      }
    },
    unselectCentre() {
      this.selectedCentre = undefined;
    },

    async loadEnrollmentData(id: number) {
      this.enrollmentChartLoading = true;

      let api = useApiStore();
      await api
        .secureCall("get", `${CENTRE_URL}/${id}/enrollment`)
        .then((resp) => {
          this.enrollmentChartData = resp.data;
        })
        .finally(() => {
          this.enrollmentChartLoading = false;
        });
    },

    async loadWorksheets(id: number) {
      let api = useApiStore();
      await api
        .secureCall("get", `${CENTRE_URL}/${id}/worksheets`)
        .then((resp) => {
          this.worksheets = resp.data;
        })
        .finally(() => {});
    },
    async createWorksheet(id: number) {
      let api = useApiStore();
      await api
        .secureCall("post", `${CENTRE_URL}/${id}/worksheets`, { month: "TESTING" })
        .then((resp) => {
          this.worksheets = resp.data;
        })
        .finally(() => {});
    },

    async save() {
      //save selectedCentre to API
      console.log("SAVING", this.selectedCentre);

      m.notify("Centre saved");
      this.getAllCentres();
    },
  },
});

export interface ChildCareCentre {
  id: number;
  name: string;
  license: string;
  community: string;
  status: string;
  hot_meal: boolean;
  licensed_for: number;
  last_submission: Date;
  create_date: Date;
}
