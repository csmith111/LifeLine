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
      <thead>
        <th @click='setSortCol("name")'>Name</th>
        <th @click='setSortCol("category")' v-if='!isCatSelected'>Category</th>
        <th @click='setSortCol("duration")'>Duration</th>
        <th @click='setSortCol("frequency")'>Frequency</th>
      </thead>
      <tbody>
        <tr v-for='routine in filterRoutinesByCategory' v-bind:key="routine.guid">
          <td class='col-md-2'>
            <router-link :to='{name: "Routine", params: {id: routine.id } }'>
              {{ routine.name }}
            </router-link>
          </td>
          <td v-if='!isCatSelected' class='col-md-2'>
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
      <router-link to='/' class='btn btn-sm btn-primary'>Home</router-link> &nbsp; &nbsp;
      <span v-if='isCatSelected' class='btn btn-sm btn-info' @click='resetSelection()'>
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

const sortsFns = {
  name: R.sortBy(R.prop('name')),
  category: R.sortBy(R.prop('category')),
  duration: R.sortBy(R.prop('duration')),
  frequency: R.sortBy(R.prop('frequency')),
}

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
    },
    setSortCol: function (col) {
      this.$data.routines = sortsFns[col](this.$data.routines)
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
        r.guid = guid()
      })
    }
    axios.get('http://localhost:3000/routines')
      .then(resolution)
      .catch(error => {
        alert("There was an error fetching routines data. " + error)
      })
  }
}

/**
 * Generates a GUID string.
 * @returns {String} The generated GUID.
 * @example af8a8416-6e18-a307-bd9c-f2c947bbb3aa
 * @author Slavik Meltser (slavik@meltser.info).
 * @link http://slavik.meltser.info/?p=142
 */
function guid() {
    function _p8(s) {
        var p = (Math.random().toString(16)+"000000000").substr(2,8);
        return s ? "-" + p.substr(0,4) + "-" + p.substr(4,4) : p ;
    }
    return _p8() + _p8(true) + _p8(true) + _p8();
}
</script>
