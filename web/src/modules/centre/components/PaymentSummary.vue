<template>
  <div class="ma-4">
    <div class="">
      <table
        class="table monospace"
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
export default {
  name: "MonthlyWorksheet",
  props: ["month"],
  setup() {},
}
</script>
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
th {
  text-align: left;
  padding: 4px 6px;
}
td {
  text-align: right;
  padding: 4px 6px;
}
.total th {
  text-align: right;
}

.table > td {
  border: 1px #ccc solid;
}
.table > th {
  border: 1px #ccc solid;
  font-weight: bold;
}

.g1 td,
.g1 th {
  background-color: #ddd;
  border-left: 1px #ccc solid;
  border-right: 1px #ccc solid;
}
.table .g2 td,
.table .g2 th {
  background-color: #eee;
  border-left: 1px #ddd solid;
  border-right: 1px #ddd solid;
}
.table .total th {
  background-color: #7a9a0199;
  border-left: 1px #ddd solid;
  border-right: 1px #ddd solid;
}

.table.monospace .g2 td,
.table.monospace .g2 th {
  font-family: "Courier Prime", monospace !important;
}

.table.monospace .g1 td {
  font-family: "Courier Prime", monospace !important;
}

.table.monospace th {
  font-family: "Courier Prime", monospace !important;
  font-weight: 700 !important;
}

.table.monospace td,
.table.monospace td {
  font-family: "Courier Prime", monospace !important;
}
</style>
