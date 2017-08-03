<template>
  <div class="container">
    <div class="row">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import miniToastr from 'mini-toastr'

miniToastr.init()

export default {
  name: 'app',
};
</script>
