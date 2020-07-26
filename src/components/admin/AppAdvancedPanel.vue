<template>
    <b-card class="shadow">
        <b-card-title><h2>Advanced Settings</h2></b-card-title>
        <hr>
        <h4>Bulk Upload</h4>
        <p>Upload several CSV files to quickly setup large amount of data.</p>
        <h4>Reset Houses</h4>
        <p>Completely remove data on the server. All houses, students, and awards will be deleted for a fresh restart.</p>
        <b-button variant="danger" block>RESET</b-button>
    </b-card>
</template>

<script>
    export default {
        name: "AppAdvancedPanel"
    }
</script>

<style scoped>

</style>