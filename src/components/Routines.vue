<template>
  <div class="routines">
    <h2>
      Routines
    </h2>
    <h4 v-if='isCatSelected || isDurSelected || isFreqSelected'>
      <span v-if='isCatSelected' class='text-capitalize' @click='resetSelection()'>
        Category: {{catSelected}}
      </span>
      <span v-if='isDurSelected' class='text-capitalize' @click='resetSelection()'>
        Duration: {{durSelected}}
      </span>
      <span v-if='isFreqSelected' class='text-capitalize' @click='resetSelection()'>
        Frequency: {{freqSelected}}
      </span>
      &nbsp; &nbsp;
      <span v-if='isCatSelected || isDurSelected || isFreqSelected'
            class='label label-info'
            @click='resetSelection()'>
        Show All
      </span>
    </h4>
    <table class='table table-hover table-condensed'>
      <thead>
        <th @click='setSortCol("name")'>Name</th>
        <th @click='setSortCol("category")' v-if='!isCatSelected'>Category</th>
        <th @click='setSortCol("duration")' v-if='!isDurSelected'>Duration</th>
        <th @click='setSortCol("frequency")' v-if='!isFreqSelected'>Frequency</th>
        <th>Notes</th>
      </thead>
      <tbody>
        <tr v-for='routine in filterRoutines' v-bind:key="routine.guid">
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
          <td v-if='!isDurSelected' class='col-md-2'>
            <span class='label'
                  :class="[routine.durationcolor]"
                  @click='selectDuration(routine.duration)'>
              {{routine.duration}}
            </span>
          </td>
          <td v-if='!isFreqSelected' class='col-md-2'>
            <span class='label'
                  :class="[routine.freqcolor]"
                  @click='selectFrequency(routine.frequency)'>
              {{routine.frequency}}
            </span>
          </td>
          <td> <em>{{routine.notes}}</em></td>
        </tr>
      </tbody>
    </table>
    <p>
      <router-link to='/' class='btn btn-sm btn-primary'>Home</router-link> &nbsp; &nbsp;
      <span v-if='isCatSelected || isDurSelected || isFreqSelected'
            class='btn btn-sm btn-info'
            @click='resetSelection()'>
        Show All
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
      isDurSelected: false,
      durSelected: '',
      isFreqSelected: false,
      freqSelected: '',
    }
  },
  methods: {
    selectCategory: function (category) {
      if (this.$data.isDurSelected || this.$data.isFreqSelected) {
        return
      }
      this.$data.isCatSelected = !this.$data.isCatSelected
      this.$data.catSelected = this.$data.isCatSelected ? category : ''
    },
    selectDuration: function (duration) {
      if (this.$data.isCatSelected || this.$data.isFreqSelected) {
        return
      }
      this.$data.isDurSelected = !this.$data.isDurSelected
      this.$data.durSelected = this.$data.isDurSelected ? duration : ''
    },
    selectFrequency: function (freq) {
      if (this.$data.isCatSelected || this.$data.isDurSelected) {
        return
      }
      this.$data.isFreqSelected = !this.$data.isFreqSelected
      this.$data.freqSelected = this.$data.isFreqSelected ? freq : ''
    },
    resetSelection() {
      if (this.$data.isCatSelected) {
        this.$data.isCatSelected = false
        this.$data.catSelected = ''
      } else if (this.$data.isDurSelected) {
        this.$data.isDurSelected = false
        this.$data.durSelected = ''
      } else if (this.$data.isFreqSelected) {
        this.$data.isFreqSelected = false
        this.$data.freqSelected = ''
      }
    },
    setSortCol: function (col) {
      this.$data.routines = sortsFns[col](this.$data.routines)
    }
  },
  computed: {
    filterRoutines() {
      if (this.$data.isCatSelected) {
        return this.$data.routines.filter(r => {
          return this.$data.catSelected === r.category
        })
      } if (this.$data.isDurSelected) {
        return this.$data.routines.filter(r => {
          return this.$data.durSelected === r.duration
        })
      } if (this.$data.isFreqSelected) {
        return this.$data.routines.filter(r => {
          return this.$data.freqSelected === r.frequency
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
