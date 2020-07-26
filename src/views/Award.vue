<template>
    <div>
        <h1>Award Panel</h1>
        <b-card class="shadow">
            <b-card-title><h2>Give Award</h2></b-card-title>
            <hr>
            <b-card-text>
                Give (add points) or take away (deduct points) awards from student(s) according to one of the
                <b-link to="/criteria">criteria</b-link>
                .
            </b-card-text>
            <b-form class="mt-3" @submit="newAward">

                <b-form-group label-class="font-weight-bold" label="Q1: Add or deduct points?" label-for="inputAddDeduct">
                    <b-form-radio-group required id="inputAddDeduct" v-model="form.addDeduct"
                                        :options="addDeductOptions"></b-form-radio-group>
                </b-form-group>

                <b-form-group label-class="font-weight-bold" label="Q2: Criterion referenced?" label-for="inputCriterionRef">
                    <b-form-select required id="inputCriterionRef" v-model="form.criterion" :options="criteriaOptions"
                                   text-field="title" value-field="key"></b-form-select>
                </b-form-group>

                <b-form-group label-class="font-weight-bold" label="Q3: Subject?">
                    <AppStudentSelector v-model="form.subject"></AppStudentSelector>
                </b-form-group>

                <b-form-group label-class="font-weight-bold" label="Q4: Tags" label-for="inputTags">
                    <b-form-tags input-id="inputTags" remove-on-delete v-model="form.tags"></b-form-tags>
                </b-form-group>

                <b-form-group label-class="font-weight-bold" label="Q5: Notes" label-for="inputNote">
                    <b-form-textarea id="inputNote" placeholder="Notes" v-model="form.notes" rows="3"></b-form-textarea>
                </b-form-group>

                <b-button type="submit" block variant="primary">Submit</b-button>

            </b-form>
        </b-card>
        <pre>{{form}}</pre>
    </div>

</template>

<script>
    import AppStudentSelector from "@/components/award/AppStudentSelector";
    import moment from 'moment';

    export default {
        name: "Award",
        components: {
            AppStudentSelector
        },
        data() {
            return {
                form: {
                    addDeduct: 'add',
                    criterion: null,
                    tags: [],
                    notes: '',
                    subject: null
                },
                addDeductOptions: [
                    {text: 'Add', value: 'add'},
                    {text: 'Deduct', value: 'deduct'}
                ]
            }
        },
        methods: {
            removeSchedule(subject) {
                const formatted = this.clone(subject);
                delete formatted.data.schedule;
                return formatted;
            },
            extractTags(scheduleArray) {
                const tags = [];
                const now = moment();
                for (let schedule of scheduleArray) {
                    const start = moment(schedule.start, 'hh:mm');
                    const end = moment(schedule.end, 'hh:mm');
                    if (now.isBetween(start, end) && !tags.includes(schedule.name)) {
                        tags.push(schedule.name);
                    }
                }
                return tags;
            },
            async pushNewAward() {
                try {
                    await this.$store.state.database.db.ref('/awards').push({
                        addDeduct: this.form.addDeduct,
                        criterion: this.form.criterion,
                        tags: this.form.tags,
                        notes: this.form.notes,
                        subject: this.removeSchedule(this.form.subject),
                        source: this.teacher,
                        createdAt: moment().format()
                    });
                    this.makeToast('Award Success', 'Successfully given award to corresponding students.', 'success');
                } catch (e) {
                    console.log(e);
                    this.makeToast('Award Failed', 'An error occurred while giving awards. Please try again later.', 'danger');
                }
            },
            async newAward(evt) {
                evt.preventDefault();
                if (!this.form.subject || !this.form.subject.data) {
                    this.makeToast('Award Failed', 'Please at least enter one subject.', 'warning');
                } else {
                    await this.pushNewAward();
                    this.form = {
                        addDeduct: 'add',
                        criterion: null,
                        tags: [],
                        notes: '',
                        subject: []
                    }
                }
            }
        },
        computed: {
            criteria() {
                return this.$store.getters.criteriaArray;
            },
            criteriaOptions() {
                const formatted = [];
                for (let criterion of this.criteria) {
                    const modified = {...criterion};
                    modified.title += ` (${criterion.points} points}`;
                    formatted.push(modified);
                }
                formatted.unshift({ title: 'Select a criterion', criterion: null });
                return formatted;
            },
            teacher() {
                return this.$store.getters.authStatus.name;
            }
        },
        watch: {
            'form.subject': function (val) {
                // check if student
                if (val.mode === 'Student' && val.data && val.data.schedule) {
                    const schedule = val.data.schedule;
                    this.form.tags = this.extractTags(schedule);
                }
            }
        }
    }
</script>

<style scoped>

</style>