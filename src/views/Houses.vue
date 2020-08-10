<template>
  <b-overlay :show="!isDataLoaded">
    <div v-if="isDataLoaded">
      <div class="row">
        <div class="col">
          <b-jumbotron :style="{'background-color': house.color}" class="shadow text-center m-0"
                       :header="house.name" :lead="`Total Score: ${house.score}`">
            <p>Population: {{ population }} | Awards Count: {{ awardsCount }} | Current Rank: {{ houseRank }}</p>
          </b-jumbotron>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <b-tabs class="mt-3" pills active-nav-item-class="shadow">
            <b-tab title="Awards" active>
              <!-- search bar-->
              <b-form class="shadow mt-3">
                <b-form-group>
                  <b-input-group prepend="Search">
                    <b-form-input v-model="search" type="search"></b-form-input>
                  </b-input-group>
                </b-form-group>
              </b-form>

              <!-- all awards -->
              <AppRecentAwards :awards="paginatedFilteredAwards"></AppRecentAwards>

              <!-- pagination -->
              <div class="mt-3 d-flex justify-content-center">
                <b-pagination
                    class="shadow"
                    v-model="awardsTab.currentPage"
                    :total-rows="awardsTab.totalRows"
                    per-page="5"
                    align="fill"
                ></b-pagination>
              </div>

            </b-tab>
            <b-tab title="Students">

              <!-- search bar-->
              <b-form class="shadow mt-3">
                <b-form-group>
                  <b-input-group prepend="Search">
                    <b-form-input v-model="search" type="search"></b-form-input>
                  </b-input-group>
                </b-form-group>
              </b-form>
              <!-- students display-->
              <b-card-group columns v-if="inHouseStudentsArray.length > 0">
                <AppStudentPreview v-for="(student, i) in filteredStudents"
                                   :key="i"
                                   :student="student">
                </AppStudentPreview>
              </b-card-group>
              <div v-else class="text-center">
                <h3 class="font-weight-lighter">Wow, such empty...</h3>
              </div>

            </b-tab>
          </b-tabs>
        </div>
      </div>
    </div>
    <div v-else class="text-center">
      <h3 class="font-weight-lighter">Oops, no such house was found...</h3>
      <b-link to="/">Return</b-link>
    </div>
    <div class="row">
      <div v-if="isDataLoaded" class="col">
        <pre>{{ awardsTab }}</pre>
        <h3>house: {{ houseKey }}</h3>
        <pre>{{ house }}</pre>
        <h3>students</h3>
        <pre>{{ inHouseStudentsArray }}</pre>
        <h3>filtered</h3>
        <pre>{{ filteredStudents }}</pre>
        <h3>awards</h3>
        <pre>{{ inHouseAwardsArray }}</pre>
      </div>
    </div>
  </b-overlay>
</template>

<script>
import AppStudentPreview from "@/components/houses/AppStudentPreview";
import AppRecentAwards from "@/components/dashboard/AppRecentAwards";

export default {
  name: "Houses",
  components: {
    AppStudentPreview,
    AppRecentAwards
  },
  data() {
    return {
      search: '',
      awardsTab: {
        currentPage: 1,
        totalRows: 1
      }
    }
  },
  computed: {
    isDataLoaded() {
      return this.$store.getters.isDataLoaded;
    },
    awards() {
      return this.$store.getters.populatedAwards;
    },
    inHouseAwardsArray() {
      const inHouse = [];
      for (let [key, award] of Object.entries(this.awards)) {
        let houseKey;
        if (award.subject.mode === 'Student') {
          houseKey = award.subject.data.house;
        } else {
          houseKey = award.subject.data.key;
        }
        if (houseKey === this.houseKey) {
          inHouse.push({
            ...award,
            key
          });
        }
      }
      return inHouse.reverse();
    },
    houseKey() {
      return this.$route.params.houseId;
    },
    house() {
      return this.$store.getters.scoredHouses[this.houseKey];
    },
    scoredStudents() {
      return this.$store.getters.scoredStudents;
    },
    rankedInHouseStudentsArray() {
      const ranked = [...this.inHouseStudentsArray];
      ranked.sort((a, b) => {
        return b.score - a.score;
      });
      for (let [i, student] of ranked.entries()) {
        student.rank = i + 1;
      }
      return ranked;
    },
    inHouseStudentsArray() {
      const inHouse = [];
      for (let [key, student] of Object.entries(this.scoredStudents)) {
        if (student.house === this.houseKey) {
          inHouse.push({
            ...student,
            key
          });
        }
      }
      return inHouse;
    },
    population() {
      return this.inHouseStudentsArray.length;
    },
    awardsCount() {
      return this.inHouseAwardsArray.length;
    },
    houseRank() {
      const sorted = [...this.$store.getters.scoredHousesArray].sort((a, b) => {
        return b.score - a.score;
      });
      for (let ranked of sorted) {
        if (ranked.key === this.houseKey) {
          return sorted.indexOf(ranked) + 1;
        }
      }
      return 0;
    },
    filteredStudents() {
      return this.rankedInHouseStudentsArray.filter((student) => {
        return student.name.toLowerCase().includes(this.search.toLowerCase())
      });
    },
    filteredAwards() {
      return this.inHouseAwardsArray.filter((award) => {
        return award.criterion.title.toLowerCase().includes(this.search.toLowerCase())
      });
    },
    paginatedFilteredAwards() {
      return this.filteredAwards.slice((this.awardsTab.currentPage - 1) * 5, (this.awardsTab.currentPage - 1) * 5 + 5);
    }
  },
  watch: {
    filteredAwards(val) {
      if (this.filteredAwards) {
        this.awardsTab.currentPage = 1;
        this.awardsTab.totalRows = val.length;
      } else {
        this.awardsTab.totalRows = 1;
      }
    }
  },
  created() {
    this.awardsTab.totalRows = this.filteredAwards.length;
  }
}
</script>

<style scoped>

</style>