<template>
  <b-card class="shadow">
    <b-card-title><h2>Advanced Settings</h2></b-card-title>
    <hr>
    <h4 class="mt-3">Reset Houses</h4>
    <p>Completely remove data on the server. All houses, students, and awards will be deleted for a fresh restart.</p>
    <b-button @click="resetAll" variant="danger" block>RESET</b-button>
  </b-card>
</template>

<script>
export default {
  name: "AppAdvancedPanel",
  methods: {
    async resetAll() {
      try {
        const res = await this.confirmModal('Do you wish to RESET the data? This means every houses, awards, and students will be DELETED. This action is irreversible.');
        if (res) {
          const deletedData = {
            'houses': {},
            'students': {},
            'awards': {}
          }
          await this.$store.state.database.db.ref('/').update(deletedData);
          this.makeToast('Reset Completed.', 'All houses, students, and awards are removed for a fresh restart.', 'success');
        }
      } catch (e) {
        console.log(e);
        this.makeToast('Reset Failed.', 'An error occurred while resetting data. Please try again later.', 'error');
      }
    }
  }
}
</script>

<style scoped>

</style>