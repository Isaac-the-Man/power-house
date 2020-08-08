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