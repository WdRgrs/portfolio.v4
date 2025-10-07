import { createRouter, createWebHistory } from 'vue-router'
import { LINKS } from '@/constants'
import Landing from '@/views/Landing.vue'
import Software from '@/views/Software.vue'
import Welding from '@/views/Welding.vue'
import Photography from '@/views/Photography.vue'
import Resume from '@/views/Resume.vue'
import DevLog from '@/views/DevLog.vue'
import NotFound from '@/views/NotFound.vue'

const { 
  LANDING,
  SOFTWARE,
  WELDING,
  PHOTOGRAPHY,
  DEV_LOG,
  RESUME
} = LINKS.SITE

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { 
      path: LANDING, 
      name: 'landing',
      component: Landing,
      meta: {
        title: 'Wade Rogers',
        description: 'Full-stack developer with 3+ years experience. View my software engineering portfolio, welding projects, and photography.'
      }
    },
    { 
      path: SOFTWARE, 
      component: Software,
      name: 'software',
      meta: {
        title: 'WR | Software',
        description: 'Full-stack software development portfolio featuring Vue.js, TypeScript, and real-time applications.'
      }
    },
    { 
      path: WELDING, 
      component: Welding,
      name: 'welding',
      meta: {
        title: 'WR | Welding',
        description: 'Welding stories and project highlights.'
      } 
    },
    { 
      path: PHOTOGRAPHY, 
      name: 'photography',
      component: Photography,
      meta: {
        title: 'WR | Photography',
        description: 'Photography portfolio and visual storytelling.'
      } 
    },
    { 
      path: DEV_LOG, 
      component: DevLog,
      name: 'dev-log',
      meta: {
        title: 'WR | Photography',
        description: 'Photography portfolio and visual storytelling.'
      } 
    },
    { 
      path: RESUME, 
      component: Resume 
    },
    { 
      path: '/:pathMatch(.*)*', 
      name: 'not-found',
      component: NotFound,
      meta: {
        title: 'WR | Page Not Found'
      }
    }
  ],
  scrollBehavior (to, from, savedPosition) {
    return { top: 0 }
  }
})

router.beforeEach((to) => {
  if (to.meta?.title) {
    document.title = to.meta.title as string
  }
  
  if (to.meta?.description) {
    const metaDesc = document.querySelector('meta[name="description"]')
    if (metaDesc) {
      metaDesc.setAttribute('content', to.meta.description as string)
    }
  }
})

export default router
