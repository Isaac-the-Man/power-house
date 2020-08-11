<template>
  <b-card class="shadow">
    <b-form @submit="newCriterion" @reset="resetForm">
      <h2>New Criterion</h2>
      <hr>
      <div class="row">
        <div class="col-md">
          <b-form-group label="Criterion Title" label-for="newCriterionTitle">
            <b-form-input required placeholder="Criterion Title" v-model="form.title" type="text"
                          id="newCriterionTitle"></b-form-input>
          </b-form-group>
        </div>
        <div class="col-md">
          <b-form-group label="Criterion Points" label-for="newCriterionPoints">
            <b-form-input number placeholder="Criterion Points" required v-model="form.points" type="number"
                          id="newCriterionPoints"></b-form-input>
          </b-form-group>
        </div>
      </div>
      <b-form-group label="Criterion Guidelines" label-for="newCriterionGuideline">
        <b-table-lite striped bordered head-variant="dark" small :fields="detailFields"
                      :items="detailItems"></b-table-lite>
        <b-form @submit="newGuideline">
          <b-input-group>
            <b-form-textarea v-model="guidelineBuilder.guide" required id="newCriterionGuideline"
                             placeholder="ESLRs for awarding or deducting" rows="3"
                             no-resize></b-form-textarea>
            <b-form-textarea v-model="guidelineBuilder.ex" required placeholder="Noteworthy Examples and/or guidance"
                             rows="3"
                             no-resize></b-form-textarea>
            <b-input-group-append>
              <b-button type="submit" variant="outline-secondary">Add</b-button>
            </b-input-group-append>
          </b-input-group>
        </b-form>
      </b-form-group>
      <b-button type="submit" block variant="primary">Save</b-button>
      <b-button type="reset" block variant="danger">Reset</b-button>
    </b-form>
  </b-card>
</template>

<script>
export default {
  name: "AppNewCriterion",
  data() {
    return {
      guidelineBuilder: {
        guide: '',
        ex: ''
      },
      form: {
        title: '',
        points: null,
        details: []
      },
      detailFields: [
        {
          label: 'ESLRs for awarding or deducting',
          key: 'guide'
        }, {
          label: 'Noteworthy Examples and/or guidance',
          key: 'ex'
        }
      ]
    };
  },
  computed: {
    detailItems() {
      return Object.values(this.form.details);
    }
  },
  methods: {
    newGuideline(evt) {
      evt.preventDefault();
      this.form.details.push({
        guide: this.guidelineBuilder.guide,
        ex: this.guidelineBuilder.ex
      });
      this.guidelineBuilder = {
        guide: '',
        ex: ''
      }
    },
    async pushNewCriterion(criterion) {
      try {
        await this.$store.state.database.db.ref('/criteria').push(criterion);
        this.makeToast('Criterion Created', 'A criterion has been successfully created.', 'success');
      } catch (e) {
        console.log(e);
        this.makeToast('Criterion Not Created', 'An error occurred while creating the criterion. Please try again later.', 'danger');
      }
    },
    newCriterion(evt) {
      evt.preventDefault();
      this.pushNewCriterion(this.form);
      this.resetForm();
    },
    resetForm(evt) {
      if (evt) {
        evt.preventDefault();
      }
      this.form = {
        title: '',
        points: null,
        details: []
      }
    }
  }
}
</script>

<style scoped>

</style>