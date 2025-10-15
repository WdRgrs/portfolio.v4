<template>
  <div class="resume-section">
    Curriculum vitae
    <button class="btn btn-accent btn-glow" @click="handlePreview">Preview</button>
    
    <div v-if="showPreview" class="resume-modal" @click.self="closePreview">
      <div class="resume-modal__container">
        <button class="resume-modal__close" @click="closePreview">×</button>
        
        <!-- Mobile: Show images -->
        <div v-if="isMobile" class="resume-modal__images">
          <img 
            v-for="page in pageCount" 
            :key="page"
            :src="`/resume/WadeRogers${page}.jpg`" 
            :alt="`Resume page ${page}`"
            loading="lazy"
            @contextmenu.prevent
          />
          <a 
            href="/resume/WadeRogers.pdf" 
            download 
            class="resume-modal__download-link"
          >
            Download PDF Version
          </a>
        </div>
        
        <!-- Desktop: Show PDF -->
        <iframe 
          v-else
          :src="pdfSrc" 
          class="resume-modal__iframe"
        ></iframe>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useScrollLock } from '@/composables/useScrollLock'

const showPreview = ref(false)
const isMobile = ref(false)
const pageCount = 2


const pdfSrc = computed(() => {
  const params = new URLSearchParams({
    'navpanes': '0',
    'view': 'FitH',
  })
  return `/resume/WadeRogers.pdf#${params.toString()}`
})

onMounted(() => {
  isMobile.value = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  ) || window.innerWidth < 768
})

const handlePreview = () => {
  showPreview.value = !showPreview.value
}

const closePreview = () => {
  showPreview.value = false
}

useScrollLock(showPreview)
</script>

<style scoped lang="scss">
.resume-section{
  color: var(--color-olive);
  font-family: var(--font-poppins);

  & .btn {
    font-family: var(--font-poppins);
    font-weight: var(--font-semibold);
    padding: var(--space-1) var(--space-2);
    margin-left: var(--space-2);
    background: linear-gradient(
      0.33turn,
      var(--color-primary) 0% 30%,
      var(--color-info) 50%,
      var(--color-accent) 70% 100%
    );
  }
}
.resume-modal {
  position: fixed;
  inset: 0;
  background: var(--color-overlay);
  display: grid;
  place-items: center;
  z-index: var(--z-modal);
  padding: var(--space-5);
  overflow-y: auto;
  
  @include mobile {
    padding: 0;
  }
  
  &__container {
    position: relative;
    width: 100%;
    max-width: 900px;
    height: 90vh;
    background: var(--color-surface-1);
    border-radius: var(--radius-lg);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    
    @include mobile {
      max-width: 100%;
      height: 100vh;
      border-radius: 0;
    }
  }
  
  &__close {
    position: absolute;
    top: var(--space-3);
    right: var(--space-3);
    z-index: calc(var(--z-modal) + 1);
    background: var(--color-surface-2);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    width: var(--space-7);
    height: var(--space-7);
    font-size: var(--text-2xl);
    color: var(--color-text);
    cursor: pointer;
    display: grid;
    place-items: center;
    transition: all 0.2s ease;
    
    &:hover {
      background: var(--color-surface-3);
    }

    @include mobile {
      right: var(--space-5);
      width: var(--space-8);
      height: var(--space-8);
    }
  }
  
  &__images {
    flex: 1;
    overflow-y: auto;
    padding: var(--space-6) var(--space-4);
    padding-top: calc(var(--space-6) + 40px); // Space for close button
    
    @include mobile {
      padding: var(--space-6) var(--space-3);
      padding-top: calc(var(--space-6) + 40px);
    }
    
    img {
      width: 100%;
      height: auto;
      display: block;
      margin-bottom: var(--space-4);
      border-radius: var(--radius-sm);
      box-shadow: 0 2px 8px var(--color-shadow);
      
      &:last-of-type {
        margin-bottom: var(--space-6);
      }
    }
  }
  
  &__download-link {
    display: block;
    padding: var(--space-4);
    text-align: center;
    background: var(--color-surface-2);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    color: var(--color-primary);
    text-decoration: none;
    font-family: var(--font-ui);
    font-weight: var(--font-medium);
    transition: all 0.2s ease;
    
    &:hover {
      background: var(--color-surface-3);
    }
  }
  
  &__iframe {
    width: 100%;
    height: 100%;
    border: none;
  }
}
</style>