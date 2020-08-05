<template>
  <b-card-group deck>
    <b-card v-for="(house, i) in sortedHouses" :key="i" @click="redirectHouse(house.key)"
            :style="{'background-color': house.color}"
            role="button"
            class="shadow d-flex justify-content-center align-items-center text-center" :title="house.name">
      Score: {{ house.score === undefined ? 0 : house.score }}
    </b-card>
  </b-card-group>
</template>

<script>
export default {
  name: "AppHousesScore",
  props: {
    houses: {
      type: Array,
      required: true
    }
  },
  computed: {
    sortedHouses() {
      return [...this.houses].sort((a, b) => {
        return b.score - a.score;
      });
    }
  },
  methods: {
    redirectHouse(id) {
      this.$router.push(`/houses/${id}`);
    }
  }
}
</script>

<style scoped>
</style>