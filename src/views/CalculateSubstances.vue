<template>
  <div class="bg-gray-50 p-6">
    <div class="text-center space-y-3 mb-10">
      <h1 class="text-2xl font-semibold text-gray-800">Ifloslanish Prognozi</h1>
      <div class="text-4xl font-bold text-blue-600">C(t)</div>
      <p class="text-gray-500">Atrof-muhitning ifloslanish darajasini hisoblash tizimi</p>
    </div>

    <div class="space-y-8">
      <div class="bg-white border border-gray-100 p-6 rounded-xl shadow-sm">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
            <i class="pi pi-sliders-h text-xl text-blue-600"></i>
          </div>
          <h3 class="text-xl font-medium text-gray-800">Asosiy parametrlar</h3>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div class="field">
            <label class="block text-sm font-medium text-gray-600 mb-2"
              >Boshlang'ich konsentratsiya C₀ (mg/l)</label
            >
            <InputNumber
              v-model="input.C0"
              :min="0"
              :step="0.01"
              class="w-full custom-input"
              showButtons
            />
          </div>

          <div class="field">
            <label class="block text-sm font-medium text-gray-600 mb-2">Harorat T(t) (°C)</label>
            <InputNumber
              v-model="input.T"
              :min="-50"
              :max="50"
              :step="0.1"
              class="w-full custom-input"
              showButtons
            />
          </div>

          <div class="field">
            <label class="block text-sm font-medium text-gray-600 mb-2">Namlik H(t) (%)</label>
            <InputNumber
              v-model="input.H"
              :min="0"
              :max="100"
              :step="0.1"
              class="w-full custom-input"
              showButtons
            />
          </div>

          <div class="field">
            <label class="block text-sm font-medium text-gray-600 mb-2">Bosim P(t) (gPa)</label>
            <InputNumber
              v-model="input.P"
              :min="0"
              :step="0.1"
              class="w-full custom-input"
              showButtons
            />
          </div>

          <div class="field">
            <label class="block text-sm font-medium text-gray-600 mb-2"
              >Shamol tezligi v(t) (m/s)</label
            >
            <InputNumber
              v-model="input.v"
              :min="0"
              :step="0.1"
              class="w-full custom-input"
              showButtons
            />
          </div>
        </div>
      </div>

      <div class="bg-white border border-gray-100 p-6 rounded-xl shadow-sm">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
            <i class="pi pi-calculator text-xl text-blue-600"></i>
          </div>
          <h3 class="text-xl font-medium text-gray-800">Koeffitsientlar</h3>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="field">
            <label class="block text-sm font-medium text-gray-600 mb-2">α (shamol ta'siri)</label>
            <InputNumber
              v-model="coeff.alpha"
              :min="0"
              :step="0.001"
              class="w-full custom-input"
              showButtons
            />
          </div>

          <div class="field">
            <label class="block text-sm font-medium text-gray-600 mb-2">β (harorat ta'siri)</label>
            <InputNumber
              v-model="coeff.beta"
              :min="0"
              :step="0.001"
              class="w-full custom-input"
              showButtons
            />
          </div>

          <div class="field">
            <label class="block text-sm font-medium text-gray-600 mb-2">γ (namlik ta'siri)</label>
            <InputNumber
              v-model="coeff.gamma"
              :min="0"
              :step="0.001"
              class="w-full custom-input"
              showButtons
            />
          </div>

          <div class="field">
            <label class="block text-sm font-medium text-gray-600 mb-2">δ (bosim ta'siri)</label>
            <InputNumber
              v-model="coeff.delta"
              :min="0"
              :step="0.001"
              class="w-full custom-input"
              showButtons
            />
          </div>
        </div>
      </div>

      <div class="flex justify-end">
        <Button
          label="Hisoblash"
          icon="pi pi-calculator"
          @click="calculateC"
          class="p-button-lg custom-button"
          :loading="loading"
        />
      </div>

      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="transform scale-100 opacity-100"
        leave-to-class="transform scale-95 opacity-0"
      >
        <div
          v-if="result !== null"
          class="bg-white border border-gray-100 p-6 rounded-xl shadow-sm"
        >
          <div class="flex items-center gap-3 mb-6">
            <div class="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <i class="pi pi-chart-line text-xl text-blue-600"></i>
            </div>
            <h3 class="text-xl font-medium text-gray-800">Natija</h3>
          </div>
          <div class="text-center space-y-2">
            <p class="text-3xl font-bold text-blue-600">C(t) = {{ result }}</p>
            <p class="text-sm text-gray-500">mg/l</p>
          </div>
        </div>
      </Transition>

      <!-- Hisoblash tarixi -->
      <div
        v-if="calculationHistory.length > 0"
        class="bg-white border border-gray-100 p-6 rounded-xl shadow-sm"
      >
        <div class="flex items-center justify-between gap-3 mb-6">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <i class="pi pi-history text-xl text-blue-600"></i>
            </div>
            <h3 class="text-xl font-medium text-gray-800">Hisoblash tarixi</h3>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th
                  class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Vaqt
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  C₀ (mg/l)
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Harorat (°C)
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Namlik (%)
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Bosim (gPa)
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Shamol (m/s)
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Natija
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                ></th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="item in calculationHistory" :key="item.id" class="hover:bg-gray-50">
                <td class="px-4 py-3 text-sm text-gray-600">{{ item.timestamp }}</td>
                <td class="px-4 py-3 text-sm text-gray-600">{{ item.C0 }}</td>
                <td class="px-4 py-3 text-sm text-gray-600">{{ item.T }}</td>
                <td class="px-4 py-3 text-sm text-gray-600">{{ item.H }}</td>
                <td class="px-4 py-3 text-sm text-gray-600">{{ item.P }}</td>
                <td class="px-4 py-3 text-sm text-gray-600">{{ item.v }}</td>
                <td class="px-4 py-3 text-sm font-medium text-blue-600">{{ item.result }}</td>
                <td class="px-4 py-3 text-sm text-gray-600">
                  <button
                    @click="deleteHistoryItem(item.id)"
                    class="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <i class="pi pi-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface CalculationResult {
  id: number
  timestamp: string
  C0: number
  T: number
  H: number
  P: number
  v: number
  result: number
}

const input = ref({
  C0: 1.0,
  T: 25,
  H: 50,
  P: 1013,
  v: 2,
})

const coeff = ref({
  alpha: 0.1,
  beta: 0.01,
  gamma: 0.005,
  delta: 0.002,
})

const result = ref<number | null>(null)
const loading = ref(false)
const calculationHistory = ref<CalculationResult[]>([])

function calculateC() {
  loading.value = true
  setTimeout(() => {
    const { C0, T, H, P, v } = input.value
    const { alpha, beta, gamma, delta } = coeff.value
    const numerator = 1 + beta * T + gamma * H + delta * P
    const denominator = Math.exp(-alpha * v)
    const calculatedResult = parseFloat(((C0 * denominator) / numerator).toFixed(4))
    result.value = calculatedResult

    // Add to history
    calculationHistory.value.push({
      id: Date.now(),
      timestamp: new Date().toLocaleString('uz-UZ'),
      C0,
      T,
      H,
      P,
      v,
      result: calculatedResult,
    })

    loading.value = false
  }, 800)
}

function deleteHistoryItem(id: number) {
  calculationHistory.value = calculationHistory.value.filter((item) => item.id !== id)
}
</script>

<style lang="scss" scoped>
:deep(.p-inputnumber) {
  width: 100%;
}

:deep(.custom-input) {
  .p-inputtext {
    height: 48px !important;
    font-size: 1rem;
  }

  .p-inputnumber-button {
    height: 48px !important;
    width: 48px !important;
    background: #f9fafb !important;
    border: 1px solid #e5e7eb !important;
    color: #6b7280 !important;

    &:hover {
      background: #f3f4f6 !important;
      color: #374151 !important;
    }

    &:active {
      background: #e5e7eb !important;
    }
  }
}

:deep(.custom-button) {
  min-width: 200px;
  background: #3b82f6 !important;
  border: none !important;
  font-weight: 600;
  padding: 1rem 2rem;
  border-radius: 0.75rem;
  transition: all 0.2s;

  &:hover {
    background: #2563eb !important;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
}

table {
  border-collapse: collapse;
  width: 100%;
}

th {
  background-color: #f9fafb;
  font-weight: 600;
}

td,
th {
  white-space: nowrap;
}

.overflow-x-auto {
  -webkit-overflow-scrolling: touch;
}
</style>
