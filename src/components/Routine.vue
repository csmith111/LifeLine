<template>
  <div class='edit-routine'>
    <h2>
      Routine
    </h2>
      Routine: {{ routine.name }} <br/>
      Cateory: {{ routine.category }} <br/>
      Duration: {{ routine.duration }} <br/>
      Frequency: {{ routine.frequency }} <br/>
    </p>
    <hr/>
    <h4>
      Stats.
    </h4>
    <p>
      # of durations: {{durations.length}} <br/>
      # of frequencies: {{frequencies.length}} <br/>
    <p>
      <router-link class='label label-info' to='/routines'>Routines</router-link>
      &nbsp;
      <router-link class='label label-info' to='/'>Home</router-link>
    </p>
  </div>
</template>

<<script>
import axios from 'axios'

export default {
  name: 'Routine',
  created () {
    const resolveDurations = resolve => {
      this.durations = resolve.data
    }
    const resolveFreqs = resolve => {
      this.frequencies = resolve.data
    }
    const resolveRoutine = resolve => {
      this.routine = resolve.data
    }
    axios.get('http://localhost:3000/durations')
      .then(resolveDurations)
      .catch(error => {
        alert("Error fetching durations: " + error)
      })
    axios.get('http://localhost:3000/frequencies')
      .then(resolveFreqs)
      .catch(error => {
        alert("Error fetching frequencies: " + error)
      })
    this.currentRoutineId = this.$route.params.id
    axios.get('http://localhost:3000/routines/' + this.currentRoutineId)
      .then(resolveRoutine)
      .catch(error => {
        alert("Error fetching routine #: " + this.currentRoutineId)
      })
  },
  data() {
    return {
      routine: {},
      durations: [],
      frequencies: [],
      currentRoutineId: 0,
    }
  }
}
</script>

