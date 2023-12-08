import { defineStore } from "pinia"
import { uniq, cloneDeep, isNil } from "lodash"

import { useNotificationStore } from "@/store/NotificationStore"
import { useApiStore } from "@/store/ApiStore"
import { CENTRE_URL } from "@/urls"

const m = useNotificationStore()

interface CentreState {
  centres: ChildCareCentre[]
  selectedCentre: ChildCareCentre | undefined
  editingCentre: ChildCareCentre | undefined
  isLoading: boolean
  enrollmentChartLoading: boolean
  enrollmentChartData: number[]
  worksheets: any[]
}

export const useCentreStore = defineStore("centre", {
  state: (): CentreState => ({
    centres: [],
    selectedCentre: undefined,
    editingCentre: undefined,
    isLoading: false,
    enrollmentChartLoading: true,
    enrollmentChartData: [],
    worksheets: [],
  }),
  getters: {
    centreCount(state) {
      if (state.centres && state.centres.length > 0) return state.centres.length
      return 0
    },
    communityCount(state) {
      if (state.centres && state.centres.length > 0)
        return uniq(state.centres.map((c) => c.community)).length
      return 0
    },
  },
  actions: {
    async initialize() {
      console.log("Initializing Centre Store")
      await this.getAllCentres()
    },

    async getAllCentres() {
      this.isLoading = true
      const api = useApiStore()
      await api
        .secureCall("get", CENTRE_URL)
        .then((resp) => {
          this.centres = resp.data || []
        })
        .finally(() => {
          this.isLoading = false
        })
    },

    selectCentre(centre: ChildCareCentre) {
      this.selectedCentre = centre
    },
    async selectCentreById(id: number): Promise<ChildCareCentre | undefined> {
      const centreFromStore = this.centres.find((centre) => centre.id === id)
      if (!isNil(centreFromStore)) {
        this.selectedCentre = centreFromStore
        return this.selectedCentre
      }

      const api = useApiStore()
      const centre = await api.secureCall("get", `${CENTRE_URL}/${id}`)
      this.selectedCentre = centre
      return this.selectedCentre
    },
    unselectCentre() {
      this.selectedCentre = undefined
    },

    editCentre(item: ChildCareCentre) {
      this.editingCentre = cloneDeep(item)
    },
    doneEdit() {
      this.editingCentre = undefined
    },

    async loadEnrollmentData(id: number) {
      this.enrollmentChartLoading = true

      const api = useApiStore()
      await api
        .secureCall("get", `${CENTRE_URL}/${id}/enrollment`)
        .then((resp) => {
          this.enrollmentChartData = resp.data
        })
        .finally(() => {
          this.enrollmentChartLoading = false
        })
    },

    async loadWorksheets(id: number) {
      const api = useApiStore()
      await api
        .secureCall("get", `${CENTRE_URL}/${id}/worksheets`)
        .then((resp) => {
          this.worksheets = resp.data
        })
        .finally(() => {})
    },
    async save() {
      const api = useApiStore()

      if (this.editingCentre != null && this.editingCentre.id) {
        await api
          .secureCall("put", `${CENTRE_URL}/${this.editingCentre.id}`, this.editingCentre)
          .then((resp) => {
            // this.worksheets = resp.data;
            this.editingCentre = undefined
            this.selectedCentre = resp.data
            console.log("SELECT", this.selectCentre)

            m.notify({ text: "Centre saved", variant: "success" })
          })
          .finally(() => {})
      } else {
        await api
          .secureCall("post", `${CENTRE_URL}`, this.editingCentre)
          .then((resp) => {
            // this.worksheets = resp.data;
            this.editingCentre = undefined
            this.selectedCentre = resp.data

            m.notify({ text: "Centre created", variant: "success" })
          })
          .finally(() => {})
      }
      this.getAllCentres()
    },

    async saveWorksheet(worksheet: any, reload = true) {
      let id = 0
      if (this.selectedCentre != null) id = this.selectedCentre.id || 0

      const api = useApiStore()
      await api
        .secureCall("put", `${CENTRE_URL}/${id}/worksheet/${worksheet.id}`, worksheet)
        .then((resp) => {
          // this.selectedCentre = resp.data;
          if (reload) this.loadWorksheets(id)

          m.notify({ text: "Worksheet saved", variant: "success" })
        })
        .finally(() => {})
    },
  },
})

export interface ChildCareCentre {
  id?: number
  name: string
  license: string
  community: string
  status: string
  hotMeal: boolean
  licensedFor: number
  lastSubmission?: Date
  createDate: Date
}
