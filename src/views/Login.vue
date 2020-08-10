<template>
  <div class="row">
    <div class="col">
      <b-card no-body style="max-width: 600px;" class="mx-auto shadow">
        <b-card-body class="text-center">
          <img class="mx-auto mb-3" alt="Power House Logo" src="../assets/logo.png">
          <b-card-title><h1>Admin Login</h1></b-card-title>
          <b-card-text>
            <b-form @submit="adminLogin">
              <b-form-group>
                <b-form-input required v-model="email" placeholder="Email"></b-form-input>
              </b-form-group>
              <b-form-group>
                <b-form-input required v-model="password" type="password" placeholder="Password"></b-form-input>
              </b-form-group>
              <b-button type="submit" variant="primary" block>Login</b-button>
            </b-form>
          </b-card-text>
        </b-card-body>
      </b-card>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase/app';
import 'firebase/auth';

export default {
  name: "Login",
  data() {
    return {
      email: '',
      password: ''
    }
  },
  computed: {
    isAuthed() {
      return this.$store.state.database.auth;
    }
  },
  methods: {
    async adminLogin(evt) {
      evt.preventDefault();
      try {
        await firebase.auth().signInWithEmailAndPassword(this.email, this.password);
        this.$router.go(-1);
      } catch (e) {
        console.log(e);
        this.makeToast('Login Error', 'Invalid Email or Password', 'danger');
      }
    }
  },
  watch: {
    isAuthed(val) {
      if (val) {
        console.log('auto login')
        this.$router.push('/');
      }
    }
  }
}
</script>

<style scoped>

</style>