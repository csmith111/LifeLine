<template>
  <div class="routines">
    <h2>
      Routines
    </h2>
    <div class="panel panel-default">
      <div class="panel-body">
        <h4 v-if='catSelected'>
          <span class='text-capitalize text-info' @click='resetSelection()'>
            {{catSelectedValue}}
          </span>
        </h4>
        <table class='table table-hover table-condensed table-striped'>
          <tbody>
          <tr v-for='routine in routines' v-bind:key="routine.id">
            <template v-if='catSelected'>
              <template v-if='catSelectedValue == routine.category'>
                <td class='col-md-2'>{{ routine.name }}</td>
                <td class='col-md-1' v-if=' ! catSelected'>
                  <span class='label'
                        v-bind:class="[routine.color]"
                        @click='selectCategory(routine.category)'>
                    {{ routine.category }}
                  </span></td>
                <td class='text-muted'>{{routine.notes}}</td>
              </template>
            </template>
            <template v-else>
              <td class='col-md-2'>{{routine.name}}</td>
              <td class='col-md-1' v-if=' ! catSelected'>
                <span class='label'
                      v-bind:class="[routine.color]"
                      @click='selectCategory(routine.category)'>
                  {{ routine.category }}
                </span></td>
              <td class='text-muted'>{{routine.notes}}</td>
            </template>
          </tr>
        </tbody>
        </table>
        <p>
        <router-link to='/' class='label label-primary'>Home</router-link> &nbsp; &nbsp;
        <span v-if='catSelected' class='label label-info' @click='resetSelection()'>
          Show All Categories
        </span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>

import cycle from '../utils'
import R from 'ramda'

const routines = [
    { id: 1, name: "Yoga", category: 'fitness', notes: 'Perform asanas' },
    { id: 2, name: "Meditation", category: 'well-being', notes: 'Focus on the Breath' },
    { id: 3, name: "Workout", category: 'fitness', notes: 'Gym' },
    { id: 4, name: "Commute", category: 'work' },
    { id: 5, name: "TV", category: 'entertainment', notes: 'Mostly Netflix' },
    { id: 6, name: "Read", category: 'self-improvement' },
    { id: 7, name: "Reverie", category: 'life-process' },
    { id: 8, name: "Sleep", category: 'life-process' },
    { id: 9, name: "Cook", category: 'life-process' },
    { id:10, name: "Clean", category: 'life-process', notes: 'Handle entropy'  },
    { id:11, name: "Shop", category: 'life-process', notes: 'Supplies' },
    { id:12, name: "Read to Kids", category: 'family' },
    { id:13, name: "Journal", category: 'well-being' },
    { id:13, name: "Listen to Music", category: 'entertainment' },
    { id:13, name: "Play Music", category: 'well-being' },
    { id:14, name: "Work", category: 'work', notes: 'Source of income' },
    { id:15, name: "Kriya", category: 'fitness', notes: 'Exercise' },
    { id:16, name: "Hacking", category: 'self-improvement', notes: 'Mental calisthenics' },
    { id:17, name: "Eating-out", category: 'entertainment', notes: 'Meet up with the guys over beer' },
    { id:18, name: "Outing", category: 'family', notes: 'Hang out with the family' },
  ]

const labeltypes = ['label-info', 'label-primary', 'label-success',
                    'label-danger', 'label-warning', 'label-default']

export default {
  name: 'routine',

  data() {
    return {
      routines,
      catSelected: false,
      catSelectedValue: '',
    }
  },
  methods: {
    selectCategory: function (category) {
      this.$data.catSelected = !this.$data.catSelected
      this.$data.catSelectedValue = this.$data.catSelected ? category : ''
    },
    resetSelection() {
      this.$data.catSelected = false
      this.$data.catSelectedValue = ''
    }
  },
  created() {
    const uniqueCategoriesFn = R.compose(R.uniq, R.pluck('category'))
    const uniqueCats = uniqueCategoriesFn(routines)
    const colors = cycle(uniqueCats.length, labeltypes)
    const colormap = R.zipObj(uniqueCats, colors)
    routines.map( r => {
      r.color = colormap[r.category]
    })
  }
}
</script>
