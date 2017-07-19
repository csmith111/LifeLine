<template>
  <div class='edit-routine'>
    <h2>Routine</h2>
    <p>
      Routine: {{ routine.name }} <br/>
      Category: {{ routine.category }} <br/>
      Duration: {{ routine.duration }} <br/>
      Frequency: {{ routine.frequency }} <br/>
    </p>
    <hr/>
    <h4>Stats</h4>
    <p>
      # of durations: {{durations.length}} <br/>
      # of frequencies: {{frequencies.length}} <br/>
    </p>
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
    this.currentRoutineId = this.$route.params.id
    const getDurations = () => {
      return axios.get('http://localhost:3000/durations')
    }
    const getFrequencies = () => {
      return axios.get('http://localhost:3000/frequencies')
    }
    const getRoutine = () => {
      return axios.get('http://localhost:3000/routines/' + this.currentRoutineId)
      }
    axios
      .all([getDurations(), getFrequencies(), getRoutine()])
      .then(axios.spread((durations, frequencies, routine) => {
        this.routine = routine.data
        this.durations = durations.data
        this.frequencies = frequencies.data
      }))
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

