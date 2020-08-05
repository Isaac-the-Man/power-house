<template>
  <b-card class="shadow" @click="isVisible = !isVisible">
    <div class="d-flex align-content-start">
      <h4>{{ student.name }}</h4>
      <div class="ml-auto text-muted small">Grade: {{ student.grade.toUpperCase() }}</div>
    </div>
    <div class="d-flex align-content-end align-items-baseline">
      Score Earned: {{ student.score }}
      <div class="ml-auto text-muted small">House Rank: {{ student.rank }}</div>
    </div>
  </b-card>
</template>

<script>
export default {
  name: "AppStudentPreview",
  props: {
    student: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isVisible: false
    }
  }
}
</script>

<style scoped>

</style>