<template>
  <div class="ma-4">
    <h2 class="mb-3">{{ month }}</h2>

    <div class="">
      <h4>Child Care Spaces</h4>

      <table style="width: 100%" cellpadding="0" cellspacing="0" border="0px">
        <tr class="text-left">
          <td></td>
          <td class="pl-4">Per child</td>
          <td class="pl-4" style="width: 120px">In School</td>
          <td class="pl-4" style="width: 120px">Out of School</td>
          <td class="pl-4">Total</td>
        </tr>
        <tr class="monospace">
          <td>Infants</td>
          <td><v-text-field value="$700.00" density="compact" hide-details></v-text-field></td>
          <td><v-text-field v-model="r11" density="compact" hide-details></v-text-field></td>
          <td><v-text-field v-model="r12" density="compact" hide-details></v-text-field></td>
          <td><v-text-field v-model="r13" density="compact" hide-details readonly></v-text-field></td>
        </tr>
        <tr class="monospace">
          <td>Toddlers</td>
          <td><v-text-field value="$700.00" density="compact" hide-details></v-text-field></td>
          <td><v-text-field v-model="r21" density="compact" hide-details></v-text-field></td>
          <td><v-text-field v-model="r22" density="compact" hide-details></v-text-field></td>
          <td><v-text-field v-model="r23" density="compact" hide-details readonly></v-text-field></td>
        </tr>
        <tr class="monospace">
          <td>Preschool</td>
          <td><v-text-field value="$700.00" density="compact" hide-details></v-text-field></td>
          <td><v-text-field value="" density="compact" hide-details></v-text-field></td>
          <td><v-text-field value="" density="compact" hide-details></v-text-field></td>
          <td><v-text-field value="" density="compact" hide-details></v-text-field></td>
        </tr>
        <tr class="monospace">
          <td>Kindergarten (PT)</td>
          <td><v-text-field value="$350.00" density="compact" hide-details></v-text-field></td>
          <td><v-text-field value="" density="compact" hide-details></v-text-field></td>
          <td><v-text-field value="" density="compact" hide-details></v-text-field></td>
          <td><v-text-field value="" density="compact" hide-details></v-text-field></td>
        </tr>
        <tr class="monospace">
          <td>Kindergarten (FT)</td>
          <td><v-text-field value="$700.00" density="compact" hide-details></v-text-field></td>
          <td><v-text-field value="" density="compact" hide-details></v-text-field></td>
          <td><v-text-field value="" density="compact" hide-details></v-text-field></td>
          <td><v-text-field value="" density="compact" hide-details></v-text-field></td>
        </tr>
        <tr class="monospace">
          <td>School Age (PT)</td>
          <td><v-text-field value="$300.00" density="compact" hide-details></v-text-field></td>
          <td><v-text-field value="" density="compact" hide-details></v-text-field></td>
          <td><v-text-field value="" density="compact" hide-details></v-text-field></td>
          <td><v-text-field value="" density="compact" hide-details></v-text-field></td>
        </tr>
        <tr class="monospace">
          <td>School Aage (FT)</td>
          <td><v-text-field value="$700.00" density="compact" hide-details></v-text-field></td>
          <td><v-text-field value="" density="compact" hide-details></v-text-field></td>
          <td><v-text-field value="" density="compact" hide-details></v-text-field></td>
          <td><v-text-field value="" density="compact" hide-details></v-text-field></td>
        </tr>
      </table>

      <h4>Child Care (Administration 10%)</h4>

      <table style="width: 100%" cellpadding="0" cellspacing="0" border="0px">
        <tr class="text-left">
          <td></td>
          <td class="pl-4">Per child</td>
          <td class="pl-4" style="width: 120px">In School</td>
          <td class="pl-4" style="width: 120px">Out of School</td>
          <td class="pl-4">Total</td>
        </tr>
        <tr class="monospace">
          <td>Infants</td>
          <td><v-text-field value="$70.00" density="compact" hide-details></v-text-field></td>
          <td><v-text-field value="8" density="compact" hide-details></v-text-field></td>
          <td><v-text-field value="8" density="compact" hide-details></v-text-field></td>
          <td><v-text-field value="$6,720.00" density="compact" hide-details></v-text-field></td>
        </tr>
        <tr class="monospace">
          <td>Toddlers</td>
          <td><v-text-field value="$70.00" density="compact" hide-details></v-text-field></td>
          <td><v-text-field value="12" density="compact" hide-details></v-text-field></td>
          <td><v-text-field value="12" density="compact" hide-details></v-text-field></td>
          <td><v-text-field value="$10.080.00" density="compact" hide-details></v-text-field></td>
        </tr>
        <tr class="monospace">
          <td>Preschool</td>
          <td><v-text-field value="$70.00" density="compact" hide-details></v-text-field></td>
          <td><v-text-field value="" density="compact" hide-details></v-text-field></td>
          <td><v-text-field value="" density="compact" hide-details></v-text-field></td>
          <td><v-text-field value="" density="compact" hide-details></v-text-field></td>
        </tr>
        <tr class="monospace">
          <td>Kindergarten (PT)</td>
          <td><v-text-field value="$35.00" density="compact" hide-details></v-text-field></td>
          <td><v-text-field value="" density="compact" hide-details></v-text-field></td>
          <td><v-text-field value="" density="compact" hide-details></v-text-field></td>
          <td><v-text-field value="" density="compact" hide-details></v-text-field></td>
        </tr>
        <tr class="monospace">
          <td>Kindergarten (FT)</td>
          <td><v-text-field value="$70.00" density="compact" hide-details></v-text-field></td>
          <td><v-text-field value="" density="compact" hide-details></v-text-field></td>
          <td><v-text-field value="" density="compact" hide-details></v-text-field></td>
          <td><v-text-field value="" density="compact" hide-details></v-text-field></td>
        </tr>
        <tr class="monospace">
          <td>School Age (PT)</td>
          <td><v-text-field value="$30.00" density="compact" hide-details></v-text-field></td>
          <td><v-text-field value="" density="compact" hide-details></v-text-field></td>
          <td><v-text-field value="" density="compact" hide-details></v-text-field></td>
          <td><v-text-field value="" density="compact" hide-details></v-text-field></td>
        </tr>
        <tr class="monospace">
          <td>School Aage (FT)</td>
          <td><v-text-field value="$50.00" density="compact" hide-details></v-text-field></td>
          <td><v-text-field value="" density="compact" hide-details></v-text-field></td>
          <td><v-text-field value="" density="compact" hide-details></v-text-field></td>
          <td><v-text-field value="" density="compact" hide-details></v-text-field></td>
        </tr>
      </table>
      <h4>Quality Program Enhancement</h4>

      <table style="width: 100%" cellpadding="0" cellspacing="0" border="0px">
        <tr class="text-left">
          <td></td>
          <td class="pl-4">Per child</td>
          <td class="pl-4" style="width: 120px">In School</td>
          <td class="pl-4" style="width: 120px">Out of School</td>
          <td class="pl-4">Total</td>
        </tr>
        <tr class="monospace">
          <td>Infants</td>
          <td><v-text-field value="$700.00" density="compact" hide-details></v-text-field></td>
          <td><v-text-field value="4" density="compact" hide-details></v-text-field></td>
          <td><v-text-field value="4" density="compact" hide-details></v-text-field></td>
          <td><v-text-field value="$30,800.00" density="compact" hide-details></v-text-field></td>
        </tr>
        <tr class="monospace">
          <td>Toddlers</td>
          <td><v-text-field value="$700.00" density="compact" hide-details></v-text-field></td>
          <td><v-text-field value="4" density="compact" hide-details></v-text-field></td>
          <td><v-text-field value="4" density="compact" hide-details></v-text-field></td>
          <td><v-text-field value="$30,800.00" density="compact" hide-details></v-text-field></td>
        </tr>
        <tr class="monospace">
          <td>Preschool</td>
          <td><v-text-field value="$700.00" density="compact" hide-details></v-text-field></td>
          <td><v-text-field value="4" density="compact" hide-details></v-text-field></td>
          <td><v-text-field value="4" density="compact" hide-details></v-text-field></td>
          <td><v-text-field value="$30,800.00" density="compact" hide-details></v-text-field></td>
        </tr>
        <tr class="monospace">
          <td>Kindergarten (PT)</td>
          <td><v-text-field value="$700.00" density="compact" hide-details></v-text-field></td>
          <td><v-text-field value="4" density="compact" hide-details></v-text-field></td>
          <td><v-text-field value="4" density="compact" hide-details></v-text-field></td>
          <td><v-text-field value="$30,800.00" density="compact" hide-details></v-text-field></td>
        </tr>
        <tr class="monospace">
          <td>Kindergarten (FT)</td>
          <td><v-text-field value="$700.00" density="compact" hide-details></v-text-field></td>
          <td><v-text-field value="4" density="compact" hide-details></v-text-field></td>
          <td><v-text-field value="4" density="compact" hide-details></v-text-field></td>
          <td><v-text-field value="$30,800.00" density="compact" hide-details></v-text-field></td>
        </tr>
        <tr class="monospace">
          <td>School Age (PT)</td>
          <td><v-text-field value="$700.00" density="compact" hide-details></v-text-field></td>
          <td><v-text-field value="4" density="compact" hide-details></v-text-field></td>
          <td><v-text-field value="4" density="compact" hide-details></v-text-field></td>
          <td><v-text-field value="$30,800.00" density="compact" hide-details></v-text-field></td>
        </tr>
        <tr class="monospace">
          <td>School Aage (FT)</td>
          <td><v-text-field value="$700.00" density="compact" hide-details></v-text-field></td>
          <td><v-text-field value="4" density="compact" hide-details></v-text-field></td>
          <td><v-text-field value="4" density="compact" hide-details></v-text-field></td>
          <td><v-text-field value="$30,800.00" density="compact" hide-details></v-text-field></td>
        </tr>
      </table>
      <h4>Children with Special Needs</h4>

      <table style="width: 100%" cellpadding="0" cellspacing="0" border="0px">
        <tr class="text-left">
          <td></td>
          <td class="pl-4">Per child</td>
          <td class="pl-4" style="width: 120px">In School</td>
          <td class="pl-4" style="width: 120px">Out of School</td>
          <td class="pl-4">Total</td>
        </tr>
        <tr class="monospace">
          <td>Infants</td>
          <td><v-text-field value="$700.00" density="compact" hide-details></v-text-field></td>
          <td><v-text-field value="4" density="compact" hide-details></v-text-field></td>
          <td><v-text-field value="4" density="compact" hide-details></v-text-field></td>
          <td><v-text-field value="$30,800.00" density="compact" hide-details></v-text-field></td>
        </tr>
        <tr class="monospace">
          <td>Toddlers</td>
          <td><v-text-field value="$700.00" density="compact" hide-details></v-text-field></td>
          <td><v-text-field value="4" density="compact" hide-details></v-text-field></td>
          <td><v-text-field value="4" density="compact" hide-details></v-text-field></td>
          <td><v-text-field value="$30,800.00" density="compact" hide-details></v-text-field></td>
        </tr>
        <tr class="monospace">
          <td>Preschool</td>
          <td><v-text-field value="$700.00" density="compact" hide-details></v-text-field></td>
          <td><v-text-field value="4" density="compact" hide-details></v-text-field></td>
          <td><v-text-field value="4" density="compact" hide-details></v-text-field></td>
          <td><v-text-field value="$30,800.00" density="compact" hide-details></v-text-field></td>
        </tr>
        <tr class="monospace">
          <td>Kindergarten (PT)</td>
          <td><v-text-field value="$700.00" density="compact" hide-details></v-text-field></td>
          <td><v-text-field value="4" density="compact" hide-details></v-text-field></td>
          <td><v-text-field value="4" density="compact" hide-details></v-text-field></td>
          <td><v-text-field value="$30,800.00" density="compact" hide-details></v-text-field></td>
        </tr>
        <tr class="monospace">
          <td>Kindergarten (FT)</td>
          <td><v-text-field value="$700.00" density="compact" hide-details></v-text-field></td>
          <td><v-text-field value="4" density="compact" hide-details></v-text-field></td>
          <td><v-text-field value="4" density="compact" hide-details></v-text-field></td>
          <td><v-text-field value="$30,800.00" density="compact" hide-details></v-text-field></td>
        </tr>
        <tr class="monospace">
          <td>School Age (PT)</td>
          <td><v-text-field value="$700.00" density="compact" hide-details></v-text-field></td>
          <td><v-text-field value="4" density="compact" hide-details></v-text-field></td>
          <td><v-text-field value="4" density="compact" hide-details></v-text-field></td>
          <td><v-text-field value="$30,800.00" density="compact" hide-details></v-text-field></td>
        </tr>
        <tr class="monospace">
          <td>School Aage (FT)</td>
          <td><v-text-field value="$700.00" density="compact" hide-details></v-text-field></td>
          <td><v-text-field value="4" density="compact" hide-details></v-text-field></td>
          <td><v-text-field value="4" density="compact" hide-details></v-text-field></td>
          <td><v-text-field value="$30,800.00" density="compact" hide-details></v-text-field></td>
        </tr>
      </table>
      <h4>Building Expenses</h4>

      <table style="width: 100%" cellpadding="0" cellspacing="0" border="0px">
        <tr class="text-left">
          <td></td>
          <td class="pl-4">Per child</td>
          <td class="pl-4" style="width: 120px">In School</td>
          <td class="pl-4" style="width: 120px">Out of School</td>
          <td class="pl-4">Total</td>
        </tr>
        <tr class="monospace">
          <td>Infants</td>
          <td><v-text-field value="$700.00" density="compact" hide-details></v-text-field></td>
          <td><v-text-field value="8" density="compact" hide-details></v-text-field></td>
          <td><v-text-field value="8" density="compact" hide-details></v-text-field></td>
          <td><v-text-field value="$67,200.00" density="compact" hide-details></v-text-field></td>
        </tr>
        <tr class="monospace">
          <td>Toddlers</td>
          <td><v-text-field value="$700.00" density="compact" hide-details></v-text-field></td>
          <td><v-text-field value="12" density="compact" hide-details></v-text-field></td>
          <td><v-text-field value="12" density="compact" hide-details></v-text-field></td>
          <td><v-text-field value="$30,800.00" density="compact" hide-details></v-text-field></td>
        </tr>
        <tr class="monospace">
          <td>Preschool</td>
          <td><v-text-field value="$700.00" density="compact" hide-details></v-text-field></td>
          <td><v-text-field value="4" density="compact" hide-details></v-text-field></td>
          <td><v-text-field value="4" density="compact" hide-details></v-text-field></td>
          <td><v-text-field value="$30,800.00" density="compact" hide-details></v-text-field></td>
        </tr>
        <tr class="monospace">
          <td>Kindergarten (PT)</td>
          <td><v-text-field value="$700.00" density="compact" hide-details></v-text-field></td>
          <td><v-text-field value="4" density="compact" hide-details></v-text-field></td>
          <td><v-text-field value="4" density="compact" hide-details></v-text-field></td>
          <td><v-text-field value="$30,800.00" density="compact" hide-details></v-text-field></td>
        </tr>
        <tr class="monospace">
          <td>Kindergarten (FT)</td>
          <td><v-text-field value="$700.00" density="compact" hide-details></v-text-field></td>
          <td><v-text-field value="4" density="compact" hide-details></v-text-field></td>
          <td><v-text-field value="4" density="compact" hide-details></v-text-field></td>
          <td><v-text-field value="$30,800.00" density="compact" hide-details></v-text-field></td>
        </tr>
        <tr class="monospace">
          <td>School Age (PT)</td>
          <td><v-text-field value="$700.00" density="compact" hide-details></v-text-field></td>
          <td><v-text-field value="4" density="compact" hide-details></v-text-field></td>
          <td><v-text-field value="4" density="compact" hide-details></v-text-field></td>
          <td><v-text-field value="$30,800.00" density="compact" hide-details></v-text-field></td>
        </tr>
        <tr class="monospace">
          <td>School Aage (FT)</td>
          <td><v-text-field value="$700.00" density="compact" hide-details></v-text-field></td>
          <td><v-text-field value="4" density="compact" hide-details></v-text-field></td>
          <td><v-text-field value="4" density="compact" hide-details></v-text-field></td>
          <td><v-text-field value="$30,800.00" density="compact" hide-details></v-text-field></td>
        </tr>
      </table>
      <h4>Covid-19 Funding</h4>

      <table style="width: 100%" cellpadding="0" cellspacing="0" border="0px">
        <tr class="text-left">
          <td></td>
          <td class="pl-4">Per child</td>
          <td class="pl-4" style="width: 120px">In School</td>
          <td class="pl-4" style="width: 120px">Out of School</td>
          <td class="pl-4">Total</td>
        </tr>
        <tr class="monospace">
          <td>Infants</td>
          <td><v-text-field value="$700.00" density="compact" hide-details></v-text-field></td>
          <td><v-text-field value="4" density="compact" hide-details></v-text-field></td>
          <td><v-text-field value="4" density="compact" hide-details></v-text-field></td>
          <td><v-text-field value="$30,800.00" density="compact" hide-details></v-text-field></td>
        </tr>
        <tr class="monospace">
          <td>Toddlers</td>
          <td><v-text-field value="$700.00" density="compact" hide-details></v-text-field></td>
          <td><v-text-field value="4" density="compact" hide-details></v-text-field></td>
          <td><v-text-field value="4" density="compact" hide-details></v-text-field></td>
          <td><v-text-field value="$30,800.00" density="compact" hide-details></v-text-field></td>
        </tr>
        <tr class="monospace">
          <td>Preschool</td>
          <td><v-text-field value="$700.00" density="compact" hide-details></v-text-field></td>
          <td><v-text-field value="4" density="compact" hide-details></v-text-field></td>
          <td><v-text-field value="4" density="compact" hide-details></v-text-field></td>
          <td><v-text-field value="$30,800.00" density="compact" hide-details></v-text-field></td>
        </tr>
        <tr class="monospace">
          <td>Kindergarten (PT)</td>
          <td><v-text-field value="$700.00" density="compact" hide-details></v-text-field></td>
          <td><v-text-field value="4" density="compact" hide-details></v-text-field></td>
          <td><v-text-field value="4" density="compact" hide-details></v-text-field></td>
          <td><v-text-field value="$30,800.00" density="compact" hide-details></v-text-field></td>
        </tr>
        <tr class="monospace">
          <td>Kindergarten (FT)</td>
          <td><v-text-field value="$700.00" density="compact" hide-details></v-text-field></td>
          <td><v-text-field value="4" density="compact" hide-details></v-text-field></td>
          <td><v-text-field value="4" density="compact" hide-details></v-text-field></td>
          <td><v-text-field value="$30,800.00" density="compact" hide-details></v-text-field></td>
        </tr>
        <tr class="monospace">
          <td>School Age (PT)</td>
          <td><v-text-field value="$700.00" density="compact" hide-details></v-text-field></td>
          <td><v-text-field value="4" density="compact" hide-details></v-text-field></td>
          <td><v-text-field value="4" density="compact" hide-details></v-text-field></td>
          <td><v-text-field value="$30,800.00" density="compact" hide-details></v-text-field></td>
        </tr>
        <tr class="monospace">
          <td>School Aage (FT)</td>
          <td><v-text-field value="$700.00" density="compact" hide-details></v-text-field></td>
          <td><v-text-field value="4" density="compact" hide-details></v-text-field></td>
          <td><v-text-field value="4" density="compact" hide-details></v-text-field></td>
          <td><v-text-field value="$30,800.00" density="compact" hide-details></v-text-field></td>
        </tr>
      </table>
    </div>
  </div>
</template>
<script lang="ts">
export default {
  props: ["month"],
  name: "MonthlyWorksheet",
  setup() {},
  data: () => ({
    r11: 8,
    r12: 8,
    r21: 12,
    r22: 12,
  }),
  computed: {
    r13() {
      return this.formatMoney( this.r11 * 700 * 12);
    },
    r23() {
      return this.formatMoney( this.r21 * 700 * 12);
    },
  },
  methods: {
    formatMoney(amount: any, decimalCount = 2, decimal = ".", thousands = ",") {
      try {
        decimalCount = Math.abs(decimalCount);
        decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

        const negativeSign = amount < 0 ? "-" : "";

        let i = parseInt((amount = Math.abs(amount || 0).toFixed(decimalCount))).toString();
        let j = i.length > 3 ? i.length % 3 : 0;

        return (
          negativeSign +
          "$" +
          (j ? i.substr(0, j) + thousands : "") +
          i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) +
          (decimalCount
            ? decimal +
              Math.abs(amount - i)
                .toFixed(decimalCount)
                .slice(2)
            : "")
        );
      } catch (e) {
        console.log(e);
      }
    },
  },
};
</script>
<style>
.monospace .v-text-field .v-field input.v-field__input {
  font-family: "Courier Prime", monospace !important;
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
