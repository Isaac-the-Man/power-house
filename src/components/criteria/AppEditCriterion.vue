<template>
  <b-card>
    <h5>Edit Criterion</h5>
    <hr>
    <b-form @submit="updateCriterion">
      <div class="row">
        <div class="col-md">
          <b-form-group label="Criterion Title">
            <b-form-input v-model="editCriterionForm.title" size="sm" type="text"
                          placeholder="Criterion Title"></b-form-input>
          </b-form-group>
        </div>
        <div class="col-md">
          <b-form-group label="Criterion Points">
            <b-form-input v-model.number="editCriterionForm.points" size="sm" type="number"
                          placeholder="Criterion Title"></b-form-input>
          </b-form-group>
        </div>
      </div>
      <b-form-group label="Criterion Guidelines">
        <b-table show-empty hover striped head-variant="dark" bordered stacked="md" small :fields="guidelineFields"
                 :items="editCriterionForm.details">
          <template v-slot:cell(guide)="row">
            <b-form-textarea v-model="row.item.guide"></b-form-textarea>
          </template>
          <template v-slot:cell(ex)="row">
            <b-form-textarea v-model="row.item.ex"></b-form-textarea>
          </template>
          <template v-slot:cell(actions)="row">
            <b-button size="sm" variant="danger" @click="deleteCriterion(row.item)">delete</b-button>
          </template>
        </b-table>
        <b-form @submit="addGuideline">
          <b-input-group>
            <b-form-textarea required v-model="guidelineBuilder.guide" size="sm" no-resize
                             placeholder="ESLRs for awarding or deducting"></b-form-textarea>
            <b-form-textarea required v-model="guidelineBuilder.ex" size="sm" no-resize
                             placeholder="Noteworthy examples and guidance"></b-form-textarea>
            <b-input-group-append>
              <b-button type="submit" size="sm" variant="secondary">Add</b-button>
            </b-input-group-append>
          </b-input-group>
        </b-form>
      </b-form-group>
      <b-button size="sm" block type="submit" variant="warning">Update</b-button>
    </b-form>
  </b-card>
</template>

<script>
export default {
  name: "AppEditCriterion",
  props: {
    criterion: Object
  },
  data() {
    return {
      editCriterionForm: this.clone(this.criterion),
      guidelineFields: [
        {label: 'ESLRs for awarding or deducting', key: 'guide'},
        {label: 'Noteworthy Examples and/or guidance', key: 'ex'},
        {label: 'Actions', key: 'actions'}
      ],
      guidelineBuilder: {
        guide: '',
        ex: ''
      }
    }
  },
  methods: {
    addGuideline(evt) {
      evt.preventDefault();
      this.editCriterionForm.details.push(this.clone(this.guidelineBuilder));
      this.guidelineBuilder = {
        guide: '',
        ex: ''
      }
    },
    deleteCriterion(item) {
      const index = this.editCriterionForm.details.indexOf(item);
      if (index >= 0) {
        this.editCriterionForm.details.splice(index, 1);
      }
    },
    updateCriterion(evt) {
      evt.preventDefault();
      try {
        this.$store.state.database.db.ref('/criteria').child(this.editCriterionForm.key).update(this.editCriterionForm);
        this.makeToast('Criterion Updated', 'Criterion has been successfully updated.', 'success');
      } catch (e) {
        console.log(e);
        this.makeToast('Update Criterion Failed', 'An error occurred while updating the criterion.', 'danger');
      }
    }
  }
}
</script>

<style scoped>

</style>