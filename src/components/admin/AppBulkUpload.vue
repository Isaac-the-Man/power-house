<template>
    <div v-if="isDataLoaded">
        <!-- step 1 -->
        <h5>Step 1: Upload TimeBlocks</h5>
        <p>Upload a CSV with three columns: <strong>Block</strong>, <strong>Start</strong>, and <strong>End</strong>.
            Sample below:</p>
        <b-table-simple small hover striped bordered>
            <b-thead head-variant="dark">
                <b-th>Block</b-th>
                <b-th>Start</b-th>
                <b-th>End</b-th>
            </b-thead>
            <b-tbody>
                <b-tr>
                    <b-td>Block1</b-td>
                    <b-td>08:30</b-td>
                    <b-td>09:30</b-td>
                </b-tr>
                <b-tr>
                    <b-td>Block2</b-td>
                    <b-td>13:00</b-td>
                    <b-td>15:30</b-td>
                </b-tr>
                <b-tr>
                    <b-td>Block3</b-td>
                    <b-td>15:30</b-td>
                    <b-td>18:30</b-td>
                </b-tr>
            </b-tbody>
        </b-table-simple>
        <b-form @submit="parseTimeBlocks">
            <b-form-group label="Time Blocks" label-for="bulkTimeblock">
                <b-input-group>
                    <b-form-file v-model="raw.timeblock.file" required accept=".csv" id="bulkTimeblock"></b-form-file>
                    <b-input-group-append>
                        <b-button type="submit">Upload</b-button>
                    </b-input-group-append>
                </b-input-group>
            </b-form-group>
        </b-form>
        <ul>
            <li>TimeBlocks <span :style="{'color': parsed.timeblock ? 'green' : 'red' }">({{ parsed.timeblock ? 'parsed' : 'empty' }})</span>
            </li>
        </ul>

        <!-- step 2 -->
        <div v-if="parsed.timeblock">
            <h5>Step 2: Upload Students by Houses</h5>
            <p>For each house upload a CSV with <strong>Name</strong>, <strong>Grade</strong>, and the courses for each
                time
                blocks you uploaded in the previous step. Grades can only be of the following: <i>g1, g2, g3, ... , g12</i>. Note that courses can be leave blank. Sample below:</p>
            <b-table-simple small hover striped bordered>
                <b-thead head-variant="dark">
                    <b-th>Name</b-th>
                    <b-th>Grade</b-th>
                    <b-th>Block1</b-th>
                    <b-th>Block2</b-th>
                    <b-th>Block3</b-th>
                </b-thead>
                <b-tbody>
                    <b-tr>
                        <b-td>Steven</b-td>
                        <b-td>G12</b-td>
                        <b-td>APCS</b-td>
                        <b-td>English</b-td>
                        <b-td>History</b-td>
                    </b-tr>
                    <b-tr>
                        <b-td>Jack</b-td>
                        <b-td>G9</b-td>
                        <b-td></b-td>
                        <b-td>Algebra</b-td>
                        <b-td>Geometry</b-td>
                    </b-tr>
                    <b-tr>
                        <b-td>Stacy</b-td>
                        <b-td>G10</b-td>
                        <b-td>Calculus</b-td>
                        <b-td>Art</b-td>
                        <b-td></b-td>
                    </b-tr>
                </b-tbody>
            </b-table-simple>
            <b-form @submit="parseStudents">
                <b-form-group label="Houses">
                    <b-input-group>
                        <b-input-group-prepend>
                            <b-form-select v-model="houseSelected" required text-field="name" value-field="key"
                                           :options="housesOptions"></b-form-select>
                        </b-input-group-prepend>
                        <b-form-file v-model="raw.house.file" required accept=".csv"></b-form-file>
                        <b-input-group-append>
                            <b-button type="submit">Upload</b-button>
                        </b-input-group-append>
                    </b-input-group>
                </b-form-group>
            </b-form>
            <ul>
                <li v-for="(house, i) in parsed.houses" :key="i">{{ house.house.name }} <span
                        :style="{'color': parsed.houses[i] ? 'green' : 'red' }">({{ parsed.houses[i] ? 'parsed' : 'empty' }})</span>
                </li>
            </ul>
        </div>

        <b-button @click="bulkCreateStudents" :disabled="!isParsed" variant="primary" block>Submit</b-button>

        <pre> houseSelected: {{ houseSelected}}</pre>
        <pre> merged: {{merged}} </pre>
    </div>
</template>

<script>
    import Papa from 'papaparse';

    export default {
        name: "AppBulkUpload",
        data() {
            return {
                merged: [],
                gradeOptions: ['g1', 'g2', 'g3', 'g4', 'g5', 'g6', 'g7', 'g8', 'g9', 'g10', 'g11', 'g12'],
                parsed: {
                    timeblock: null,
                    houses: []
                },
                raw: {
                    timeblock: {
                        file: null
                    },
                    house: {
                        file: null
                    }
                },
                houseSelected: null
            }
        },
        methods: {
            async bulkCreateStudents() {
                const res = await this.confirmModal('Do you confirm to create multiple students?');
                if (res) {
                    try {
                        this.mergeStudents();
                        await this.pushStudents();
                        this.makeToast('Students Created', `${this.merged.length} students has been created.`, 'success');
                    } catch (e) {
                        console.log(e);
                        this.makeToast('Students Creation Failed', `An error occurred while creating multiple students. Please try again later.`, 'danger');
                    }
                    this.merged = [];
                    this.parsed = {
                        timeblock: null,
                        houses: []
                    }
                    this.raw = {
                        timeblock: {
                            file: null
                        },
                        house: {
                            file: null
                        }
                    }
                    this.houseSelected = null;
                }
            },
            pushStudents() {
                const updates = {};
                for (let student of this.merged) {
                    updates['/students/' + this.$store.state.database.db.ref('/students').push().key] = {
                        ...student
                    }
                }
                return this.$store.state.database.db.ref('/').update(updates);
            },
            mergeStudents() {
                // rotate each house
                for (let house of this.parsed.houses) {
                    // rotate students in each house
                    for (let student of house.data) {
                        // populate time blocks
                        const merged = {
                            name: student.Name,
                            grade: student.Grade,
                            house: house.house.key,
                            schedule: []
                        };
                        for (let [key, course] of Object.entries(student)) {
                            console.log('loading key: ' + key);
                            if (key !== 'Name' && key !== 'Grade' && course !== '') {
                                if (this.timeblockDict[key]) {
                                    merged.schedule.push({
                                        start: this.timeblockDict[key].start,
                                        end: this.timeblockDict[key].end,
                                        name: course
                                    });
                                } else {
                                    console.log('timeblock not found')
                                }
                            } else {
                                console.log('key skipped...')
                            }
                        }
                        console.log(merged)
                        this.merged.push(merged);
                    }
                }
            },
            parseStudents(evt) {
                evt.preventDefault();
                const vm = this;
                const config = {
                    skipEmptyLines: true,
                    header: true,
                    complete(results) {
                        console.log(results);
                        if (results.meta.fields.includes('Name') && results.meta.fields.includes('Grade')) {
                            // check grade
                            for (let student of results.data) {
                                if (vm.gradeOptions.includes(student.Grade.toLowerCase())) {
                                    student.Grade = student.Grade.toLowerCase();
                                } else {
                                    vm.makeToast('Parsing Error', `Found unexpected value "${student.Grade}" in grade column.`, 'danger');
                                    return;
                                }
                            }
                            // push to parsed
                            vm.parsed.houses.push({
                                house: {
                                    key: vm.houseSelected,
                                    ...vm.houses[vm.houseSelected]
                                },
                                ...results
                            });
                            vm.makeToast('File Parsed', 'Students successfully parsed.', 'success');
                        } else {
                            vm.makeToast('Parsing Error', 'Required Column "Name" and "Grade" not found.', 'danger');
                        }
                        vm.raw.house.file = null;
                        vm.houseSelected = null;
                    },
                    error(error) {
                        vm.makeToast('Parsing Error', 'Required Column "Name" and "Grade" not found.', 'danger');
                        console.log(error);
                        vm.raw.house.file = null;
                        vm.houseSelected = null;
                    }
                }
                if (this.raw.house.file) {
                    Papa.parse(this.raw.house.file, config);
                }
            },
            parseTimeBlocks(evt) {
                evt.preventDefault();
                const vm = this;
                const config = {
                    header: true,
                    complete(results) {
                        console.log(results)
                        if (vm.arrayEquals(results.meta.fields, ["Block", "Start", "End"])) {
                            vm.parsed.timeblock = results;
                            vm.makeToast('File Parsed', 'Time blocks successfully parsed.', 'success');
                        } else {
                            vm.makeToast('Parsing Error', 'Required Column "Block", "Start", or "End" not found.', 'danger');
                        }
                        vm.raw.timeblock.file = null;
                    },
                    error(error) {
                        vm.makeToast('Parsing Error', 'Required Column "Block", "Start", or "End" not found.', 'danger');
                        console.log(error);
                        vm.raw.timeblock.file = null;
                    }
                }
                if (this.raw.timeblock.file) {
                    Papa.parse(this.raw.timeblock.file, config);
                }
            }
        },
        computed: {
            timeblockDict() {
                const dict = {};
                for (let block of this.parsed.timeblock.data) {
                    dict[block.Block] = {
                        start: block.Start,
                        end: block.End
                    };
                }
                return dict;
            },
            isParsed() {
                return this.parsed.timeblock && this.parsed.houses.length > 0;
            },
            isDataLoaded() {
                return this.$store.getters.isDataLoaded;
            },
            houses() {
                return this.$store.state.data.houses;
            },
            housesArray() {
                return this.$store.getters.housesArray;
            },
            housesOptions() {
                return [
                    {name: 'Select a house', key: null},
                    ...this.housesArray
                ]
            }
        }
    }
</script>

<style scoped>

</style>