<template>
  <div class="ma-4">
    <v-btn
      color="primary"
      @click="saveClick"
      class="float-right"
      >Save</v-btn
    >

    <h2 class="mb-3">{{ month.month }} {{ month.year }}</h2>
    <v-btn
      @click="duplicateEstimatesClick"
      v-if="month.month == 'April'"
      color="yg_sun"
      class="float-right mb-3"
      size="small"
    >
      <v-icon>mdi-content-copy</v-icon> Replicate Estimates
    </v-btn>

    <div
      v-for="section of month.sections"
      style="clear: both"
    >
      <h4>{{ section.section_name }}</h4>

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
          class="monospace"
          v-for="line of section.lines"
        >
          <td>{{ line.line_name }}</td>
          <td>
            <v-text-field
              :value="formatMoney(line.monthly_amount)"
              density="compact"
              hide-details
              readonly
              style="background-color: #eee"
            ></v-text-field>
          </td>
          <td>
            <v-text-field
              v-model="line.est_child_count"
              density="compact"
              hide-details
              @change="changeLine(line)"
            ></v-text-field>
          </td>
          <td>
            <v-text-field
              :value="formatMoney(line.est_computed_total)"
              density="compact"
              hide-details
              readonly
              style="background-color: #eee"
            ></v-text-field>
          </td>
          <td>
            <v-text-field
              v-model="line.act_child_count"
              density="compact"
              hide-details
              @change="changeLine(line)"
            ></v-text-field>
          </td>

          <td>
            <v-text-field
              :value="formatMoney(line.act_computed_total)"
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
                section.lines.reduce((a: number, v: any) => a + parseInt(v.est_child_count || 0), 0)
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
                    (a: number, v: any) => a + parseFloat(v.est_computed_total || 0),
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
                section.lines.reduce((a: number, v: any) => a + parseInt(v.act_child_count || 0), 0)
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
                    (a: number, v: any) => a + parseFloat(v.act_computed_total || 0),
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
  props: ["month"],
  name: "MonthlyWorksheet",
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

        let i = parseInt((amount = Math.abs(amount || 0).toFixed(decimalCount))).toString()
        let j = i.length > 3 ? i.length % 3 : 0

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
      line.est_child_count = parseInt(line.est_child_count || 0)
      line.act_child_count = parseInt(line.act_child_count || 0)
      line.est_computed_total = line.monthly_amount * line.est_child_count
      line.act_computed_total = line.monthly_amount * line.act_child_count
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
