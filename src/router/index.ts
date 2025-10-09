import { createRouter, createWebHistory } from 'vue-router'
import { LINKS } from '@/constants'
import Landing from '@/views/Landing.vue'
import Software from '@/views/Software.vue'
import Welding from '@/views/Welding.vue'
import Photography from '@/views/Photography.vue'
import Resume from '@/views/Resume.vue'
import NotFound from '@/views/NotFound.vue'

const { 
  LANDING,
  SOFTWARE,
  WELDING,
  PHOTOGRAPHY,
} = LINKS.SITE

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { 
      path: LANDING, 
      name: 'landing',
      component: Landing,
      meta: {
        title: '𝙒𝙖𝙙𝙚 𝙍𝙤𝙜𝙚𝙧𝙨',
        description: 'Full-stack developer with 3+ years experience. View my software engineering portfolio, welding projects, and photography.'
      }
    },
    { 
      path: SOFTWARE, 
      component: Software,
      name: 'software',
      meta: {
        // title: '𝗦𝗼𝗳𝘁𝘄𝗮𝗿𝗲',
        title: '𝑺𝒐𝒇𝒕𝒘𝒂𝒓𝒆',
        description: 'Full-stack software development portfolio featuring Vue.js, TypeScript, and real-time applications.'
      }
    },
    { 
      path: WELDING, 
      component: Welding,
      name: 'welding',
      meta: {
        title: '𝑾𝒆𝒍𝒅𝒊𝒏𝒈',
        description: 'Welding stories and project highlights.'
      } 
    },
    { 
      path: PHOTOGRAPHY, 
      name: 'photography',
      component: Photography,
      meta: {
        title: '𝑷𝒉𝒐𝒕𝒐𝒈𝒓𝒂𝒑𝒉𝒚',
        description: 'Photography portfolio and visual storytelling.'
      } 
    },
    { 
      path: '/:pathMatch(.*)*', 
      name: 'not-found',
      component: NotFound,
      meta: {
        title: 'Page Not Found'
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
