<template>
    <b-card class="shadow" @click="isVisible = !isVisible">
        <div class="d-flex align-content-start">
            <h4>{{ student.name }}</h4>
            <div class="ml-auto text-muted small">Grade: {{ student.grade.toUpperCase() }}</div>
        </div>
        <div class="d-flex align-content-end">
            Score Earned: {{ student.score }}
            <div class="ml-auto">
                <BIconChevronCompactUp v-if="isVisible"></BIconChevronCompactUp>
                <BIconChevronCompactDown v-else></BIconChevronCompactDown>
            </div>
        </div>
        <b-collapse v-model="isVisible" accordion="studentPreview">
            <hr>
            <b-list-group flush>
                <b-list-group-item>
                    Award 1
                </b-list-group-item>
                <b-list-group-item>
                    Award 1
                </b-list-group-item>
                <b-list-group-item>
                    Award 1
                </b-list-group-item>
                <b-list-group-item>
                    Award 1
                </b-list-group-item>
            </b-list-group>
        </b-collapse>
    </b-card>
</template>

<script>
    import {BIconChevronCompactDown, BIconChevronCompactUp} from 'bootstrap-vue';

    export default {
        name: "AppStudentPreview",
        components: {
            BIconChevronCompactUp,
            BIconChevronCompactDown
        },
        props: {
            student: {
                type: Object,
                required: true
            }
        },
        data() {
            return {
                isVisible: false
            }
        }
    }
</script>

<style scoped>

</style>