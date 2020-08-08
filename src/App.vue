<template>
    <div id="app">
        <TheNavbar></TheNavbar>
        <div class="container my-5">
            <router-view/>
        </div>
        <TheFooter></TheFooter>
    </div>
</template>

<script>
    import TheNavbar from "@/components/shared/TheNavbar";
    import TheFooter from "@/components/shared/TheFooter";
    import firebase from 'firebase/app'
    import 'firebase/auth'

    export default {
        name: 'App',
        components: {
            TheNavbar,
            TheFooter
        },
        created() {
            // signIn
            firebase.auth().onAuthStateChanged((user) => {
                if (user) {
                    this.makeToast('Signed In', `Admin ${user.email} has signed in.`, 'info');
                    this.$store.state.database.auth = true;
                    this.$router.push('/');
                } else {
                    this.$store.state.database.auth = false;
                }
            });
        }
    }
</script>
