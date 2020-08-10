<template>
  <b-card no-body class="mb-1 shadow">
    <b-card-header header-tag="header" class="p-1 border-0">
      <b-button block @click="visible = !visible" variant="info"><strong>{{ heading }}</strong></b-button>
    </b-card-header>
    <b-collapse v-model="visible" accordion="criteria-accordion">
      <b-card-body>
        <b-table-lite striped bordered head-variant="dark" small :fields="detailFields"
                      :items="detailItems"></b-table-lite>
        <b-button v-if="isAuthed" size="sm" block variant="warning" @click="editVisible = !editVisible">Edit</b-button>
        <b-collapse v-model="editVisible">
          <AppEditCriterion :criterion="criterion"></AppEditCriterion>
        </b-collapse>
        <b-button v-if="isAuthed" size="sm" @click="deleteCriterion" block variant="danger">Delete</b-button>
      </b-card-body>
    </b-collapse>
  </b-card>
</template>

<script>
import AppEditCriterion from "@/components/criteria/AppEditCriterion";

export default {
  name: "AppCriterion",
  props: {
    criterion: Object
  },
  components: {
    AppEditCriterion
  },
  computed: {
    isAuthed() {
      return this.$store.getters.authStatus.perm === 'Admin';
    },
    heading() {
      return `${this.criterion.title} (${this.criterion.points} points)`;
    },
    detailItems() {
      return Object.values(this.criterion.details);
    }
  },
  data() {
    return {
      visible: false,
      editVisible: false,
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
  methods: {
    async deleteCriterion() {
      try {
        const confirm = await this.confirmModal('Confirm deleting criterion? This action is irreversible.');
        if (confirm) {
          await this.$store.state.database.db.ref('/criteria').child(this.$vnode.key).remove();
          this.makeToast('Criterion Deleted', 'The selected criterion has been successfully removed.', 'success');
        }
      } catch (e) {
        console.log(e);
        this.makeToast('Criterion Not Deleted', 'An error occurred while deleting the selected criterion. Please try again later.', 'danger');
      }
    }
  }
}
</script>

<style scoped>

</style>