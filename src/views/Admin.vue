<template>
    <b-overlay :show="!isDataLoaded">
        <div class="row">
            <div class="col">
                <h1>Admin Panel</h1>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <AppUserPanel></AppUserPanel>
            </div>
        </div>
        <div class="row mt-3">
            <div class="col">
                <AppHousePanel></AppHousePanel>
            </div>
        </div>
        <div class="row mt-3">
            <div class="col">
                <AppStudentPanel></AppStudentPanel>
            </div>
        </div>
        <div class="row mt-3">
            <div class="col">
                <AppAdvancedPanel></AppAdvancedPanel>
            </div>
        </div>
    </b-overlay>
</template>

<script>
    import AppUserPanel from "@/components/admin/AppUserPanel";
    import AppHousePanel from "@/components/admin/AppHousePanel";
    import AppStudentPanel from "@/components/admin/AppStudentPanel";
    import AppAdvancedPanel from "@/components/admin/AppAdvancedPanel";

    export default {
        name: "Admin",
        computed: {
          isDataLoaded() {
            return this.$store.getters.isDataLoaded;
          }
        },
        components: {
            AppUserPanel,
            AppHousePanel,
            AppStudentPanel,
            AppAdvancedPanel
        }
    }
</script>

<style scoped>

</style>