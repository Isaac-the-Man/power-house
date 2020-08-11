<template>
  <b-card class="shadow">
    <b-card-title><h2>Manage Admins</h2></b-card-title>
    <hr>
    <h4>Admins</h4>
    <b-table
        striped
        bordered
        hover
        head-variant="dark"
        show-empty
        empty-text="No Admins Yet."
        :fields="userFields"
        :items="admins">
      <template v-slot:cell(action)="row">
        <b-button @click="grantAdmin(row.item.key)" v-if="row.item.perm !== 'Admin'" size="sm" variant="warning">grant
          admin
        </b-button>
        <b-button @click="repealAdmin(row.item.key)" v-else size="sm" variant="warning">repeal admin</b-button>
      </template>
    </b-table>
    <b-form @submit="newAdmin">

      <h4>Create New Admin</h4>

      <div class="row">
        <div class="col-md">
          <b-form-group label-for="adminName" label="Name">
            <b-input-group>
              <b-form-input type="text" id="adminName" required v-model="newUserForm.name"
                            placeholder="Name"></b-form-input>
            </b-input-group>
          </b-form-group>
        </div>
        <div class="col-md">
          <b-form-group label-for="adminPerm" label="Permission">
            <b-form-select required v-model="newUserForm.perm" :options="permOptions"></b-form-select>
          </b-form-group>
        </div>
      </div>

      <div class="row">
        <div class="col-md">
          <b-form-group label-for="adminMail" label="Email">
            <b-form-input type="email" id="adminMail" required v-model="newUserForm.mail"
                          placeholder="Email"></b-form-input>
          </b-form-group>
        </div>
        <div class="col-md">
          <b-form-group label-for="adminPass" label="Password">
            <b-form-input type="password" id="adminPass" required v-model="newUserForm.pass"
                          placeholder="Password"></b-form-input>
          </b-form-group>
        </div>
      </div>

      <b-button block type="submit" variant="primary">Submit</b-button>
      <pre>{{ userFields }}</pre>

    </b-form>
  </b-card>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/auth'

export default {
  name: "AppUserPanel",
  data() {
    return {
      admins: [],
      userFields: [
        {label: 'Name', key: 'name', sortable: true},
        {label: 'Permission', key: 'perm', sortable: true},
        {label: 'Actions', key: 'action'}
      ],
      permOptions: [
        {text: 'Select a permission', value: null},
        {text: 'Teacher', value: 'Teacher'},
        {text: 'Admin', value: 'Admin'}
      ],
      newUserForm: {
        name: '',
        perm: null,
        mail: '',
        pass: ''
      }
    }
  },
  methods: {
    async grantAdmin(uid) {
      try {
        const res = await this.confirmModal('Do you confirm to grant admin permission for this account?');
        if (res) {
          await this.$store.state.database.db.ref('/admins').child(uid).update({
            perm: 'Admin'
          });
          this.makeToast('Admin Updated', 'Successfully granted Admin permission.', 'success');
        }
      } catch (e) {
        console.log(e);
        this.makeToast('Admin Update Failed', 'An error occurred while granting Admin permission. Please try again later.', 'danger');
      }
    },
    async repealAdmin(uid) {
      try {
        const res = await this.confirmModal('Do you confirm to repeal admin permission for this account?');
        if (res) {
          await this.$store.state.database.db.ref('/admins').child(uid).update({
            perm: 'Teacher'
          });
          this.makeToast('Admin Updated', 'Successfully repealed Admin permission.', 'success');
        }
      } catch (e) {
        console.log(e);
        this.makeToast('Admin Update Failed', 'An error occurred while repealing Admin permission. Please try again later.', 'danger');
      }
    },
    async pushNewAdmin() {
      try {
        const res = await firebase.auth().createUserWithEmailAndPassword(this.newUserForm.mail, this.newUserForm.pass);
        await this.$store.state.database.db.ref('/admins').child(res.user.uid).set({
          name: this.newUserForm.name,
          perm: this.newUserForm.perm
        });
        this.makeToast('New Admin Created', `A new admin account has been created.`, 'success');
      } catch (e) {
        console.log(e);
        this.makeToast('Unable to Create Admin', `An error occurred while creating a new admin. Please try again later.`, 'danger');
      }
    },
    async newAdmin(evt) {
      evt.preventDefault();
      await this.pushNewAdmin();
      this.newUserForm = {
        name: '',
        perm: null,
        mail: '',
        pass: ''
      }
    }
  },
  created() {
    this.$store.state.database.db.ref('/admins').on('value', (data) => {
      this.admins = this.mergeKey(data.val());
    });
  }
}
</script>

<style scoped>

</style>