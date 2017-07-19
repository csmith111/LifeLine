<template>
  <div class="routines">
    <h2>
      Routines
    </h2>
    <h4 v-if='isCatSelected'>
      <span class='text-capitalize text-info' @click='resetSelection()'>
        {{catSelected}}
      </span>
    </h4>
    <table class='table table-hover table-condensed'>
      <tbody>
        <tr v-for='routine in routines' v-bind:key="routine.id">
          <template v-if='isCatSelected'>
            <template v-if='catSelected === routine.category'>
              <td class='col-md-2'>
                <router-link to='{name: "Routine", params: {id: routine.id } }'>
                  {{ routine.name }}
                </router-link>
              </td>
              <td v-if=' ! isCatSelected' class='col-md-2'>
                <span class='label'
                      v-bind:class="[routine.color]"
                      @click='selectCategory(routine.category)'>
                  {{ routine.category }}
                </span>
              </td>
              <td class='col-md-2'>
                  {{routine.duration}}
              </td>
              <td class='col-md-2'>
                <span class='label label-default'>
                  {{routine.frequency}}
                </span>
              </td>
              <td class='text-muted'>{{routine.notes}}</td>
            </template>
          </template>
          <template v-else>

            <td class='col-md-2'>
              <router-link :to='{name: "Routine", params: { id: routine.id } }'>
                {{ routine.name }}
              </router-link>
            </td>
            <td v-if=' ! isCatSelected' class='col-md-2'>
              <span class='label'
                    v-bind:class="[routine.color]"
                    @click='selectCategory(routine.category)'>
                {{ routine.category }}
              </span>
            </td>
            <td class='col-md-2'>{{routine.duration}}</td>
            <td class='col-md-2'>
              <span class='label label-default'>
                {{routine.frequency}}
              </span>
            </td>
            <td class='text-muted'>{{routine.notes}}</td>
          </template>
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
  created() {
    const resolution = resolve => {
      // console.log(JSON.stringify(resolve.data));
      this.routines = resolve.data
      const uniqueCategoriesFn = R.compose(R.uniq, R.pluck('category'))
      const uniqueCats = uniqueCategoriesFn(this.routines)
      const colors = cycle(uniqueCats.length, labeltypes)
      const colormap = R.zipObj(uniqueCats, colors)
      const sortByCat = R.sortBy(R.prop('category'))
      this.routines = sortByCat(this.routines)
      this.routines.map(r => {
        r.color = colormap[r.category]
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
