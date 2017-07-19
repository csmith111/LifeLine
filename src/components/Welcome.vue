<template>
  <div class="welcome">
    <h2>
      LifeLine
    </h2>
    <div class="well well-lg">
      <h4 class="text-center">
        Welcome to LifeLine
      </h4>
      <br/>
      <p class="text-center">
        We will track your Routines, Tasks &amp; Plans with which we hope you will have better insight into your life.
      </p>
      <br/>
      <router-link to='/routines' class='label label-info'>Routines</router-link>
      &nbsp; &nbsp;
      <router-link to='/plans' class='label label-info'>Plans</router-link>
      &nbsp; &nbsp;
      <router-link to='/tasks' class='label label-info'>Tasks</router-link>
    </div>
  </div>
</template>
