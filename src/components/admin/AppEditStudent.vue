<template>
    <b-card>
        <h5>Edit Student</h5>
        <hr>
        <b-form @submit="updateStudent">
            <div class="row">
                <div class="col-md">
                    <b-form-group label="Name" label-for="newStudentName">
                        <b-form-input size="sm" v-model="editStudentForm.name" required id="newStudentName"
                                      type="text"
                                      placeholder="Student Name"></b-form-input>
                    </b-form-group>
                </div>
                <div class="col-md">
                    <b-form-group label="Grade" label-for="newStudentGrade">
                        <b-form-select size="sm" v-model="editStudentForm.grade" required
                                       :options="gradeOptions"
                                       id="newStudentGrade"></b-form-select>
                    </b-form-group>
                </div>
            </div>
            <b-form-group label="House" label-for="newStudentHouse">
                <b-form-select size="sm" v-model="editStudentForm.house" id="newStudentHouse" text-field="name"
                               value-field="key"
                               required :options="houseOptions"></b-form-select>
            </b-form-group>
            <!-- TODO: add edit schedule  -->
            <b-button size="sm" type="submit" variant="warning" block>Update</b-button>
        </b-form>
        <pre>
            {{ editStudentForm }}
        </pre>
    </b-card>
</template>

<script>
    export default {
        name: "AppEditStudent",
        props: ['student', 'houseOptions', 'gradeOptions'],
        data() {
            return {
                editStudentForm: {
                    name: this.student.name,
                    grade: this.student.grade,
                    house: this.student.house
                }
            }
        },
        methods: {
            async updateStudent(evt) {
                evt.preventDefault();
                try {
                    await this.$store.state.database.db.ref('/students').child(this.student.key).update({
                        name: this.editStudentForm.name,
                        grade: this.editStudentForm.grade,
                        house: this.editStudentForm.house
                    });
                    this.makeToast('Student Updated', 'Student has been successfully updated.', 'success');
                } catch (e) {
                    console.log(e);
                    this.makeToast('Student Update Failed', 'An error occurred while updating student. Please try again later.', 'danger')
                }
                this.editStudentForm = {
                    name: this.student.name,
                    grade: this.student.grade,
                    house: this.student.house
                }
            }
        }
    }
</script>

<style scoped>

</style>