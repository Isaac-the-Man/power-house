<template>
  <b-overlay :show="!isDataLoaded">
    <div class="row">
      <div class="col">
        <h1>Records</h1>
      </div>
    </div>
    <div v-if="isDataLoaded" class="row">
      <div class="col">
        <AppAwardsLog></AppAwardsLog>
      </div>
    </div>
    <div v-else class="row">
      <div class="col">
        <div class="text-center">
          <h3 class="font-weight-lighter">Wow, such empty...</h3>
          <b-link to="/">Return</b-link>
        </div>
      </div>
    </div>
  </b-overlay>
</template>

<script>
import AppAwardsLog from "@/components/records/AppAwardsLog";

export default {
  name: "Record",
  components: {
    AppAwardsLog
  },
  computed: {
    isDataLoaded() {
      return this.$store.getters.isDataLoaded;
    }
  }
}
</script>

<style scoped>

</style>