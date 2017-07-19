<template>
  <div class="routines">
    <h2>
      Routines
    </h2>
    <h4 v-if='isCatSelected'>
      <span class='text-capitalize text-info' @click='resetSelection()'>
        {{catSelected}}
      </span>
      &nbsp; &nbsp;
      <span v-if='isCatSelected' class='label label-info' @click='resetSelection()'>
        Show All Categories
      </span>
    </h4>
    <table class='table table-hover table-condensed'>
      <tbody>
        <tr v-for='routine in filterRoutinesByCategory' v-bind:key="routine.id">
          <td class='col-md-2'>
            <router-link :to='{name: "Routine", params: {id: routine.id } }'>
              {{ routine.name }}
            </router-link>
          </td>
          <td v-if=' ! isCatSelected' class='col-md-2'>
            <span class='label'
                  :class="[routine.catcolor]"
                  @click='selectCategory(routine.category)'>
              {{ routine.category }}
            </span>
          </td>
          <td class='col-md-2'>
            <span class='label'
                  :class="[routine.durationcolor]">
              {{routine.duration}}
            </span>
          </td>
          <td class='col-md-2'>
            <span class='label'
                  :class="[routine.freqcolor]">
              {{routine.frequency}}
            </span>
          </td>
          <td class='text-muted'>{{routine.notes}}</td>
        </tr>
      </tbody>
    </table>
    <p>
      <router-link to='/' class='label label-primary'>Home</router-link> &nbsp; &nbsp;
      <span v-if='isCatSelected' class='label label-info' @click='resetSelection()'>
        Show All Categories
      </span>
    </p>
  </div>
</template>

<script>

import cycle from '../utils'
import R from 'ramda'
import axios from 'axios'

const labeltypes = ['label-info', 'label-primary', 'label-success',
                    'label-danger', 'label-warning', 'label-default']

export default {
  name: 'routines',
  data() {
    return {
      routines: [],
      isCatSelected: false,
      catSelected: '',
    }
  },
  methods: {
    selectCategory: function (category) {
      this.$data.isCatSelected = !this.$data.isCatSelected
      this.$data.catSelected = this.$data.isCatSelected ? category : ''
    },
    resetSelection() {
      this.$data.isCatSelected = false
      this.$data.catSelected = ''
    }
  },
  computed: {
    filterRoutinesByCategory() {
      if (this.$data.isCatSelected) {
        return this.$data.routines.filter(r => {
          return this.$data.catSelected === r.category
        })
      } else {
        return this.$data.routines
      }
    }
  },
  created() {
    const resolution = resolve => {
      this.routines = resolve.data
      const uniqueCategoriesFn = R.compose(R.uniq, R.pluck('category'))
      const uniqueFrequenciesFn = R.compose(R.uniq, R.pluck('frequency'))
      const uniqueDurationsFn = R.compose(R.uniq, R.pluck('duration'))
      const uniqueCats = uniqueCategoriesFn(this.routines)
      const uniqueFreqs = uniqueFrequenciesFn(this.routines)
      const uniqueDurations = uniqueDurationsFn(this.routines)
      const catcolors = cycle(uniqueCats.length, labeltypes)
      const catcolormap = R.zipObj(uniqueCats, catcolors)
      const freqcolors = cycle(uniqueFreqs.length, labeltypes)
      const freqcolormap = R.zipObj(uniqueFreqs, freqcolors)
      const durationcolors = cycle(uniqueDurations.length, labeltypes)
      const durationcolormap = R.zipObj(uniqueDurations, durationcolors)
      const sortByCat = R.sortBy(R.prop('category'))
      this.routines = sortByCat(this.routines)
      this.routines.map(r => {
        r.catcolor = catcolormap[r.category]
        r.freqcolor = freqcolormap[r.frequency]
        r.durationcolor = durationcolormap[r.duration]
      })
    }
    axios.get('http://localhost:3000/routines')
      .then(resolution)
      .catch(error => {
        alert("There was an error fetching routines data. " + error)
      })
  }
}
</script>
