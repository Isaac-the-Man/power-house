<template>
    <b-card class="shadow">
        <b-card-title><h2>Manage Students</h2></b-card-title>
        <hr>
        <h4>Students</h4>
        <b-form>
            <div class="row">
                <div class="col-md">
                    <b-form-group label="Search">
                        <b-form-input size="sm" v-model="filter" type="search" placeholder="Search Name"></b-form-input>
                    </b-form-group>
                </div>
                <div class="col-md">
                    <b-form-group label="Per Page">
                        <b-form-select size="sm" v-model="perPage" :options="pageOptions"></b-form-select>
                    </b-form-group>
                </div>
            </div>
        </b-form>
        <b-table
                striped
                bordered
                hover
                show-empty
                empty-text="No Students Yet."
                head-variant="dark"
                :current-page="currentPage"
                :per-page="perPage"
                :filter="filter"
                :filterIncludedFields="['name']"
                @filtered="onFiltered"
                :fields="studentFields"
                :items="studentsArray">
            <template v-slot:cell(house)="row">
                {{ houses[row.item.house].name }}
            </template>
            <template v-slot:cell(actions)="row">
                <b-button @click="deleteStudent(row.item.key)" size="sm" variant="danger">delete</b-button>
                <b-button class="ml-1" @click="row.toggleDetails" size="sm" variant="warning">{{ row.detailsShowing ?
                    'hide' : 'edit' }}
                </b-button>
            </template>
            <template v-slot:row-details="row">
                <AppEditStudent
                        :student="row.item"
                        :grade-options="gradeOptions"
                        :house-options="houseOptions">
                </AppEditStudent>
            </template>
        </b-table>
        <div class="row">
            <div class="col text-center">
                <b-pagination
                        v-model="currentPage"
                        :total-rows="totalRows"
                        :per-page="perPage"
                        align="center"
                        class="mb-1"
                ></b-pagination>
                <i>{{ totalRows }}</i> students in total
            </div>
        </div>
        <h4>Add New Student</h4>
        <b-form @submit="newStudent">

            <div class="row">
                <div class="col-md">
                    <b-form-group label="Name" label-for="newStudentName">
                        <b-form-input v-model="newStudentForm.name" required id="newStudentName" type="text"
                                      placeholder="Student Name"></b-form-input>
                    </b-form-group>
                </div>
                <div class="col-md">
                    <b-form-group label="Grade" label-for="newStudentGrade">
                        <b-form-select v-model="newStudentForm.grade" required :options="gradeOptions"
                                       id="newStudentGrade"></b-form-select>
                    </b-form-group>
                </div>
            </div>

            <b-form-group label="House" label-for="newStudentHouse">
                <b-form-select v-model="newStudentForm.house" id="newStudentHouse" text-field="name" value-field="key"
                               required :options="houseOptions"></b-form-select>
            </b-form-group>

            <!-- schedule editor -->
            <b-form-group label="Schedule" label-for="newStudentSchedule">
                <div class="row">
                    <div class="col-md">
                        <b-form @submit="addClass">
                            <b-input-group prepend="Start">
                                <b-form-input type="time" required id="newStudentSchedule" v-model="scheduleBuilder.start"></b-form-input>
                            </b-input-group>
                            <b-input-group class="mt-1" prepend="End">
                                <b-form-input type="time" required v-model="scheduleBuilder.end"></b-form-input>
                            </b-input-group>
                            <b-input-group class="mt-1" prepend="Class Name">
                                <b-form-input v-model="scheduleBuilder.name" required placeholder="Class Name"></b-form-input>
                            </b-input-group>
                            <b-button class="my-1" type="submit" block variant="secondary">Add Class</b-button>
                        </b-form>
                    </div>
                    <div class="col-md">
                        <b-table
                                :items="newStudentForm.schedule"
                                :fields="scheduleFields"
                                bordered
                                head-variant="dark"
                                show-empty
                                hover
                                striped>
                            <template v-slot:cell(actions)="row">
                                <b-button size="sm" variant="danger" @click="deleteClass(row.item)">delete</b-button>
                            </template>
                        </b-table>
                    </div>
                </div>
            </b-form-group>

            <b-button type="submit" variant="primary" block>Submit</b-button>

        </b-form>
    </b-card>
</template>

<script>
    import AppEditStudent from "@/components/admin/AppEditStudent";

    export default {
        name: "AppStudentPanel",
        components: {
            AppEditStudent
        },
        data() {
            return {
                filter: '',
                totalRows: 0,
                currentPage: 1,
                perPage: 5,
                pageOptions: [5, 10, 30, 50],
                newStudentForm: {
                    name: '',
                    grade: null,
                    house: null,
                    schedule: []
                },
                gradeOptions: [{
                    text: 'Select a grade',
                    value: null
                }, 'g1', 'g2', 'g3', 'g4', 'g5', 'g6', 'g7', 'g8', 'g9', 'g10', 'g11', 'g12'],
                studentFields: [
                    {label: 'Name', key: 'name', sortable: true},
                    {label: 'Grade', key: 'grade', sortable: true},
                    {label: 'House', key: 'house', sortable: true},
                    {label: 'Actions', key: 'actions'},
                ],
                scheduleFields: [
                    { label: 'Name', key: 'name', sortable: true },
                    { label: 'Start', key: 'start', sortable: true },
                    { label: 'End', key: 'end', sortable: true },
                    { label: 'Actions', key: 'actions' }
                ],
                scheduleBuilder: {
                    start: '',
                    end: '',
                    name: ''
                }
            }
        },
        computed: {
            houses() {
                return this.$store.state.data.houses;
            },
            studentsArray() {
                return this.$store.getters.studentsArray;
            },
            houseOptions() {
                if (this.houses) {
                    return [
                        {name: 'Assign a house', key: null},
                        ...this.mergeKey(this.houses)
                    ]
                } else {
                    return []
                }
            }
        },
        methods: {
            deleteClass(item) {
                this.newStudentForm.schedule.splice(this.newStudentForm.schedule.indexOf(item), 1);
            },
            addClass(evt) {
                evt.preventDefault();
                this.newStudentForm.schedule.push({
                    start: this.scheduleBuilder.start,
                    end: this.scheduleBuilder.end,
                    name: this.scheduleBuilder.name
                });
                this.scheduleBuilder = {
                    start: null,
                    end: null,
                    name: ''
                }
            },
            async deleteStudent(id) {
                try {
                    await this.$store.state.database.db.ref('/students').child(id).remove();
                    this.makeToast('Student Delete', 'Student has been deleted successfully.', 'success');
                } catch (e) {
                    console.log(e);
                    this.makeToast('Student Deletion Failed', 'An error occurred while deleting student.Please try again later.', 'danger')
                }
            },
            async pushNewStudent() {
                try {
                    await this.$store.state.database.db.ref('/students').push({
                        name: this.newStudentForm.name,
                        grade: this.newStudentForm.grade,
                        house: this.newStudentForm.house,
                        schedule: this.newStudentForm.schedule
                    });
                    this.makeToast('New Student Created', 'New Student has been created successfully.', 'success');
                } catch (e) {
                    console.log(e);
                    this.makeToast('Student Creation Failed', 'An Error occurred while creating new student. Please try again later.', 'danger');
                }
            },
            async newStudent(evt) {
                evt.preventDefault();
                await this.pushNewStudent();
                this.newStudentForm = {
                    name: '',
                    grade: null,
                    house: null,
                    schedule: []
                }
            },
            onFiltered(filteredItems) {
                // Trigger pagination to update the number of buttons/pages due to filtering
                this.totalRows = filteredItems.length
                this.currentPage = 1
            }
        },
        watch: {
            studentsArray(val) {
                this.totalRows = val.length;
            }
        },
        created() {
            this.totalRows = this.studentsArray.length;
        }
    }
</script>

<style scoped>

</style>