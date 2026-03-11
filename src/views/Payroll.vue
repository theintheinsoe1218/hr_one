<template>
  <div class="payroll-page">
    <h1 class="text-h4 font-weight-bold text-grey-darken-4 mb-6">Payroll</h1>

    <v-row class="mb-6">
      <v-col cols="12" md="4">
        <v-card class="rounded-xl pa-6 elevation-2 bg-primary text-white h-100">
           <div class="text-h6 opacity-70 mb-2">Net Salary (Mar)</div>
           <div class="text-h3 font-weight-bold mb-4">$4,250.00</div>
           <v-divider color="white" class="mb-4 opacity-30"></v-divider>
           <div class="d-flex justify-space-between text-body-2">
             <span>Gross Pay</span>
             <span>$5,100.00</span>
           </div>
           <div class="d-flex justify-space-between text-body-2 mt-2">
             <span>Deductions</span>
             <span>-$850.00</span>
           </div>
           <v-btn block color="white" class="text-primary font-weight-bold mt-6" rounded="lg">
             Download Pay Stub
           </v-btn>
        </v-card>
      </v-col>
      <v-col cols="12" md="8">
        <v-card class="rounded-xl elevation-2 pa-6 h-100">
           <h2 class="text-h6 font-weight-bold mb-4">Payment History</h2>
           <v-table>
             <thead>
               <tr>
                 <th class="text-left">Month</th>
                 <th class="text-left">Date Paid</th>
                 <th class="text-left">Amount</th>
                 <th class="text-left">Status</th>
                 <th class="text-right">Action</th>
               </tr>
             </thead>
             <tbody>
               <tr v-for="item in history" :key="item.month">
                 <td class="font-weight-bold">{{ item.month }}</td>
                 <td class="text-grey-darken-1">{{ item.date }}</td>
                 <td class="font-weight-bold">{{ item.amount }}</td>
                 <td>
                   <v-chip color="success" size="x-small" label class="font-weight-bold">PAID</v-chip>
                 </td>
                 <td class="text-right">
                   <v-btn icon="mdi-download" variant="text" size="small" color="primary"></v-btn>
                 </td>
               </tr>
             </tbody>
           </v-table>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
const history = [
  { month: 'February 2026', date: 'Feb 28, 2026', amount: '$4,250.00' },
  { month: 'January 2026', date: 'Jan 31, 2026', amount: '$4,250.00' },
  { month: 'December 2025', date: 'Dec 30, 2025', amount: '$4,500.00' },
  { month: 'November 2025', date: 'Nov 28, 2025', amount: '$4,250.00' },
]
</script>
