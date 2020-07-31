<template>
    <b-card class="shadow">
        <b-card-title><h2>Advanced Settings</h2></b-card-title>
        <hr>
        <h4>Bulk Create Students</h4>
        <p>Follow the steps to create large amount of students at a time by uploading CSVs. Houses must be created before uploads.</p>
        <AppBulkUpload></AppBulkUpload>
        <h4 class="mt-3">Reset Houses</h4>
        <p>Completely remove data on the server. All houses, students, and awards will be deleted for a fresh restart.</p>
        <b-button variant="danger" block>RESET</b-button>
    </b-card>
</template>

<script>
    import AppBulkUpload from "@/components/admin/AppBulkUpload";

    export default {
        name: "AppAdvancedPanel",
        components: {
            AppBulkUpload
        }
    }
</script>

<style scoped>

</style>