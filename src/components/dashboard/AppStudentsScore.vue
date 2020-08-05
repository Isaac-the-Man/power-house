<template>
  <div>
    <h3>Top Scorers</h3>
    <b-card class="shadow">
      <b-list-group v-if="students.length > 0" flush>
        <b-list-group-item v-for="(student, i) in students" :key="i"
                           class="d-flex justify-content-between align-items-center">
          <div>
            {{ `${i + 1}. ${student.grade.toUpperCase()} ${student.name}` }}
            <b-badge pill class="text-dark" :style="{'background-color': student.house.color}">
              {{ student.house.name }}
            </b-badge>
          </div>
          <div> {{ student.score }} points</div>
        </b-list-group-item>
      </b-list-group>
      <div v-else class="text-center">
        <h3 class="font-weight-lighter">Wow, such empty...</h3>
      </div>
    </b-card>
  </div>
</template>

<script>
export default {
  name: "AppStudentsScore",
  props: {
    students: {
      type: Array,
      required: true
    }
  }
}
</script>

<style scoped>

</style>