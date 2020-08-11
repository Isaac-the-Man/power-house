<template>
  <b-navbar class="shadow" toggleable="lg" type="dark" variant="info">
    <b-navbar-brand to="/">Power House</b-navbar-brand>

    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav>
        <b-nav-item exact-active-class="active" exact to="/">Dashboard</b-nav-item>
        <b-nav-item-dropdown v-if="housesArray.length > 0" right text="Houses">
          <b-dropdown-item exact-active-class="active" exact v-for="(house, i) in housesArray" :key="i"
                           :to="'/houses/' + house.key">{{ house.name }}
          </b-dropdown-item>
        </b-nav-item-dropdown>
        <b-nav-item exact-active-class="active" exact to="/criteria">Criteria</b-nav-item>
        <b-nav-item exact-active-class="active" exact to="/records">Records</b-nav-item>
        <b-nav-item v-if="isAdmin" exact-active-class="active" exact to="/admin">Admin</b-nav-item>
        <b-nav-item v-if="isAuthed" exact-active-class="active" exact to="/award">Award</b-nav-item>
      </b-navbar-nav>

      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto">
        <b-nav-item-dropdown right>
          <!-- Using 'button-content' slot -->
          <template v-slot:button-content>
            <em>{{ username }}</em>
          </template>
          <b-dropdown-item v-if="!isAuthed" to="/login">Sigin In</b-dropdown-item>
          <b-dropdown-item v-else @click="signOut">Sign Out</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>

    </b-collapse>
  </b-navbar>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/auth'

export default {
  name: "Navbar",
  data() {
    return {
      houses: null
    }
  },
  computed: {
    authStatus() {
      return this.$store.getters.authStatus;
    },
    isAuthed() {
      return this.authStatus.perm !== 'None';
    },
    isAdmin() {
      return this.authStatus.perm === 'Admin';
    },
    username() {
      return this.authStatus.name;
    },
    housesArray() {
      return this.mergeKey(this.houses);
    }
  },
  methods: {
    signOut() {
      firebase.auth().signOut();
      this.$router.push('/');
      this.makeToast('Signed Out', `Admin has signed out.`, 'info');
    }
  },
  created() {
    this.houses = this.$store.state.database.db.ref('/houses').on('value', (data) => {
      this.houses = data.val();
    });
  }
}
</script>

<style scoped>

</style>