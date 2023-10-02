import { defineStore } from "pinia"
import { uniq, cloneDeep } from "lodash"
import { useNotificationStore } from "@/store/NotificationStore"
import { useSubmissionLinesStore } from "@/modules/submission-lines/store"
import { useApiStore } from "@/store/ApiStore"
import { CENTRE_URL } from "@/urls"

const m = useNotificationStore()
const subs = useSubmissionLinesStore()

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
    centres: new Array<ChildCareCentre>(),
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
          this.centres = resp.data
        })
        .finally(() => {
          this.isLoading = false
        })
    },

    selectCentre(centre: ChildCareCentre) {
      this.selectedCentre = centre
    },
    selectCentreById(id: number) {
      if (this.isLoading || this.centres.length == 0) {
        const self = this

        const handle = window.setInterval(() => {
          if (self.isLoading || this.centres.length == 0) {
          } else {
            window.clearInterval(handle)
            this.selectedCentre = this.centres.filter((c) => c.id == id)[0]
          }
        }, 100)
      } else {
        this.selectedCentre = this.centres.filter((c) => c.id == id)[0]
      }
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
    async createWorksheet(id: number) {
      const api = useApiStore()
      await api
        .secureCall("post", `${CENTRE_URL}/${id}/worksheets`, { month: "TESTING" })
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

    async addCentreFiscal(fiscalYear: string) {
      if (this.selectedCentre != null) {
        const id = this.selectedCentre.id || 0

        const api = useApiStore()
        await api
          .secureCall("post", `${CENTRE_URL}/${id}/fiscal-year`, { fiscalYear })
          .then((resp) => {
            // this.selectedCentre = resp.data;
            this.loadWorksheets(id)

            m.notify({ text: "Fiscal year added", variant: "success" })
          })
          .finally(() => {})
      }
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
    async duplicateAprilEstimates() {
      let id = 0
      if (this.selectedCentre != null) id = this.selectedCentre.id || 0

      const currentFiscalYear = subs.currentFiscalYear
      const forDup = this.worksheets.filter((w) => w.fiscalYear == currentFiscalYear)
      const aprilSheet = forDup.filter((s) => s.month == "April")[0]
      const aprilLines = aprilSheet.sections.flatMap((s: any) => s.lines)

      for (const month of forDup) {
        for (const section of month.sections) {
          for (const line of section.lines) {
            const aprilLine = aprilLines.filter(
              (a: any) => a.submissionLineId == line.submissionLineId
            )
            line.estimatedChildOccupancyRate = aprilLine[0].estimatedChildOccupancyRate
            line.estimatedComputedTotal = aprilLine[0].estimatedComputedTotal
          }
        }
        await this.saveWorksheet(month, false)
      }

      this.loadWorksheets(id)
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
