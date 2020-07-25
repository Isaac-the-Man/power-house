<template>
    <div>
        <slot name="titleHTML"></slot>
        <b-list-group flush class="shadow rounded">
            <div v-if="awards.length > 0" class="rounded">

                <!-- template -->
                <b-list-group-item v-for="(award, i) in awards" :key="i" :variant="getBgVariant(award.addDeduct)"
                                   class="flex-column align-items-start">
                    <div class="d-flex w-100 justify-content-between">
                        <h5 class="mb-1">{{ `${award.criterion.title} (${award.addDeduct === 'add' ? '+' : '-'}${award.criterion.points})` }}</h5>
                        <small>{{ getElapsed(award.createdAt) }}</small>
                    </div>
                    <p class="mb-1">
                        {{ award.notes }}
                    </p>
                    <div class="d-flex w-100 justify-content-between">
                        <div>
                            <b-badge v-for="(tag, i) in award.tags" :key="i" pill variant="warning">
                                {{ tag }}
                            </b-badge>
                        </div>
                        <small>{{ getSubject(award.subject) }}</small>
                    </div>
                </b-list-group-item>

            </div>
            <b-list-group-item v-else class="text-center">
                <h3 class="font-weight-lighter">Wow, such empty...</h3>
            </b-list-group-item>
        </b-list-group>
    </div>
</template>

<script>
    import moment from 'moment';

    export default {
        name: "AppRecentAwards",
        props: {
            awards: {
                type: Array,
                required: true
            }
        },
        data() {
            return {
                criteria: null
            }
        },
        methods: {
            getElapsed(time) {
                return moment(time).fromNow();
            },
            getSubject(subject) {
                if (subject.mode === 'Student') {
                    return `${subject.data.grade.toUpperCase()} ${subject.data.name}`
                } else {
                    return subject.data.name;
                }
            },
            getBgVariant(term) {
                return term === 'add' ? 'success' : 'danger';
            }
        }
    }
</script>

<style scoped>

</style>