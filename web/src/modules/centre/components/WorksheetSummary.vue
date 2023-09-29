<template>
  <div class="ma-4">
    <table
      class="table monospace"
      style="width: 100%"
      cellpadding="0"
      cellspacing="0"
      border="0px"
    >
      <tr class="monospace blue top">
        <td></td>
        <td class="text-right">Est Total</td>
        <td class="text-right">Act Total</td>
        <td class="text-right"></td>
      </tr>

      <tr v-for="line of summaryLines">
        <td>
          {{ line.month }}
        </td>
        <td class="text-right">{{ formatMoney(line.est_computed_total) }}</td>
        <td class="text-right">{{ formatMoney(line.act_computed_total) }}</td>
        <td class="text-right">{{ formatMoney(line.diff) }}</td>
      </tr>

      <tr class="blue top">
        <td>year</td>
        <td class="text-right">
          {{
            formatMoney(
              yearWorksheets
                .flatMap((y: any) => y.sections)
                .flatMap((s) => s.lines)
                .reduce((a: number, v: any) => a + parseFloat(v.est_computed_total), 0)
            )
          }}
        </td>
        <td></td>
        <td class="text-right">
          {{
            formatMoney(
              yearWorksheets
                .flatMap((y: any) => y.sections)
                .flatMap((s) => s.lines)
                .reduce((a: number, v: any) => a + parseFloat(v.act_computed_total), 0)
            )
          }}
        </td>
      </tr>
    </table>
    <v-text-field
      value=""
      density="compact"
      hide-details
      readonly
      style="background-color: #eee"
    ></v-text-field>

    <div class="">
      <table
        class="table monospace d-none"
        style="width: 99%"
        table-border="none"
        cellpadding="0"
        cellspacing="0"
      >
        <tr>
          <td></td>
          <th class="text-center">Advance</th>
          <th class="text-center">Adjustments</th>
          <th class="text-center">Expenses</th>
          <th class="text-center">Balance</th>
        </tr>
        <tr class="g1">
          <th>First Advance</th>
          <td></td>
          <td></td>
          <td></td>
          <td>$0.00</td>
        </tr>
        <tr class="g1">
          <th>Apr, May Expenses</th>
          <td></td>
          <td></td>
          <td></td>
          <td>$0.00</td>
        </tr>
        <tr class="g2">
          <th>Second Advance</th>
          <td>$109,243.00</td>
          <td></td>
          <td></td>
          <td>$109,243.00</td>
        </tr>
        <tr class="g2">
          <th>Jun, Jul Expenses</th>
          <td></td>
          <td></td>
          <td>$51,061.40</td>
          <td>$58,181.60</td>
        </tr>
        <tr class="g1">
          <th>Third Advance</th>
          <td>$75,000.00</td>
          <td></td>
          <td></td>
          <td>$133,181.60</td>
        </tr>
        <tr class="g1">
          <th>Aug, Sep Expenses</th>
          <td></td>
          <td></td>
          <td></td>
          <td>$133,181.60</td>
        </tr>
        <tr class="g2">
          <th>Fourth Advance</th>
          <td></td>
          <td></td>
          <td></td>
          <td>$133,181.60</td>
        </tr>
        <tr class="g2">
          <th>Oct, Nov Expenses</th>
          <td></td>
          <td></td>
          <td></td>
          <td>$133,181.60</td>
        </tr>
        <tr class="g1">
          <th>Fifth Advance</th>
          <td></td>
          <td></td>
          <td></td>
          <td>$133,181.60</td>
        </tr>
        <tr class="g1">
          <th>Dec, Jan Expenses</th>
          <td></td>
          <td></td>
          <td></td>
          <td>$133,181.60</td>
        </tr>
        <tr class="g2">
          <th>Sixth Advance</th>
          <td></td>
          <td></td>
          <td></td>
          <td>$133,181.60</td>
        </tr>
        <tr class="g2">
          <th>Feb, Mar Expenses</th>
          <td></td>
          <td></td>
          <td></td>
          <td>$133,181.60</td>
        </tr>
        <tr class="g1">
          <th>Final Advance (Reconciliation)</th>
          <td></td>
          <td></td>
          <td></td>
          <td>$133,181.60</td>
        </tr>
        <tr class="total">
          <th class="text-left">Totals</th>
          <th>$184,243.00</th>
          <th></th>
          <th>$51,061.40</th>
          <th></th>
        </tr>
        <tr>
          <td>&nbsp;</td>
        </tr>
        <tr class="total">
          <th class="text-left">Agreement Value</th>
          <th colspan="2">T00023514</th>
          <th colspan="2">Remaining</th>
        </tr>
        <tr class="total">
          <th>$449,420.00</th>
          <th colspan="2">$184,243.00</th>
          <th colspan="2">$265,177.00</th>
        </tr>
      </table>
    </div>
  </div>
</template>
<script lang="ts">
import { useSubmissionLinesStore } from "@/modules/submission-lines/store"
import { mapState } from "pinia"
import { clone } from "lodash"
import { useCentreStore } from "../store"

export default {
  name: "WorksheetSummry",
  data: () => ({}),

  computed: {
    ...mapState(useCentreStore, ["worksheets"]),
    ...mapState(useSubmissionLinesStore, ["currentFiscalYear"]),

    yearWorksheets() {
      const t = this.worksheets.filter((w) => w.fiscalYear == this.currentFiscalYear)
      return t
    },
    allSheets() {
      return this.yearWorksheets
        .map((y) => y.sections)
        .flatMap((s: any) => s)
        .flatMap((s) => s.lines)
    },
    sectionTotals() {
      return ""
    },
    summaryLines() {
      const lines = []
      let running_est_computed_total = 0
      let running_act_computed_total = 0

      for (const line of this.yearWorksheets) {
        const rows = line.sections.flatMap((y: any) => y).flatMap((s: any) => s.lines)

        /* let v1 = line.flatMap((y: any) => y.sections)
                .flatMap((s:any) => s.lines)
                .reduce((a: number, v: any) => a + parseFloat(v.act_child_count), 0) */

        // console.log(v1);
        const monthVal = {
          month: line.month,
          est_computed_total: rows.reduce(
            (a: number, v: any) => a + parseFloat(v.est_computed_total),
            0
          ),
          act_computed_total: rows.reduce(
            (a: number, v: any) => a + parseFloat(v.act_computed_total),
            0
          ),
          diff: 0,
        }

        monthVal.diff = monthVal.est_computed_total - monthVal.act_computed_total

        lines.push(monthVal)

        running_est_computed_total += monthVal.est_computed_total
        running_act_computed_total += monthVal.act_computed_total

        console.log(running_est_computed_total, monthVal.est_computed_total)

        if (line.month == "June") {
          lines.push({
            month: "Initial Advance (3 mos)",
            est_computed_total: running_est_computed_total,
            act_computed_total: running_act_computed_total,
            diff: running_est_computed_total - running_act_computed_total,
          })
          running_est_computed_total = running_act_computed_total = 0
        } else if (line.month == "August") {
          lines.push({
            month: "Second Advance (2 mos) ",
            est_computed_total: running_est_computed_total,
            act_computed_total: running_act_computed_total,
            diff: running_est_computed_total - running_act_computed_total,
          })
          running_est_computed_total = running_act_computed_total = 0
        } else if (line.month == "October") {
          lines.push({
            month: "Third Advance (2 mos) ",
            est_computed_total: running_est_computed_total,
            act_computed_total: running_act_computed_total,
            diff: running_est_computed_total - running_act_computed_total,
          })
          running_est_computed_total = running_act_computed_total = 0
        } else if (line.month == "December") {
          lines.push({
            month: "Fourth Advance (2 mos) ",
            est_computed_total: running_est_computed_total,
            act_computed_total: running_act_computed_total,
            diff: running_est_computed_total - running_act_computed_total,
          })
          running_est_computed_total = running_act_computed_total = 0
        } else if (line.month == "February") {
          lines.push({
            month: "Fifth Advance (2 mos) ",
            est_computed_total: running_est_computed_total,
            act_computed_total: running_act_computed_total,
            diff: running_est_computed_total - running_act_computed_total,
          })
          running_est_computed_total = running_act_computed_total = 0
        }
      }

      return lines
    },
  },
  methods: {
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
    format2Dec(num: any, den: any) {
      if (den === 0 || num === 0) {
        return 0.0
      }

      console.log(num, den)

      return Math.round((num / den) * 100) / 100
    },
  },
}
</script>
<style>
.monospace td {
  padding: 2px 6px;
  font-family: "Courier Prime", monospace !important;
  font-size: 14px;
}
tr.blue td {
  background-color: #e7e7e7;
}
tr.blue.top td {
  background-color: #ccc;
  border-top: 1px #ccc solid;
  border-bottom: 1px #ccc solid;
  font-weight: 700;
}
tr.green td {
  background-color: #f7f7f7;
}
tr.green.top td {
  background-color: #ddd;
  border-top: 1px #ccc solid;
  border-bottom: 1px #ccc solid;
  font-weight: 700;
}
tr.blue td:first-child,
tr.green td:first-child {
  border-left: 1px #ccc solid;
}
tr.blue td:last-child,
tr.green td:last-child {
  border-right: 1px #ccc solid;
}
</style>
