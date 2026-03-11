<template>
  <div class="reviews-page">
    <h1 class="text-h4 font-weight-bold text-grey-darken-4 mb-6">My Reviews</h1>

    <v-card class="rounded-xl elevation-2 pa-6 mb-6">
      <div class="d-flex align-center">
        <v-avatar color="primary" rounded="lg" size="100" class="mr-6">
           <v-icon size="48">mdi-account-star</v-icon>
        </v-avatar>
        <div>
           <div class="text-h5 font-weight-bold mb-1">Your Rating: 4.8 / 5.0</div>
           <div class="d-flex mb-2">
             <v-icon v-for="i in 5" :key="i" color="amber" size="24">{{ i <= 4 ? 'mdi-star' : 'mdi-star-half-full' }}</v-icon>
           </div>
           <div class="text-subtitle-2 text-grey-darken-1">Based on 12 reviews from managers and peers</div>
        </div>
      </div>
    </v-card>

    <h2 class="text-h6 font-weight-bold mb-4">Recent Feedback</h2>
    <v-row>
      <v-col v-for="review in feedback" :key="review.id" cols="12" md="6">
         <v-card class="rounded-xl elevation-2 pa-6 h-100">
            <div class="d-flex align-center mb-4">
               <v-avatar :image="review.avatar" size="40" class="mr-3"></v-avatar>
               <div>
                  <div class="text-subtitle-1 font-weight-bold">{{ review.name }}</div>
                  <div class="text-caption text-grey-darken-1">{{ review.role }} • {{ review.date }}</div>
               </div>
               <v-spacer></v-spacer>
               <v-chip size="small" color="primary" variant="tonal" label class="font-weight-bold">
                 {{ review.rating }} / 5.0
               </v-chip>
            </div>
            <p class="text-body-1 text-grey-darken-3 italic">"{{ review.comment }}"</p>
         </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
const feedback = [
  { id: 1, name: 'Michael Chen', role: 'HR Manager', date: 'Feb 15, 2026', rating: '5.0', avatar: 'https://randomuser.me/api/portraits/men/32.jpg', comment: 'Always proactive and meets deadlines ahead of time. Great team player.' },
  { id: 2, name: 'Sarah Johnson', role: 'Lead Developer', date: 'Jan 28, 2026', rating: '4.5', avatar: 'https://randomuser.me/api/portraits/women/44.jpg', comment: 'Excellent technical skills, though communication during sprint reviews could be improved.' },
]
</script>

<style scoped>
.italic { font-style: italic; }
</style>
