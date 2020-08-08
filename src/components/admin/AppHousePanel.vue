<template>
  <b-card class="shadow">
    <b-card-title><h2>Manage Houses</h2></b-card-title>
    <hr>
    <h4>Houses</h4>
    <b-table
        striped
        bordered
        hover
        show-empty
        empty-text="No Houses Yet."
        head-variant="dark"
        :fields="houseFields"
        :items="housesArray">
      <template v-slot:cell(color)="row">
        <div class="d-flex justify-content-start align-items-center">
          <div class="p-2 mr-1" :style="{'background-color': row.item.color}"></div>
          {{ row.item.color }}
        </div>
      </template>
      <template v-slot:cell(action)="row">
        <b-button size="sm" variant="danger" @click="deleteHouse(row.item.key)">delete</b-button>
        <b-button class="ml-1" @click="row.toggleDetails" size="sm" variant="warning">{{ row.detailsShowing ? 'hide' : 'edit' }}</b-button>
      </template>
      <template v-slot:row-details="row">
        <AppEditHouse :house="row.item"></AppEditHouse>
      </template>
    </b-table>
    <h4>Create New House</h4>
    <b-form @submit="newHouse">
      <div class="row">
        <div class="col-md">
          <b-form-group label="House Name">
            <b-form-input required v-model="newHouseForm.name" type="text" placeholder="House Name"></b-form-input>
          </b-form-group>
        </div>
        <div class="col-md">
          <b-form-group label="House Color">
            <b-form-input required v-model="newHouseForm.color" type="color" placeholder="House Color"></b-form-input>
          </b-form-group>
        </div>
      </div>
      <b-button type="submit" block variant="primary">Submit</b-button>
    </b-form>
  </b-card>
</template>

<script>
import AppEditHouse from "@/components/admin/AppEditHouse";

export default {
  name: "AppHousePanel",
  components: {
    AppEditHouse
  },
  data() {
    return {
      houseFields: [
        {label: 'Name', key: 'name', sortable: true},
        {label: 'Color', key: 'color', sortable: true},
        {label: 'Actions', key: 'action'}
      ],
      newHouseForm: {
        name: '',
        color: '#000000'
      }
    }
  },
  computed: {
    housesArray() {
      return this.$store.getters.housesArray;
    }
  },
  methods: {
    async deleteHouse(uid) {
      try {
        await this.$store.state.database.db.ref('/houses').child(uid).remove();
        this.makeToast('House Deleted', 'House has been deleted successfully.', 'success');
      } catch (e) {
        console.log(e);
        this.makeToast('House Deletion Failed', 'An error occurred while deleting house. Please try again later.', 'danger');
      }
    },
    async pushHouse() {
      try {
        await this.$store.state.database.db.ref('/houses').push({
          name: this.newHouseForm.name,
          color: this.newHouseForm.color
        });
        this.makeToast('New House Created', 'New house successfully created.', 'success');
      } catch (e) {
        console.log(e);
        this.makeToast('Create House Failed', 'An error occured while creating the new house. Please try again later.', 'danger');
      }
    },
    async newHouse(evt) {
      evt.preventDefault();
      await this.pushHouse();
      this.newHouseForm = {
        name: '',
        color: '#000000'
      }
    }
  },
}
</script>

<style scoped>
</style>