<template>
    <div>
        <b-form-group>
            <b-form-checkbox @change="clearSelected" button-variant="info" v-model="mode" button size="sm"
                             value="Student" unchecked-value="House">
                Give/Deduct Awards to: {{ mode }}
            </b-form-checkbox>
        </b-form-group>
        <div v-if="mode === 'Student'">
            <b-form>
                <div class="row">
                    <div class="col-md">
                        <b-form-group label="Search">
                            <b-form-input size="sm" v-model="filter" type="search"
                                          placeholder="Search Name"></b-form-input>
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
                    :responsive="true"
                    selectable
                    select-mode="single"
                    selected-variant="success"
                    @row-selected="onRowSelected"
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
            </b-table>
            <div class="row">
                <div class="col text-center">
                    <b-pagination
                            size="sm"
                            v-model="currentPage"
                            :total-rows="totalRows"
                            :per-page="perPage"
                            align="center"
                            class="mb-1"
                    ></b-pagination>
                </div>
            </div>
        </div>
        <div v-else>
            <b-form-group label="House">
                <b-form-select required v-model="selected" :options="houseOptions" text-field="name"
                               value-field="key"></b-form-select>
            </b-form-group>
        </div>
    </div>
</template>

<script>
    export default {
        name: "AppStudentSelector",
        props: ['value'],
        data() {
            return {
                mode: 'Student',
                selected: this.value,
                filter: '',
                totalRows: 0,
                currentPage: 1,
                perPage: 5,
                pageOptions: [5, 10, 30, 50],
                studentFields: [
                    {label: 'Name', key: 'name', sortable: true},
                    {label: 'Grade', key: 'grade', sortable: true},
                    {label: 'House', key: 'house', sortable: true}
                ]
            }
        },
        watch: {
            selected(val) {
                this.$emit('input', {
                    mode: this.mode,
                    data: val
                });
            },
            studentsArray(val) {
                this.totalRows = val.length;
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
            onFiltered(filteredItems) {
                // Trigger pagination to update the number of buttons/pages due to filtering
                this.totalRows = filteredItems.length
                this.currentPage = 1
            },
            onRowSelected(items) {
                this.selected = items[0];
            },
            clearSelected() {
                this.selected = null;
            }
        },
        created() {
            this.totalRows = this.studentsArray.length;
        }
    }
</script>

<style scoped>

</style>