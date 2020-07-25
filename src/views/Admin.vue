<template>
    <div>
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
    </div>
</template>

<script>
    import AppUserPanel from "@/components/admin/AppUserPanel";
    import AppHousePanel from "@/components/admin/AppHousePanel";
    import AppStudentPanel from "@/components/admin/AppStudentPanel";

    export default {
        name: "Admin",
        components: {
            AppUserPanel,
            AppHousePanel,
            AppStudentPanel
        }
    }
</script>

<style scoped>

</style>