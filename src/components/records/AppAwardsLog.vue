<template>
  <div>
    <!-- search and query -->
    <b-form>
      <div class="row">
        <div class="col">
          <b-form-group class="shadow">
            <b-input-group prepend="Search">
              <b-input-group-prepend>
                <b-form-select v-model="filterField" :options="filterOptions" text-field="label"
                               value-field="key"></b-form-select>
              </b-input-group-prepend>
              <b-form-input placeholder="filter" :disabled="filterField === null" v-model="filter"
                            type="search"></b-form-input>
            </b-input-group>
          </b-form-group>
        </div>
        <div class="col">
          <b-form-group class="shadow">
            <b-input-group prepend="Per Page">
              <b-form-select v-model="perPage" :options="pageOptions"></b-form-select>
            </b-input-group>
          </b-form-group>
        </div>
      </div>
    </b-form>

    <!-- table -->
    <b-table
        :responsive="true"
        :current-page="currentPage"
        :per-page="perPage"
        :filter="filter"
        :filter-included-fields="formattedFilterField"
        @filtered="onFiltered"
        show-empty
        class="shadow"
        :items="formattedAwardsArray"
        :fields="fields"
        bordered
        head-variant="dark"
        striped
        hover>
      <template v-slot:cell(tags)="row">
        <b-badge v-for="(tag, i) in row.item.tags" :key="i" pill variant="warning" size="sm">
          {{ tag }}
        </b-badge>
      </template>
      <template v-if="isAuthed" v-slot:cell(action)="row">
        <b-button size="sm" variant="danger" @click="deleteAward(row.item.key)">Delete</b-button>
      </template>
    </b-table>

    <!-- pagination -->
    <div class="d-flex justify-content-center">
      <b-pagination
          class="shadow"
          v-model="currentPage"
          :total-rows="totalRows"
          :per-page="perPage"
          align="fill"
      ></b-pagination>
    </div>

    <pre>
            {{ filterField }}
            {{ formattedFilterField }}
            {{ awardsArray }}
        </pre>

  </div>
</template>

<script>
import moment from 'moment';

export default {
  name: "AppAwardsLog",
  data() {
    return {
      pageOptions: [5, 10, 30, 50],
      filter: '',
      filterField: null,
      currentPage: 1,
      totalRows: 0,
      perPage: 5,
    }
  },
  computed: {
    isAuthed() {
      return this.$store.getters.authStatus.perm === 'Admin';
    },
    fields() {
      const baseFields = [
        {label: 'Title', key: 'title', sortable: true},
        {label: 'Points', key: 'points', sortable: true},
        {label: 'Subject', key: 'subject', sortable: true},
        {label: 'House', key: 'house', sortable: true},
        {label: 'Notes', key: 'notes', sortable: true},
        {label: 'Tags', key: 'tags'},
        {label: 'From', key: 'source', sortable: true},
        {label: 'Date', key: 'createdAt', sortable: true}
      ]
      if (!this.isAuthed) {
        return baseFields
      } else {
        return [
          ...baseFields,
          {label: 'Action', key: 'action'}
        ]
      }
    },
    formattedFilterField() {
      if (this.filterField !== null) {
        return [this.filterField];
      } else {
        return [];
      }
    },
    filterOptions() {
      return [
        {label: 'select filter', key: null},
        ...this.fields
      ]
    },
    houses() {
      return this.$store.state.data.houses
    },
    awardsArray() {
      return this.$store.getters.populatedAwardsArray;
    },
    formattedAwardsArray() {
      const formatted = [];
      for (let award of this.awardsArray) {
        formatted.push({
          key: award.key,
          title: award.criterion.title,
          points: award.addDeduct === 'add' ? award.criterion.points : -1 * award.criterion.points,
          subject: award.subject.mode === 'Student' ? award.subject.data.grade.toUpperCase() + ' ' + award.subject.data.name : award.subject.data.name,
          house: this.getHouseName(award.subject.mode === 'Student' ? award.subject.data.house : award.subject.data.key).name,
          notes: award.notes,
          tags: award.tags,
          source: award.source,
          createdAt: this.formatTime(award.createdAt)
        });
      }
      return formatted;
    }
  },
  methods: {
    async deleteAward(id) {
      const confirm = await this.confirmModal("Are you sure you want to delete the selected award? This process is irreversible.");
      if (confirm) {
        try {
          await this.$store.state.database.db.ref('/awards').child(id).remove();
          this.makeToast("Awards Deleted", "The selected awards have been deleted successfully", 'success')
        } catch (e) {
          console.log(e);
          this.makeToast("Awards Not Deleted", "An error occurred while deleting the award, please try again later.", 'danger')
        }
      }
    },
    formatTime(str) {
      return moment(str).format('lll');
    },
    getHouseName(id) {
      return this.houses[id];
    },
    onFiltered(filteredItems) {
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    }
  },
  watch: {
    filterField(val) {
      if (val === null) {
        this.filter = '';
      }
    }
  },
  created() {
    this.totalRows = this.formattedAwardsArray.length;
  }
}
</script>

<style scoped>

</style>