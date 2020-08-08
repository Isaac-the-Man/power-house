<template>
  <b-card>
    <h5>Edit House</h5>
    <hr>
    <b-form @submit="updateHouse">
      <div class="row">
        <div class="col-md">
          <b-form-group label="House Name">
            <b-form-input v-model="editHouseForm.name" size="sm" type="text" placeholder="House Name"></b-form-input>
          </b-form-group>
        </div>
        <div class="col-md">
          <b-form-group label="House Color">
            <b-form-input v-model="editHouseForm.color" size="sm" type="color"></b-form-input>
          </b-form-group>
        </div>
      </div>
      <b-button size="sm" block type="submit" variant="warning">Update</b-button>
    </b-form>
  </b-card>
</template>

<script>
export default {
  name: "AppEditHouse",
  props: {
    house: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      editHouseForm: this.clone(this.house)
    }
  },
  methods: {
    async updateHouse(evt) {
      evt.preventDefault();
      try {
        await this.$store.state.database.db.ref('/houses').child(this.editHouseForm.key).update(this.editHouseForm);
        this.makeToast('House Updated', 'House information has been successfully updated.', 'success');
      } catch (e) {
        console.log(e);
        this.makeToast('House Updated', 'An error occurred while updating house. Please try again later.', 'danger');
      }
    }
  }
}
</script>

<style scoped>

</style>