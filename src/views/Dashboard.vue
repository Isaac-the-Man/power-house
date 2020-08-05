<template>
  <div>
    <div class="row">
      <div class="col">
        <h1>Dashboard</h1>
      </div>
    </div>
    <div v-if="isDataLoaded">
      <div class="row">
        <div class="col">
          <AppHousesScore :houses="housesArray"></AppHousesScore>
        </div>
      </div>
      <div class="row">
        <div class="col-lg mt-3">
          <AppStudentsScore :students="rankStudents"></AppStudentsScore>
        </div>
        <div class="col-lg mt-3">
          <AppRecentAwards :awards="recentAwards">
            <template v-slot:titleHTML>
              <h3>Recent Activity</h3>
            </template>
          </AppRecentAwards>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AppHousesScore from "@/components/dashboard/AppHousesScore";
import AppStudentsScore from "@/components/dashboard/AppStudentsScore";
import AppRecentAwards from "@/components/dashboard/AppRecentAwards";

export default {
  name: "Dashboard",
  components: {
    AppHousesScore,
    AppStudentsScore,
    AppRecentAwards
  },
  computed: {
    isDataLoaded() {
      return this.$store.getters.isDataLoaded;
    },
    recentAwards() {
      return this.awardsArray.slice(-process.env.VUE_APP_MAX_RECENT_AWARDS_LOADED).reverse();
    },
    rankStudents() {
      return [...this.studentsArray].sort((a, b) => {
        return b.score - a.score;
      }).slice(0, process.env.VUE_APP_MAX_STUDENTS_RANK_LOADED);
    },
    awardsArray() {
      return this.$store.getters.populatedAwardsArray;
    },
    housesArray() {
      return this.$store.getters.scoredHousesArray;
    },
    studentsArray() {
      return this.$store.getters.populatedScoredStudentsArray;
    }
  }
}
</script>

<style scoped>

</style>