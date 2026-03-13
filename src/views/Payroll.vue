<template>
  <div class="payroll-page">
    <div v-if="!payslipDialog">
      <!-- Header -->
      <div class="d-flex flex-column flex-sm-row align-sm-center justify-sm-space-between mb-6 gap-4">
        <div>
          <h1 class="text-h5 text-md-h4 font-weight-bold text-grey-darken-4 mb-1">Payroll</h1>
          <div class="text-caption text-md-subtitle-1 text-grey-darken-1">Process employee salaries and generate payslips</div>
        </div>
        <div class="d-flex gap-2">
          <v-btn 
            variant="outlined" 
            prepend-icon="mdi-flash-outline" 
            rounded="lg" 
            class="text-none font-weight-bold border-grey"
            @click="autoGenDialog = true"
          >
            Auto Generate
          </v-btn>
          <v-btn 
            color="primary" 
            prepend-icon="mdi-plus" 
            rounded="lg" 
            class="text-none font-weight-bold px-4 shadow-primary"
            @click="addPayrollDialog = true"
          >
            Add Payroll
          </v-btn>
        </div>
      </div>

      <!-- Stats Cards -->
      <v-row class="mb-6">
        <v-col v-for="stat in payrollStats" :key="stat.label" cols="12" sm="4">
          <v-card class="rounded-xl pa-4 elevation-0 border-light overflow-hidden">
            <div class="d-flex align-center">
              <v-avatar :color="stat.iconBg" variant="flat" rounded="lg" size="48" class="mr-4">
                <v-icon :color="stat.color" size="24">{{ stat.icon }}</v-icon>
              </v-avatar>
              <div>
                <div class="text-subtitle-2 text-grey-darken-1 font-weight-medium">{{ stat.label }}</div>
                <div class="text-h5 font-weight-bold text-grey-darken-4">{{ stat.value }}</div>
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>

      <!-- Filter Bar -->
      <div class="d-flex flex-column flex-md-row gap-4 mb-6">
        <v-select
          v-model="selectedMonth"
          :items="months"
          density="comfortable"
          variant="outlined"
          hide-details
          rounded="lg"
          class="bg-white month-select"
          style="max-width: 200px"
        ></v-select>
        <v-text-field
          v-model="search"
          placeholder="Search employees..."
          prepend-inner-icon="mdi-magnify"
          density="comfortable"
          variant="outlined"
          hide-details
          rounded="lg"
          class="bg-white flex-grow-1"
        ></v-text-field>
      </div>

      <!-- Payroll Table -->
      <v-card class="rounded-xl elevation-2 overflow-hidden">
        <v-data-table
          :headers="headers"
          :items="payrollRecords"
          :search="search"
          class="payroll-table"
          hover
        >
          <template v-slot:item.employee="{ item }">
            <div class="d-flex align-center py-3">
              <v-avatar color="primary-lighten-5" size="36" class="mr-3 text-primary font-weight-bold">
                {{ getInitials(item.employee) }}
              </v-avatar>
              <span class="font-weight-medium text-grey-darken-3">{{ item.employee }}</span>
            </div>
          </template>

          <template v-slot:item.baseSalary="{ item }">
            <span class="font-weight-bold">${{ formatNumber(item.baseSalary) }}</span>
          </template>

          <template v-slot:item.overtime="{ item }">
            <span class="text-success font-weight-medium">+${{ formatNumber(item.overtime) }}</span>
          </template>

          <template v-slot:item.bonuses="{ item }">
            <span class="text-success font-weight-medium">+${{ formatNumber(item.bonuses) }}</span>
          </template>

          <template v-slot:item.deductions="{ item }">
            <span class="text-error font-weight-medium">-${{ formatNumber(item.deductions) }}</span>
          </template>

          <template v-slot:item.netSalary="{ item }">
            <span class="font-weight-bold">${{ formatNumber(item.netSalary) }}</span>
          </template>

          <template v-slot:item.status="{ item }">
            <v-chip size="small" variant="tonal" class="font-weight-bold rounded" color="primary">
              {{ item.status }}
            </v-chip>
          </template>

          <template v-slot:item.actions="{ item }">
            <div class="d-flex align-center gap-2">
              <v-select
                v-model="item.status"
                :items="['Draft', 'Paid']"
                @update:model-value="(val) => updatePayrollStatus(item, val)"
                density="compact"
                variant="outlined"
                hide-details
                rounded="lg"
                class="status-select bg-white"
                style="width: 100px"
              ></v-select>
              <v-btn icon="mdi-file-document-outline" variant="outlined" size="small" class="rounded-lg border-grey text-grey-darken-1" @click="viewPayslip(item)"></v-btn>
            </div>
          </template>
        </v-data-table>
      </v-card>
    </div>

    <!-- Payslip Full Screen View (Shown within page context) -->
    <div v-else class="payslip-container">
      <div class="d-flex align-center justify-space-between mb-8">
        <v-btn variant="text" @click="payslipDialog = false" class="text-none font-weight-bold px-0">
          <v-icon start>mdi-arrow-left</v-icon> Back to Payroll
        </v-btn>
        <v-btn 
          color="primary" 
          rounded="lg" 
          prepend-icon="mdi-printer-outline" 
          class="text-none font-weight-bold shadow-primary"
          @click="printPayslip"
        >
          Print Payslip
        </v-btn>
      </div>

      <div class="d-flex justify-center">
        <v-card id="payslip-content" class="rounded-xl pa-8 pa-md-12 elevation-0 border-light" width="100%" max-width="900px">
          <!-- Payslip Header -->
          <div class="d-flex justify-space-between align-start mb-14">
            <div class="d-flex align-center">
              <v-card color="#8b5cf6" rounded="lg" width="56" height="56" class="d-flex align-center justify-center mr-4 elevation-0">
                <span class="text-white font-weight-black text-h6">HR</span>
              </v-card>
              <div>
                <div class="text-h5 font-weight-black text-grey-darken-4">Aura HR</div>
                <div class="text-caption text-grey-darken-1 font-weight-medium">Human Resources Management</div>
              </div>
            </div>
            <div class="text-right">
              <div class="text-h5 font-weight-black text-primary mb-1 letter-spacing-1">PAYSLIP</div>
              <div class="text-subtitle-1 text-grey-darken-1 font-weight-medium">{{ selectedMonth }}</div>
            </div>
          </div>

          <!-- Employee & Payment Details -->
          <v-row class="mb-12">
            <v-col cols="12" md="6">
              <div class="text-subtitle-1 font-weight-bold text-grey-darken-3 border-b-light pb-2 mb-6">Employee Details</div>
              <div v-for="(val, label) in employeeDetails" :key="label" class="d-flex justify-space-between mb-3">
                <span class="text-body-2 text-grey-darken-1">{{ label }}:</span>
                <span class="text-body-2 font-weight-bold text-grey-darken-4">{{ val }}</span>
              </div>
            </v-col>
            <v-col cols="12" md="6">
              <div class="text-subtitle-1 font-weight-bold text-grey-darken-3 border-b-light pb-2 mb-6">Payment Details</div>
              <div v-for="(val, label) in paymentDetails" :key="label" class="d-flex justify-space-between mb-3">
                <span class="text-body-2 text-grey-darken-1">{{ label }}:</span>
                <span class="text-body-2 font-weight-bold" :class="label === 'Status' ? 'text-warning' : 'text-grey-darken-4'">
                  {{ val }}
                </span>
              </div>
            </v-col>
          </v-row>

          <!-- Earnings & Deductions -->
          <v-row class="mb-14">
            <v-col cols="12" md="6">
              <v-card flat class="rounded-xl border-success overflow-hidden h-100 bg-white">
                <div class="bg-success-lighten-5 text-success font-weight-bold text-subtitle-1 px-5 py-3 d-flex align-center">
                  Earnings
                </div>
                <div class="pa-6">
                  <div v-for="(val, label) in earningsData" :key="label" class="d-flex justify-space-between mb-4">
                    <span class="text-body-1 text-grey-darken-1">{{ label }}</span>
                    <span class="text-body-1 font-weight-bold text-grey-darken-4">${{ formatNumber(val) }}</span>
                  </div>
                  <v-divider class="my-4"></v-divider>
                  <div class="d-flex justify-space-between pt-1">
                    <span class="text-body-1 font-weight-bold text-success">Gross Pay</span>
                    <span class="text-h6 font-weight-black text-success">${{ formatNumber(grossPay) }}</span>
                  </div>
                </div>
              </v-card>
            </v-col>
            <v-col cols="12" md="6">
              <v-card flat class="rounded-xl border-error overflow-hidden h-100 bg-white">
                <div class="bg-error-lighten-5 text-error font-weight-bold text-subtitle-1 px-5 py-3 d-flex align-center">
                  Deductions
                </div>
                <div class="pa-6">
                  <div v-for="(val, label) in deductionsData" :key="label" class="d-flex justify-space-between mb-4">
                    <span class="text-body-1 text-grey-darken-1">{{ label }}</span>
                    <span class="text-body-1 font-weight-bold text-grey-darken-4">${{ formatNumber(val) }}</span>
                  </div>
                  <v-divider class="my-4"></v-divider>
                  <div class="d-flex justify-space-between pt-1">
                    <span class="text-body-1 font-weight-bold text-error">Total Deductions</span>
                    <span class="text-h6 font-weight-black text-error">${{ formatNumber(totalDeductions) }}</span>
                  </div>
                </div>
              </v-card>
            </v-col>
          </v-row>

          <!-- Net Pay Footer (Banner Style) -->
          <v-card flat color="#8b5cf6" class="rounded-xl pa-8 pa-md-10 text-white d-flex flex-column flex-sm-row justify-space-between align-sm-center mb-10 overflow-hidden">
            <div class="relative-z">
              <div class="text-subtitle-1 font-weight-medium opacity-80 mb-2">Net Pay</div>
              <div class="text-h2 font-weight-black">${{ formatNumber(netSalary) }}</div>
            </div>
            <div class="text-sm-right mt-8 mt-sm-0 relative-z">
              <div class="text-subtitle-2 opacity-80 mb-1">Amount in Words</div>
              <div class="text-subtitle-1 font-weight-bold opacity-90">{{ amountInWords }}</div>
            </div>
            <!-- Subtle background decoration -->
            <div class="deco-circle"></div>
          </v-card>

          <!-- Bottom Footer Info -->
          <v-divider class="mb-10 mt-4"></v-divider>
          <div class="d-flex flex-column flex-sm-row justify-space-between align-end">
            <div>
              <div class="text-caption text-grey-darken-1 font-weight-medium mb-1">Generated on {{ currentFormattedDate }}</div>
              <div class="text-caption text-grey-lighten-1">This is a computer-generated document. No signature is required.</div>
            </div>
            <div class="text-right mt-6 mt-sm-0" style="min-width: 200px">
              <div class="border-b-light-thicker mb-2"></div>
              <div class="text-caption text-grey-darken-1 font-weight-bold">Authorized Signature</div>
            </div>
          </div>
        </v-card>
      </div>
    </div>

    <!-- Add Payroll Dialog -->
    <v-dialog v-model="addPayrollDialog" max-width="500px">
      <v-card class="rounded-xl pa-2">
        <v-card-title class="d-flex align-center justify-space-between pa-4">
          <span class="text-h6 font-weight-bold">Create Payroll Entry</span>
          <v-btn icon="mdi-close" variant="text" size="small" @click="addPayrollDialog = false"></v-btn>
        </v-card-title>
        
        <v-card-text class="pa-4 pt-0">
          <div class="mb-4">
            <label class="text-subtitle-2 font-weight-bold mb-1 d-block">Employee</label>
            <v-select
              placeholder="Select employee"
              :items="employeesList"
              variant="outlined"
              hide-details
              rounded="lg"
            ></v-select>
          </div>

          <v-row class="mb-4">
            <v-col cols="6">
              <label class="text-subtitle-2 font-weight-bold mb-1 d-block text-on-surface">Pay Period</label>
              <v-menu v-model="periodMenu" :close-on-content-click="false">
                <template v-slot:activator="{ props }">
                  <v-text-field
                    v-bind="props"
                    v-model="payrollForm.period"
                    placeholder="YYYY-MM"
                    append-inner-icon="mdi-calendar"
                    variant="outlined"
                    hide-details
                    rounded="lg"
                    readonly
                  ></v-text-field>
                </template>
                <v-date-picker
                  @update:model-value="(val) => { payrollForm.period = val.toISOString().substring(0, 7); periodMenu = false }"
                  color="primary"
                ></v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="6">
              <label class="text-subtitle-2 font-weight-bold mb-1 d-block">Payment Method</label>
              <v-select
                :items="['Bank Transfer', 'Cash', 'Cheque']"
                placeholder="Bank Transfer"
                variant="outlined"
                hide-details
                rounded="lg"
              ></v-select>
            </v-col>
          </v-row>

          <div class="mb-4">
             <div class="d-flex justify-space-between align-center mb-1">
               <label class="text-subtitle-2 font-weight-bold text-grey-darken-2">Earnings <span class="text-grey-darken-1 font-weight-regular">(Gross: $0)</span></label>
             </div>
             <v-row dense>
               <v-col cols="4">
                 <label class="text-caption font-weight-bold text-grey-darken-1">Base Salary</label>
                 <v-text-field variant="outlined" density="compact" hide-details rounded="lg" bg-color="grey-lighten-4"></v-text-field>
               </v-col>
               <v-col cols="4">
                 <label class="text-caption font-weight-bold text-grey-darken-1">Overtime Pay</label>
                 <v-text-field variant="outlined" density="compact" hide-details rounded="lg" bg-color="success-lighten-5"></v-text-field>
               </v-col>
               <v-col cols="4">
                 <label class="text-caption font-weight-bold text-grey-darken-1">Bonuses</label>
                 <v-text-field variant="outlined" density="compact" hide-details rounded="lg"></v-text-field>
               </v-col>
             </v-row>
          </div>

          <v-row dense class="mb-6">
             <v-col cols="6">
               <label class="text-caption font-weight-bold text-grey-darken-1">Other Deductions</label>
               <v-text-field variant="outlined" density="compact" hide-details rounded="lg"></v-text-field>
             </v-col>
             <v-col cols="6">
               <label class="text-caption font-weight-bold text-grey-darken-1">Tax</label>
               <v-text-field variant="outlined" density="compact" hide-details rounded="lg" bg-color="grey-lighten-4"></v-text-field>
             </v-col>
          </v-row>

          <v-card flat color="indigo-lighten-5" class="rounded-xl pa-4 d-flex justify-space-between align-center">
            <div>
              <div class="text-caption text-primary font-weight-bold">Net Salary</div>
              <div class="text-h5 font-weight-bold text-primary">$0</div>
            </div>
            <div class="text-right">
              <div class="text-caption text-grey-darken-1">Gross: $0</div>
              <div class="text-caption text-error">Tax: -$0</div>
            </div>
          </v-card>
        </v-card-text>

        <v-card-actions class="pa-4 pt-0">
          <v-spacer></v-spacer>
          <v-btn variant="outlined" rounded="lg" class="px-6 border-grey text-none" @click="addPayrollDialog = false">Cancel</v-btn>
          <v-btn color="primary" rounded="lg" class="px-6 text-none font-weight-bold shadow-primary ml-2" @click="createSinglePayroll">Create Payroll</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Auto Generate Dialog -->
    <v-dialog v-model="autoGenDialog" max-width="500px">
      <v-card class="rounded-xl">
        <v-card-title class="d-flex align-center justify-space-between pa-6 pb-2">
          <span class="text-h6 font-weight-bold">Auto Generate Payroll</span>
          <v-btn icon="mdi-close" variant="text" size="small" @click="autoGenDialog = false"></v-btn>
        </v-card-title>
        
        <v-card-text class="pa-6 pt-0">
          <v-alert color="indigo-lighten-5" class="rounded-xl text-primary border-none mb-6" variant="flat">
            <div class="text-subtitle-2 font-weight-bold mb-1">Period: March 2026</div>
            <div class="text-caption">Automatically calculates base salary, overtime from approved records, and taxes.</div>
          </v-alert>

          <div class="d-flex justify-space-between align-center mb-4">
            <span class="text-subtitle-2 font-weight-bold">Select Employees ({{ selectedEmps.length }} selected)</span>
            <v-btn variant="text" size="small" color="primary" class="text-none font-weight-bold" @click="selectAllEmps">
              {{ selectedEmps.length === autoGenList.length ? 'Deselect All' : 'Select All' }}
            </v-btn>
          </div>

          <div class="employee-scroll-list custom-scrollbar pr-1">
            <div v-for="emp in autoGenList" :key="emp.name" class="d-flex align-center py-3 border-b-light">
              <v-checkbox v-model="selectedEmps" :value="emp" hide-details density="compact" color="primary"></v-checkbox>
              <v-avatar color="primary-lighten-5" size="40" class="mx-3 text-primary font-weight-bold">
                {{ getInitials(emp.name) }}
              </v-avatar>
              <div class="flex-grow-1">
                <div class="text-subtitle-2 font-weight-bold text-grey-darken-3">{{ emp.name }}</div>
                <div class="text-caption text-grey-darken-1">{{ emp.dept }}</div>
              </div>
              <div class="text-subtitle-1 font-weight-bold">${{ formatNumber(emp.salary) }}</div>
            </div>
          </div>
        </v-card-text>

        <v-card-actions class="pa-6 pt-0">
          <v-spacer></v-spacer>
          <v-btn variant="outlined" rounded="lg" class="px-6 border-grey text-none" @click="autoGenDialog = false">Cancel</v-btn>
          <v-btn 
            color="primary" 
            rounded="lg" 
            class="px-6 text-none font-weight-bold shadow-primary ml-2" 
            :disabled="selectedEmps.length === 0"
            @click="generateSelectedPayrolls"
          >
             <v-icon start size="18">mdi-flash</v-icon> Generate {{ selectedEmps.length }} Payroll(s)
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { getEmployees } from '../services/employeeService'
import { getPayroll, createPayroll, updatePayrollStatus } from '../services/payrollService'

const addPayrollDialog = ref(false)
const autoGenDialog = ref(false)
const payslipDialog = ref(false)
const search = ref('')
const selectedMonth = ref('March 2026')
const selectedEmps = ref([])
const activePayRecord = ref(null)
const periodMenu = ref(false)

const payrollForm = ref({
  employee: '',
  period: new Date().toISOString().substring(0, 7),
  method: 'Bank Transfer'
})

const months = ['March 2026', 'February 2026', 'January 2026']

const employeesListRaw = ref([])
const employeesList = computed(() => employeesListRaw.value.map(e => ({ title: `${e.firstName} ${e.lastName}`, value: e })))

const payrollRecordsRaw = ref([])

const loadData = async () => {
  try {
    const empRes = await getEmployees()
    employeesListRaw.value = empRes.data

    await loadPayrollRecords()
  } catch (err) {
    console.error('Error loading payroll data', err)
  }
}

const loadPayrollRecords = async () => {
  try {
    const res = await getPayroll(selectedMonth.value)
    payrollRecordsRaw.value = res.data
  } catch(err) {
    console.error('Error loading payroll records', err)
  }
}

onMounted(() => {
  loadData()
})

watch(selectedMonth, () => {
  loadPayrollRecords()
})

const payrollRecords = computed(() => {
  return payrollRecordsRaw.value.map(p => ({
    id: p.id,
    employeeObj: p.employee,
    employee: p.employee ? `${p.employee.firstName} ${p.employee.lastName}` : 'Unknown',
    baseSalary: p.baseSalary,
    overtime: p.overtime,
    bonuses: p.bonuses,
    deductions: p.deductions,
    netSalary: p.netSalary,
    status: p.status,
    period: p.period
  }))
})

const autoGenList = computed(() => {
   return employeesListRaw.value.map(e => ({
     name: `${e.firstName} ${e.lastName}`,
     dept: e.department ? e.department.name : 'Unknown',
     salary: e.salary || 0,
     employeeObj: e
   }))
})

const headers = [
  { title: 'Employee', key: 'employee' },
  { title: 'Base Salary', key: 'baseSalary' },
  { title: 'Overtime', key: 'overtime' },
  { title: 'Bonuses', key: 'bonuses' },
  { title: 'Deductions', key: 'deductions' },
  { title: 'Net Salary', key: 'netSalary' },
  { title: 'Status', key: 'status', align: 'center' },
  { title: 'Actions', key: 'actions', align: 'end', sortable: false },
]

const payrollStats = computed(() => {
  const totalGross = payrollRecords.value.reduce((sum, p) => sum + (p.baseSalary + p.overtime + p.bonuses), 0)
  const totalNet = payrollRecords.value.reduce((sum, p) => sum + p.netSalary, 0)
  const paidCount = payrollRecords.value.filter(p => p.status === 'Paid').length

  return [
    { label: 'Total Gross', value: `$${formatNumber(totalGross)}`, icon: 'mdi-currency-usd', color: 'indigo', iconBg: 'indigo-lighten-5' },
    { label: 'Total Net', value: `$${formatNumber(totalNet)}`, icon: 'mdi-calculator', color: 'success', iconBg: 'success-lighten-5' },
    { label: 'Paid', value: `${paidCount} / ${payrollRecords.value.length}`, icon: 'mdi-file-document-check-outline', color: 'primary', iconBg: 'primary-lighten-5' },
  ]
})

const getInitials = (name) => {
  if (!name) return ''
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
}

const formatNumber = (num) => {
  if (!num) return '0'
  return num.toLocaleString('en-US', { minimumFractionDigits: num % 1 === 0 ? 0 : 2, maximumFractionDigits: 2 })
}

const selectAllEmps = () => {
  if (selectedEmps.value.length === autoGenList.value.length) {
    selectedEmps.value = []
  } else {
    selectedEmps.value = [...autoGenList.value]
  }
}

const updatePayrollStatus = async (item, status) => {
  try {
     await updatePayrollStatus(item.id, status)
  } catch (err) {
    console.error('Error updating status', err)
  }
}

const generateSelectedPayrolls = async () => {
  for (const emp of selectedEmps.value) {
    const tax = emp.salary * 0.3127
    const payload = {
      employee: emp.employeeObj,
      period: selectedMonth.value,
      baseSalary: emp.salary,
      overtime: 0,
      bonuses: 0,
      deductions: Number(tax.toFixed(2)),
      netSalary: Number((emp.salary - tax).toFixed(2)),
      status: 'Draft',
      paymentMethod: 'Bank Transfer'
    }
    
    try {
      await createPayroll(payload)
    } catch (err) {
      console.error('Error auto-generating payroll', err)
    }
  }
  
  await loadPayrollRecords()
  selectedEmps.value = []
  autoGenDialog.value = false
}

const createSinglePayroll = async () => {
  if (!payrollForm.value.employee) return

  const emp = payrollForm.value.employee
  const tax = (emp.salary || 0) * 0.3127

  const payload = {
    employee: emp,
    period: payrollForm.value.period,
    baseSalary: emp.salary || 0,
    overtime: 0,
    bonuses: 0,
    deductions: Number(tax.toFixed(2)),
    netSalary: Number(((emp.salary || 0) - tax).toFixed(2)),
    status: 'Draft',
    paymentMethod: payrollForm.value.method
  }

  try {
    await createPayroll(payload)
    await loadPayrollRecords()
    addPayrollDialog.value = false
  } catch (err) {
    console.error('Error creating single payroll', err)
  }
}

const viewPayslip = (item) => {
  activePayRecord.value = item
  payslipDialog.value = true
}

const printPayslip = () => {
  const content = document.getElementById('payslip-content')
  if (!content) return
  const printWindow = window.open('', '_blank')
  const style = `...omitted for brevity...`
  // The rest of the print function stays the same but uses local style string actually no, just keep inline or same style string
  const css = `
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
      body { font-family: 'Inter', sans-serif; margin: 0; padding: 0; color: #1e293b; background: white; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      #payslip-content { box-shadow: none !important; padding: 40px; position: relative; width: 100%; max-width: 900px; margin: 0 auto; }
      .text-primary { color: #8b5cf6 !important; }
      .text-success { color: #10b981 !important; }
      .text-error { color: #ef4444 !important; }
      .text-warning { color: #f59e0b !important; }
      .text-white { color: white !important; }
      .text-grey-darken-1 { color: #64748b !important; }
      .text-grey-darken-3 { color: #334155 !important; }
      .text-grey-darken-4 { color: #1e293b !important; }
      .text-grey-lighten-1 { color: #cbd5e1 !important; }
      .bg-white { background-color: white !important; }
      .bg-primary { background-color: #8b5cf6 !important; color: white !important; }
      .bg-success-lighten-5 { background-color: #ecfdf5 !important; }
      .bg-error-lighten-5 { background-color: #fef2f2 !important; }
      .border-b-light { border-bottom: 1px solid #f1f5f9; padding-bottom: 8px; }
      .border-b-light-thicker { border-bottom: 2px solid #f1f5f9; }
      .border-success { border: 1px solid #d1fae5 !important; }
      .border-error { border: 1px solid #fee2e2 !important; }
      .rounded-xl { border-radius: 20px; }
      .rounded-lg { border-radius: 12px; }
      
      .d-flex { display: flex; }
      .justify-space-between { justify-content: space-between; }
      .justify-center { justify-content: center; }
      .align-center { align-items: center; }
      .align-start { align-items: flex-start; }
      .align-end { align-items: flex-end; }
      .flex-column { flex-direction: column; }
      
      .mr-4 { margin-right: 16px; }
      .mb-1 { margin-bottom: 4px; }
      .mb-2 { margin-bottom: 8px; }
      .mb-3 { margin-bottom: 12px; }
      .mb-4 { margin-bottom: 16px; }
      .mb-6 { margin-bottom: 24px; }
      .mb-10 { margin-bottom: 40px; }
      .mb-12 { margin-bottom: 48px; }
      .mb-14 { margin-bottom: 56px; }
      .mt-4 { margin-top: 16px; }
      .mt-8 { margin-top: 32px; }
      .pa-6 { padding: 24px; }
      .pa-8 { padding: 32px; }
      .pa-10 { padding: 40px; }
      .px-5 { padding-left: 20px; padding-right: 20px; }
      .py-3 { padding-top: 12px; padding-bottom: 12px; }
      
      .font-weight-bold { font-weight: 700; }
      .font-weight-black { font-weight: 900; }
      .font-weight-medium { font-weight: 500; }
      .text-h2 { font-size: 3.5rem; line-height: 1; font-weight: 900; }
      .text-h5 { font-size: 1.5rem; line-height: 2rem; font-weight: 900; }
      .text-h6 { font-size: 1.25rem; line-height: 1.75rem; font-weight: 900; }
      .text-subtitle-1 { font-size: 1rem; line-height: 1.5; }
      .text-subtitle-2 { font-size: 0.875rem; line-height: 1.25; }
      .text-body-1 { font-size: 1rem; }
      .text-body-2 { font-size: 0.875rem; }
      .text-caption { font-size: 0.75rem; }
      .opacity-80 { opacity: 0.8; }
      .opacity-90 { opacity: 0.9; }
      .letter-spacing-1 { letter-spacing: 0.1em; }
      
      .v-row { display: flex; flex-wrap: wrap; margin-left: -12px; margin-right: -12px; }
      .v-col { padding: 12px; flex: 1; min-width: 0; }
      .v-card { position: relative; overflow: hidden; }
      .overflow-hidden { overflow: hidden; }
      .v-divider { border: 0; border-top: 1px solid #f1f5f9; margin: 16px 0; }
      .relative-z { position: relative; z-index: 2; }
      .deco-circle { 
        position: absolute; 
        top: -50px; 
        right: -50px; 
        width: 200px; 
        height: 200px; 
        background: rgba(255,255,255,0.1); 
        border-radius: 50%; 
        z-index: 1; 
      }

      @media print {
        body { padding: 0; -webkit-print-color-adjust: exact; }
        #payslip-content { padding: 20px; border: none; }
      }
    </style>
  `
  printWindow.document.write('<html><head><title>Aura HR - Payslip</title>' + css + '</head><body>')
  printWindow.document.write(content.innerHTML)
  printWindow.document.write('</body></html>')
  printWindow.document.close()
  printWindow.focus()
  setTimeout(() => {
    printWindow.print()
    printWindow.close()
  }, 500)
}

// Payslip Computed Data
const employeeDetails = computed(() => {
  if (!activePayRecord.value) return {}
  return {
    'Name': activePayRecord.value.employee,
    'Employee ID': activePayRecord.value.employeeObj?.id || 'N/A',
    'Department': activePayRecord.value.employeeObj?.department?.name || 'Unknown',
    'Position': activePayRecord.value.employeeObj?.position || 'Employee'
  }
})

const paymentDetails = computed(() => {
  return {
    'Pay Period': selectedMonth.value,
    'Payment Method': 'Bank Transfer',
    'Payment Date': 'Pending',
    'Status': activePayRecord.value?.status || 'Draft'
  }
})

const earningsData = computed(() => {
  if (!activePayRecord.value) return {}
  return {
    'Base Salary': activePayRecord.value.baseSalary,
    'Overtime Pay': activePayRecord.value.overtime,
    'Bonuses': activePayRecord.value.bonuses
  }
})

const grossPay = computed(() => {
  if (!activePayRecord.value) return 0
  return activePayRecord.value.baseSalary + activePayRecord.value.overtime + activePayRecord.value.bonuses
})

const deductionsData = computed(() => {
  if (!activePayRecord.value) return {}
  return {
    'Tax': activePayRecord.value.deductions,
    'Other Deductions': 0
  }
})

const totalDeductions = computed(() => activePayRecord.value?.deductions || 0)
const netSalary = computed(() => grossPay.value - totalDeductions.value)
// Simplified amount to word formatter placeholder
const amountInWords = computed(() => 'Amount transferred automatically')

const currentFormattedDate = computed(() => {
  return new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
})
</script>

<style scoped>
.gap-4 { gap: 16px; }
.gap-2 { gap: 8px; }

.status-select :deep(.v-field__outline) {
  --v-field-border-opacity: 0.1;
}

.border-light {
  border: 1px solid rgba(0, 0, 0, 0.05) !important;
}

.border-b-light {
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.border-grey {
  border: 1px solid #e2e8f0 !important;
}

.border-success { border: 1px solid #d1fae5 !important; }
.border-error { border: 1px solid #fee2e2 !important; }

.bg-success-lighten-5 { background-color: #ecfdf5 !important; }
.bg-error-lighten-5 { background-color: #fef2f2 !important; }

.shadow-primary {
  box-shadow: 0 4px 12px rgba(var(--v-theme-primary), 0.3) !important;
}

.payroll-table :deep(th) {
  color: #64748b !important;
  font-weight: 600 !important;
  border-bottom: 1px solid #f1f5f9;
  text-transform: none !important;
}

.employee-scroll-list {
  max-height: 400px;
  overflow-y: auto;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(0,0,0,0.05);
  border-radius: 10px;
}

.border-b-light-thicker {
  border-bottom: 2px solid rgba(0, 0, 0, 0.05);
}

.letter-spacing-1 { letter-spacing: 0.1em; }

.relative-z { position: relative; z-index: 2; }

.deco-circle { 
  position: absolute; 
  top: -50px; 
  right: -50px; 
  width: 200px; 
  height: 200px; 
  background: rgba(255, 255, 255, 0.1); 
  border-radius: 50%; 
  z-index: 1; 
}

.payslip-container {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
