import { defineStore } from "pinia";
import { uniq, cloneDeep, sortBy, last } from "lodash";

import { useNotificationStore } from "@/store/NotificationStore";
import { useApiStore } from "@/store/ApiStore";
import { SUBMISSION_LINES_URL } from "@/urls";

const m = useNotificationStore();

interface AdminState {
  lines: FundingSubmissionLine[];
  selectedLine: FundingSubmissionLine | undefined;
  isLoading: boolean;
  newFiscalYear: NewFiscalYear | undefined;
  currentFiscalYear: string;
}

export const useSubmissionLinesStore = defineStore("linesAdmin", {
  state: (): AdminState => ({
    lines: [],
    isLoading: false,
    selectedLine: undefined,
    newFiscalYear: undefined,
    currentFiscalYear: "",
  }),
  getters: {
    linesCount(state) {
      if (state && state.lines) return state.lines.length;
      return 0;
    },
    fiscalYears(state) {
      if (state && state.lines) return uniq(state.lines.map((l) => l.fiscal_year));
      return [];
    },
  },
  actions: {
    async initialize() {
      console.log("Initializing useSubmissionLinesStore");
      await this.getAllSubmissionLines();
    },

    async getAllSubmissionLines() {
      this.isLoading = true;
      const api = useApiStore();
      await api
        .secureCall("get", SUBMISSION_LINES_URL)
        .then((resp) => {
          this.lines = resp.data;
          this.currentFiscalYear = last(sortBy(this.lines, [(o) => o.fiscal_year]))?.fiscal_year || "";
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    selectLine(user: any) {
      this.selectedLine = cloneDeep(user);
    },
    unselectLine() {
      this.selectedLine = undefined;
    },
    async saveLine() {
      this.isLoading = true;
      const api = useApiStore();

      if (this.selectedLine != null) {
        await api
          .secureCall("put", `${SUBMISSION_LINES_URL}/${this.selectedLine.id}`, this.selectedLine)
          .then((resp) => {
            // this.lines = resp.data;
            this.unselectLine();
          })
          .finally(() => {
            this.isLoading = false;
          });

        m.notify({ text: "Submission Line saved", variant: "success" });
        this.getAllSubmissionLines();
      }
    },
    startNewFiscal() {
      this.newFiscalYear = {
        base_lines_on: this.fiscalYears[this.fiscalYears.length - 1],
        fiscal_year: "",
      };
    },
    unselectNewFiscal() {
      this.newFiscalYear = undefined;
    },
    async createNewFiscal() {
      this.isLoading = true;
      const api = useApiStore();
      await api
        .secureCall("post", `${SUBMISSION_LINES_URL}/fiscal-year`, this.newFiscalYear)
        .then(async (resp) => {
          // this.lines = resp.data;

          this.newFiscalYear = undefined;
          await this.getAllSubmissionLines();
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
  },
});

export interface FundingSubmissionLine {
  id: number;
  fiscal_year: string;
  section_name: string;
  line_name: string;
  from_age: number;
  to_age: number;
  monthly_amount: number;
}

export interface NewFiscalYear {
  fiscal_year: string;
  base_lines_on: string;
}
