<template>
  <div class="ma-4">
    <v-btn
      color="primary"
      class="float-right"
      @click="saveClick"
      >Save</v-btn
    >

    <h2 class="mb-3">{{ month.month }} {{ month.year }}</h2>
    <v-btn
      v-if="month.month == 'April'"
      color="yg_sun"
      class="float-right mb-3"
      size="small"
      @click="duplicateEstimatesClick"
    >
      <v-icon>mdi-content-copy</v-icon> Replicate Estimates
    </v-btn>

    <div
      v-for="section of month.sections"
      style="clear: both"
    >
      <h4>{{ section.sectionName }}</h4>

      <table
        style="width: 100%"
        cellpadding="0"
        cellspacing="0"
        border="0px"
      >
        <tr class="text-left">
          <td style="width: 180px"></td>
          <td
            class="pl-4"
            style="width: 120px"
          >
            Per child
          </td>
          <td
            class="pl-4"
            style="width: 120px"
          >
            Est
          </td>
          <td class="pl-4">Est Total</td>
          <td
            class="pl-4"
            style="width: 120px"
          >
            Act
          </td>
          <td class="pl-4">Act Total</td>
        </tr>
        <tr
          v-for="line of section.lines"
          class="monospace"
        >
          <td>{{ line.lineName }}</td>
          <td>
            <v-text-field
              :value="formatMoney(line.monthlyAmount)"
              density="compact"
              hide-details
              readonly
              style="background-color: #eee"
            ></v-text-field>
          </td>
          <td>
            <v-text-field
              v-model="line.estChildCount"
              density="compact"
              hide-details
              @change="changeLine(line)"
            ></v-text-field>
          </td>
          <td>
            <v-text-field
              :value="formatMoney(line.estComputedTotal)"
              density="compact"
              hide-details
              readonly
              style="background-color: #eee"
            ></v-text-field>
          </td>
          <td>
            <v-text-field
              v-model="line.actChildCount"
              density="compact"
              hide-details
              @change="changeLine(line)"
            ></v-text-field>
          </td>

          <td>
            <v-text-field
              :value="formatMoney(line.actComputedTotal)"
              density="compact"
              hide-details
              readonly
              style="background-color: #eee"
            ></v-text-field>
          </td>
        </tr>
        <tr class="monospace total">
          <td>SECTION TOTAL</td>
          <td></td>
          <td>
            <v-text-field
              :value="
                section.lines.reduce((a: number, v: any) => a + parseInt(v.estChildCount || 0), 0)
              "
              density="compact"
              hide-details
              readonly
              style="background-color: #eee"
            ></v-text-field>
          </td>
          <td>
            <v-text-field
              :value="
                formatMoney(
                  section.lines.reduce(
                    (a: number, v: any) => a + parseFloat(v.estComputedTotal || 0),
                    0
                  )
                )
              "
              density="compact"
              hide-details
              readonly
              style="background-color: #eee"
            ></v-text-field>
          </td>
          <td>
            <v-text-field
              :value="
                section.lines.reduce((a: number, v: any) => a + parseInt(v.actChildCount || 0), 0)
              "
              density="compact"
              hide-details
              readonly
              style="background-color: #eee"
            ></v-text-field>
          </td>
          <td>
            <v-text-field
              :value="
                formatMoney(
                  section.lines.reduce(
                    (a: number, v: any) => a + parseFloat(v.actComputedTotal || 0),
                    0
                  )
                )
              "
              density="compact"
              hide-details
              readonly
              style="background-color: #eee"
            ></v-text-field>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>
<script lang="ts">
import { mapActions } from "pinia"
import { useCentreStore } from "../store"

export default {
  name: "MonthlyWorksheet",
  props: ["month"],
  setup() {},
  data: () => ({}),
  computed: {},
  methods: {
    ...mapActions(useCentreStore, ["saveWorksheet", "duplicateAprilEstimates"]),

    formatMoney(amount: any, decimalCount = 2, decimal = ".", thousands = ",") {
      try {
        decimalCount = Math.abs(decimalCount)
        decimalCount = isNaN(decimalCount) ? 2 : decimalCount

        const negativeSign = amount < 0 ? "-" : ""

        const i = parseInt((amount = Math.abs(amount || 0).toFixed(decimalCount))).toString()
        const j = i.length > 3 ? i.length % 3 : 0

        return (
          negativeSign +
          "$" +
          (j ? i.substr(0, j) + thousands : "") +
          i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) +
          (decimalCount
            ? decimal +
              Math.abs(parseFloat(amount) - parseFloat(i))
                .toFixed(decimalCount)
                .slice(2)
            : "")
        )
      } catch (e) {
        console.log(e)
      }
    },
    changeLine(line: any) {
      line.estChildCount = parseInt(line.estChildCount || 0)
      line.actChildCount = parseInt(line.actChildCount || 0)
      line.estComputedTotal = line.monthlyAmount * line.estChildCount
      line.actComputedTotal = line.monthlyAmount * line.actChildCount
    },
    async saveClick() {
      await this.saveWorksheet(this.month)
    },
    duplicateEstimatesClick() {
      this.duplicateAprilEstimates()
    },
  },
}
</script>
<style>
.monospace .v-text-field .v-field input.v-field__input {
  font-family: "Courier Prime", monospace !important;
}
.monospace.total .v-text-field .v-field input.v-field__input {
  font-weight: 700;
}
</style>

<style scoped>
h4 {
  margin-bottom: 10px;
  font-weight: 400;
  background-color: #55b6c2;
  margin-left: -8px;
  padding: 8px;
  border-radius: 4px;
  margin-top: 13px;
}
</style>
