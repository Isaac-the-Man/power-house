<template>
  <b-overlay :show="!isDataLoaded">
    <div class="row">
      <div class="col d-flex align-items-center">
        <h1>Criteria</h1>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <div>
          <AppCriterion v-for="(criterion) in criteriaArray" :key="criterion.key" :title="criterion.title"
                        :points="criterion.points"
                        :details="criterion.details">
          </AppCriterion>
        </div>
      </div>
    </div>
    <div v-if="isAuthed" class="row">
      <div class="col">
        <AppNewCriterion></AppNewCriterion>
        <pre>{{ this.$store.getters.scoredStudentsArray }}</pre>
      </div>
    </div>
  </b-overlay>
</template>

<script>
import AppCriterion from "@/components/criteria/AppCriterion";
import AppNewCriterion from "@/components/criteria/AppNewCriterion";


export default {
  name: "Criteria",
  components: {
    AppCriterion,
    AppNewCriterion
  },
  computed: {
    isDataLoaded() {
      return this.$store.getters.isDataLoaded;
    },
    isAuthed() {
      return this.$store.getters.authStatus.perm === 'Admin';
    },
    criteriaArray() {
      return this.$store.getters.criteriaArray;
    }
  }
}
</script>

<style scoped>

</style>