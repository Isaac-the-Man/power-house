<template>
  <b-card>
    <h5>Edit Student</h5>
    <hr>
    <b-form @submit="updateStudent">
      <div class="row">
        <div class="col-md">
          <b-form-group label="Name" label-for="editStudentName">
            <b-form-input size="sm" v-model="editStudentForm.name" required id="editStudentName"
                          type="text"
                          placeholder="Student Name"></b-form-input>
          </b-form-group>
        </div>
        <div class="col-md">
          <b-form-group label="Grade" label-for="editStudentGrade">
            <b-form-select size="sm" v-model="editStudentForm.grade" required
                           :options="gradeOptions"
                           id="editStudentGrade"></b-form-select>
          </b-form-group>
        </div>
      </div>
      <b-form-group label="House" label-for="editStudentHouse">
        <b-form-select size="sm" v-model="editStudentForm.house" id="editStudentHouse" text-field="name"
                       value-field="key"
                       required :options="houseOptions"></b-form-select>
      </b-form-group>
      <b-form-group label="Schedule" label-for="editStudentSchedule">
        <div class="row">
          <div class="col-md">
            <b-form @submit="addClass">
              <b-input-group prepend="Start">
                <b-form-input type="time" required id="editStudentSchedule"
                              v-model="scheduleBuilder.start"></b-form-input>
              </b-input-group>
              <b-input-group class="mt-1" prepend="End">
                <b-form-input type="time" required v-model="scheduleBuilder.end"></b-form-input>
              </b-input-group>
              <b-input-group class="mt-1" prepend="Day of Week">
                <b-form-select :options="days" required v-model="scheduleBuilder.day"></b-form-select>
              </b-input-group>
              <b-input-group class="mt-1" prepend="Class Name">
                <b-form-input v-model="scheduleBuilder.name" required
                              placeholder="Class Name"></b-form-input>
              </b-input-group>
              <b-button class="my-1" type="submit" block variant="secondary">Add Class</b-button>
            </b-form>
          </div>
          <div class="col-md">
            <b-table
                :responsive="true"
                :items="editStudentForm.schedule"
                :fields="scheduleFields"
                bordered
                head-variant="dark"
                show-empty
                hover
                striped>
              <template v-slot:cell(day)="row">
                {{ row.item.day ? daysDict[row.item.day] : '' }}
              </template>
              <template v-slot:cell(actions)="row">
                <b-button size="sm" variant="danger" @click="deleteClass(row.item)">delete</b-button>
              </template>
            </b-table>
          </div>
        </div>
      </b-form-group>
      <b-button size="sm" type="submit" variant="warning" block>Update</b-button>
    </b-form>
    <pre>house changed? {{ houseChanged }}</pre>
    <pre>{{ editStudentForm }}</pre>
  </b-card>
</template>

<script>
export default {
  name: "AppEditStudent",
  props: ['student', 'houseOptions', 'gradeOptions'],
  data() {
    return {
      editStudentForm: this.clone(this.student),
      scheduleFields: [
        {label: 'Name', key: 'name', sortable: true},
        {label: 'Start', key: 'start', sortable: true},
        {label: 'End', key: 'end', sortable: true},
        {label: 'Day', key: 'day', sortable: true},
        {label: 'Actions', key: 'actions'}
      ],
      scheduleBuilder: {
        start: '',
        end: '',
        day: null,
        name: ''
      },
      days: [
        {text: 'Select a day', value: null},
        {text: 'Mon', value: 1},
        {text: 'Tue', value: 2},
        {text: 'Wed', value: 3},
        {text: 'Thu', value: 4},
        {text: 'Fri', value: 5},
        {text: 'Sat', value: 6},
        {text: 'Sun', value: 7}
      ],
      daysDict: {
        1: 'Mon',
        2: 'Tue',
        3: 'Wed',
        4: 'Thu',
        5: 'Fri',
        6: 'Sat',
        7: 'Sun'
      }
    }
  },
  computed: {
    houseChanged() {
      return this.student.house !== this.editStudentForm.house;
    },
    awards() {
      return this.$store.state.data.awards;
    }
  },
  methods: {
    deleteClass(item) {
      console.log('attempt to delete');
      console.log(this.editStudentForm);
      this.editStudentForm.schedule.splice(this.editStudentForm.schedule.indexOf(item), 1);
    },
    addClass(evt) {
      evt.preventDefault();
      if (!this.editStudentForm.schedule) {
        this.editStudentForm.schedule = [];
      }
      this.editStudentForm.schedule.push({
        start: this.scheduleBuilder.start,
        end: this.scheduleBuilder.end,
        day: this.scheduleBuilder.day,
        name: this.scheduleBuilder.name
      });
      this.scheduleBuilder = {
        start: '',
        end: '',
        day: null,
        name: ''
      }
    },
    updateAwards() {
      const updatedAwards = {};
      for (let [key, award] of Object.entries(this.awards)) {
        if (award.subject.mode === 'Student' && award.subject.data.key === this.student.key) {
          updatedAwards[key + '/subject/data/house'] = this.editStudentForm.house;
        }
      }
      return this.$store.state.database.db.ref('/awards').update(updatedAwards);
    },
    async updateStudent(evt) {
      evt.preventDefault();
      try {
        // update related awards if house changed
        if (this.houseChanged) {
          await this.updateAwards();
        }
        // update student
        await this.$store.state.database.db.ref('/students').child(this.student.key).update(this.editStudentForm);
        this.makeToast('Student Updated', 'Student has been successfully updated.', 'success');
      } catch (e) {
        console.log(e);
        this.makeToast('Student Update Failed', 'An error occurred while updating student. Please try again later.', 'danger')
      }
      this.editStudentForm = this.clone(this.student);
    }
  }
}
</script>

<style scoped>

</style>