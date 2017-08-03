<template>
  <div class="routines">
    <h2>
      Routines <small> &mdash; These activities form your day-to-day life.</small>
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
        <tr>
          <th @click='setSortCol("name")' title='Click to sort by column'>
            Name &nbsp;
            <span>
              <span class='text-muted glyphicon glyphicon-sort' aria-hidden="true"></span>
            </span></th>
          <th @click='setSortCol("category")' v-if='!isCatSelected' title='Click header to sort by this column'>
            Category &nbsp;
            <span>
              <span class='text-muted glyphicon glyphicon-sort' aria-hidden="true"></span>
            </span>
          <th @click='setSortCol("duration")' v-if='!isDurSelected' title='Click header to sort by this column'>
            Duration &nbsp;
            <span>
              <span class='text-muted glyphicon glyphicon-sort' aria-hidden="true"></span>
            </span></th>
          <th @click='setSortCol("frequency")' v-if='!isFreqSelected' title='Click header to sort by this column'>
            Frequency &nbsp;
            <span>
              <span class='text-muted glyphicon glyphicon-sort' aria-hidden="true"></span>
            </span></th>
          <th>Notes</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for='routine in filterRoutines' :key="routine.guid">
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
          <td><em>{{routine.notes}}</em></td>
          <td>
            <span class='text-muted glyphicon glyphicon-edit' @click='setRoutineInEditMode(routine.id)'></span>
            &nbsp; &nbsp;
            <span class='text-muted glyphicon glyphicon-ban-circle' @click='deleteRoutine(routine.id)'></span>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-if='inShowRoutineEditor'>
      <form class="form-inline" style="margin-bottom: 0.5em">
        <div class="form-group">
          <input type="text" class="form-control" id="fld-routine" v-model='nroutine' placeholder="Routine">
        </div>
        <div class="form-group">
          <select class="form-control" v-model="ncat">
            <option v-for='cat in ccategories' :key='cat'>{{cat}}</option>
          </select>
        </div>
        <div class="form-group">
          <select class="form-control" v-model='ndur'>
            <option v-for='dur in cdurations' :key='dur'>{{dur}}</option>
          </select>
        </div>
        <div class="form-group">
          <select class="form-control" v-model="nfreq">
            <option v-for='freq in cfrequencies' :key='freq'>{{freq}}</option>
          </select>
        </div>
        <div class="form-group">
          <input type="text" class="form-control" v-model='nnote' placeholder="Notes">
        </div>
        &nbsp; &nbsp;
        <button type="submit" class="btn btn-info" @click='saveRoutine()'> OK </button> &nbsp; &nbsp;
        <button class="btn btn-warning" @click='toggleRoutineEditor()'> Close </button>
      </form>
    </div>
    <div v-if='inNewCat'>
      <form class="form-inline" style="margin-bottom: 0.5em">
        <div class="form-group">
          <input type="text" class="form-control" id="fld-category" v-model='ncategory' placeholder="Category">
        </div>
        &nbsp; &nbsp;
        <button type="submit" class="btn btn-info" @click='saveCategory()'> OK </button> &nbsp; &nbsp;
        <button class="btn btn-warning" @click='toggleCategoryEditor()'> Close </button>
      </form>
    </div>
    <p>
      <router-link to='/' class='btn btn-sm btn-primary'>Home</router-link> &nbsp; &nbsp;
      <span v-if='isCatSelected || isDurSelected || isFreqSelected'
            class='btn btn-sm btn-info'
            @click='resetSelection()'>
        Show All
      </span>  &nbsp; &nbsp;
      <span v-if='!inShowRoutineEditor' class='btn btn-sm btn-default' @click='setRoutineInNewMode()'>
        New Routine
      </span>  &nbsp; &nbsp;
      <span v-if='!inNewCat' class='btn btn-sm btn-default' @click='toggleCategoryEditor()'>
        New Category
      </span>
    </p>
  </div>
</template>

<script>

import cycle from '../utils'
import R from 'ramda'
import axios from 'axios'
import miniToastr from 'mini-toastr'

const labeltypes = ['label-info', 'label-primary', 'label-success',
                    'label-danger', 'label-warning', 'label-default']

const sortsFns = {
  name: R.sortBy(R.prop('name')),
  category: R.sortBy(R.prop('category')),
  duration: R.sortBy(R.prop('duration')),
  frequency: R.sortBy(R.prop('frequency')),
}

const RoutineVue = {
  name: 'routines',
  data() {
    return {
      routines: [],               // The View shows these routines.
      ccategories: [],            // Computed categories.
      cdurations: [],             // Also computed.
      cfrequencies: [],           // Ditto.
      routineId: '',
      nroutine: '',               // Values captured in UI.
      ncategory: '',
      ncat: '',
      ndur: '',
      nfreq: '',
      nnote: '',
      catSelected: '',            // Used in filtering routines for this selection.
      durSelected: '',
      freqSelected: '',
      isCatSelected: false,       // Indicates the current applicable filter.
      isDurSelected: false,
      isFreqSelected: false,
      inShowRoutineEditor: false,        // Edit status
      inNewCat: false,
      mode: 'new',
    }
  },
  methods: {
    toggleRoutineEditor: function(routineId) {
      this.inShowRoutineEditor = !this.inShowRoutineEditor
      if (this.inShowRoutineEditor) {
        if (this.mode === 'new') {
          this.ncat = this.ccategories.length > 0 ? this.ccategories[0] : ''
          this.nfreq = this.cfrequencies.length > 0 ? this.cfrequencies[0] : ''
          this.ndur = this.cdurations.length > 0 ? this.cdurations[0] : ''
          this.nnote = ''
        } else {
          const indexToEdit = this.routines.findIndex(r => r.id === routineId)
          if (indexToEdit >= 0) {
            const rec = this.routines[indexToEdit]
            // Set up the editor values.
            this.routineId = routineId
            this.nroutine = rec.name
            this.ncat = rec.category
            this.nfreq = rec.frequency
            this.ndur = rec.duration
            this.nnote = rec.notes
          }
        }
      }
    },
    toggleCategoryEditor: function() {
      this.inNewCat = !this.inNewCat
      setTimeout(() => { // Give it half a second for the editor to show up.
        document.querySelector('#fld-category').focus()
      }, 250)
    },
    deleteRoutine(routineId) {
      if (confirm('Are you sure you wish to delete this routine?')) {
        axios.delete(`http://localhost:3000/routines/${routineId}`)
          .then(() => {
            miniToastr.success('Routine deleted.')
            this.fetchRoutines()
          })
          .catch(error => {
            alert("Error posting routine: " + error)
          })
      }
    },
    setRoutineInNewMode() {
      this.mode = 'new'
      this.toggleRoutineEditor()
      setTimeout(() => { // Give it half a second for the editor to show up.
        document.querySelector('#fld-routine').focus()
      }, 250)
    },
    setRoutineInEditMode(routineId) {
      this.mode = 'edit'
      this.inShowRoutineEditor = false; // ! Important !.
      this.toggleRoutineEditor(routineId)
      setTimeout(() => { // Give it half a second for the editor to show up.
        document.querySelector('#fld-routine').focus()
      }, 250)
    },
    saveRoutine: function() {
      const lc = this.nroutine.trim()
      if (lc === '') {
        miniToastr.error('Routine should be defined')
        document.querySelector('#fld-routine').focus()
        return
      }
      let foundIndex = this.routines.findIndex((r) => r.name.toLowerCase() === lc)
      if (((this.mode === 'new') && (foundIndex >= 0))
          ||
          ((this.mode === 'edit') && (foundIndex >= 0) && this.routines[foundIndex].id !== this.routineId)) {
        miniToastr.error('This routine is already defined.')
        document.querySelector('#fld-routine').focus()
        return
      }
      const newroutine = {
        name: this.nroutine,
        category: this.ncat,
        frequency: this.nfreq,
        duration: this.ndur,
        notes: this.nnote,
        id: guid(),
      }
      if (this.mode === 'new') {
        axios.post('http://localhost:3000/routines', newroutine)
          .then(() => {
            this.nnote = this.nroutine = ''
            miniToastr.success('Routine saved.')
            this.fetchRoutines()
          })
          .catch(error => {
            alert("Error posting routine: " + error)
          })
      } else {
        axios.put(`http://localhost:3000/routines/${this.routineId}`, newroutine)
          .then(() => {
            this.nnote = this.nroutine = ''
            miniToastr.success('Routine updated.')
            this.fetchRoutines()
            this.inShowRoutineEditor = true
            this.toggleRoutineEditor()
          })
          .catch(error => {
            alert("Error editing routine: " + error)
          })

      }
    },
    saveCategory: function() {
      const lc = this.ncategory.trim()
      if (this.ccategories.findIndex((cat) => cat.toLowerCase() === lc) >= 0) {
        miniToastr.error('This category is already defined.')
        document.querySelector('#fld-category').focus()
      } else {
        this.ccategories.push(this.ncategory)
        miniToastr.success('Category added successfully.')
        this.ncategory = ''
      }
    },
    selectCategory: function (category) {
      if (this.isDurSelected || this.isFreqSelected) {
        return
      }
      this.isCatSelected = !this.isCatSelected
      this.catSelected = this.isCatSelected ? category : ''
    },
    selectDuration: function (duration) {
      if (this.isCatSelected || this.isFreqSelected) {
        return
      }
      this.isDurSelected = !this.isDurSelected
      this.durSelected = this.isDurSelected ? duration : ''
    },
    selectFrequency: function (freq) {
      if (this.isCatSelected || this.isDurSelected) {
        return
      }
      this.isFreqSelected = !this.isFreqSelected
      this.freqSelected = this.isFreqSelected ? freq : ''
    },
    resetSelection() {
      if (this.isCatSelected) {
        this.isCatSelected = false
        this.catSelected = ''
      } else if (this.isDurSelected) {
        this.isDurSelected = false
        this.durSelected = ''
      } else if (this.isFreqSelected) {
        this.isFreqSelected = false
        this.freqSelected = ''
      }
    },
    setSortCol: function(col) {
      this.routines = sortsFns[col](this.routines)
    },
    fetchRoutines() {
      const resolveRoutines = (resolve) => {
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
        this.ccategories = uniqueCats
        // this.cdurations = uniqueDurations
        // this.cfrequencies = uniqueFreqs
      }
      axios.get('http://localhost:3000/frequencies')
        .then(resolve => this.cfrequencies = resolve.data)
        .catch(error => {
          alert("Error fetching routines: " + error)
        })
      axios.get('http://localhost:3000/durations')
        .then(resolve => this.cdurations = resolve.data)
        .catch(error => {
          alert("Error fetching durations: " + error)
        })
      axios.get('http://localhost:3000/routines')
        .then(resolveRoutines)
        .catch(error => {
          alert("Error fetching routines: " + error)
        })
    }
  },
  computed: {
    filterRoutines() {
      if (this.isCatSelected) {
        return this.routines.filter(r => {
          return this.catSelected === r.category
        })
      } if (this.isDurSelected) {
        return this.routines.filter(r => {
          return this.durSelected === r.duration
        })
      } if (this.isFreqSelected) {
        return this.routines.filter(r => {
          return this.freqSelected === r.frequency
        })
      } else {
        return this.routines
      }
    },
  },
  created() {
    this.fetchRoutines()
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
        var p = (Math.random().toString(16)+"000000000").substr(2, 8)
        return s ? "-" + p.substr(0, 4) + "-" + p.substr(4, 4) : p
    }
    return _p8() + _p8(true) + _p8(true) + _p8()
}

export default RoutineVue

</script>
