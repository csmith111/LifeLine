<template>
  <div class="welcome">
    <h2>
      <!-- LifeLine -->
      <br>
      &nbsp;
      <br>
      &nbsp;
    </h2>
    <div class="jumbotron text-center">
      <h3>
        LifeLine
      </h3>
      <br/>
      <p>
            Track your <abbr title='Day-to-day activities' class='initialism'>Routines</abbr>,
            <abbr title='Visions of the Future with some deadlines'>Plans</abbr> &amp;
            <abbr title='Short-term activity plans with deadlines'>Tasks</abbr>, <br/>
            for Insights into your Life &amp; Times.
        <br/>
        <br/>
      <p>
      <p>
        <router-link to='/routines' class='btn btn-sm btn-primary'>Routines</router-link>
        &nbsp; &nbsp;
        <router-link to='/plans' class='btn btn-sm btn-danger'>Plans</router-link>
        &nbsp; &nbsp;
        <router-link to='/tasks' class='btn btn-sm btn-warning'>Tasks</router-link>
      </p>
    </div>
  </div>
</template>

<style scoped>
  abbr {

  }
</style>
