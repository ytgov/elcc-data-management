<template>
  <v-container>
    <h3>Payments</h3>

    <PaymentsEditDataTable
      ref="paymentsEditTableRef"
      :where="paymentsWhere"
      @edit="showPaymentEditForm"
    />

    <v-row
      v-if="paymentId"
      class="mt-4"
    >
      <v-col cols="12">
        <PaymentEditFormCard
          id="payment-edit-form-card"
          :payment-id="paymentId"
          :fiscal-year-legacy="fiscalYearLegacy"
          elevation="0"
          @updated="closeEditFormAndRefresh"
          @cancel="closePaymentEditForm"
        />
      </v-col>
    </v-row>

    <v-row class="mt-4">
      <v-col
        v-if="!showPaymentCreateForm"
        cols="12"
        class="d-flex justify-end"
      >
        <v-btn
          color="primary"
          @click="showPaymentCreateForm = true"
        >
          Add Payment
        </v-btn>
      </v-col>
      <v-col
        v-else
        cols="12"
      >
        <PaymentCreateFormCard
          id="payment-create-form-card"
          :centre-id="centreIdAsNumber"
          :fiscal-year-legacy="fiscalYearLegacy"
          elevation="0"
          @created="closeCreateFormAndRefresh"
          @cancel="showPaymentCreateForm = false"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { computed, useTemplateRef, watchEffect } from "vue"
import { useGoTo } from "vuetify"
import { useRouteQuery } from "@vueuse/router"

import sleepMs from "@/utils/sleep-ms"
import { booleanTransformer, integerTransformer } from "@/utils/use-route-query-transformers"

import PaymentCreateFormCard from "@/components/payments/PaymentCreateFormCard.vue"
import PaymentEditFormCard from "@/components/payments/PaymentEditFormCard.vue"
import PaymentsEditDataTable from "@/components/payments/PaymentsEditDataTable.vue"

const props = defineProps<{
  centreId: string
  fiscalYearSlug: string
}>()

const paymentId = useRouteQuery<string | null, number | null>("editingPaymentId", null, {
  transform: integerTransformer,
})

const showPaymentCreateForm = useRouteQuery("showPaymentCreateForm", "false", {
  transform: booleanTransformer,
})

const goTo = useGoTo()

const centreIdAsNumber = computed(() => parseInt(props.centreId))
const fiscalYearLegacy = computed(() => props.fiscalYearSlug.replace("-", "/"))

const paymentsWhere = computed(() => ({
  centreId: centreIdAsNumber.value,
  fiscalYear: fiscalYearLegacy.value,
}))

async function showPaymentEditForm(newPaymentId: number) {
  paymentId.value = newPaymentId

  await sleepMs(50)

  goTo("#payment-edit-form-card", {
    easing: "easeInOutCubic",
    offset: 0,
    duration: 300,
  })
}

watchEffect(async () => {
  if (!showPaymentCreateForm.value) return

  await sleepMs(50)

  goTo("#payment-create-form-card", {
    easing: "easeInOutCubic",
    offset: 0,
    duration: 300,
  })
})

function closePaymentEditForm() {
  paymentId.value = null
}

const paymentsEditTableRef = useTemplateRef("paymentsEditTableRef")

async function closeEditFormAndRefresh() {
  closePaymentEditForm()
  await paymentsEditTableRef.value?.refresh()
}

async function closeCreateFormAndRefresh() {
  showPaymentCreateForm.value = false
  await paymentsEditTableRef.value?.refresh()
}
</script>
