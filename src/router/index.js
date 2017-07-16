import Vue from 'vue';
import Router from 'vue-router';
import Welcome from '@/components/Welcome';
import Routines from '@/components/Routines';
import Plans from '@/components/Plans';
import Tasks from '@/components/Tasks';

Vue.use(Router);

export default new Router({
  routes: [
    { path: '/', name: 'Welcome', component: Welcome },
    { path: '/routines', name: 'Routines', component: Routines },
    { path: '/plans', name: 'Plans', component: Plans },
    { path: '/tasks', name: 'Tasks', component: Tasks },
  ],
});
