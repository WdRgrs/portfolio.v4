<template>
  <DevLogEntry
    :title="config.title"
    :date="config.date"
    :types="config.types"
    :tags="config.tags"
    :read-time="config.readTime"
    :logo="config.logo"
    :default-expanded="config.defaultExpanded"
    :stats="githubStats"
  >
    <!-- Lead with the result -->
    <DevLogSection :no-divider="true">
      <p>
        Alphabits is a cross-platform word-puzzle game built in Rust. It runs natively on Windows and 
        macOS, and compiles to WebAssembly for browser play. You drop letters into a grid, 
        form words horizontally or vertically, and score points before time runs out.
      </p>
      
      <!-- Demo Video -->
      <div class="devlog-media">
        <BaseVideo
          :asset="ALPHABITS_VIDEOS[0]"
          :controls="false"
          autoplay
          muted
          loop
        />
      </div>

      <p>
        <a :href="LINKS.PROJECTS.ALPHABITS" target="_blank" rel="noopener">
          Play it on Itch.io →
        </a>
      </p>
    </DevLogSection>

    <!-- Why Rust -->
    <DevLogSection heading="Why Rust">
      <p>
        I wanted a break from web stacks and something that compiled to native binaries. 
        I started reading <em>The Rust Book</em> in April and kept going until a toy turned into a game. 
        Rust's compiler is strict, but the trade-off is fewer runtime surprises. Once ownership and 
        borrowing clicked, the language started working with me instead of against me.
      </p>
    </DevLogSection>

    <!-- Game Design -->
    <DevLogSection heading="Game Design">
      <div class="devlog-feature">
        <BaseImage
          :asset="ALPHABITS_IMAGES[0]"
          class="devlog-feature__image"
        />
        <div class="devlog-feature__text">
          <p>
            The core mechanic: letters drop into a grid one at a time. You place them to form words 
            reading left-to-right or top-to-bottom. Longer words score more points. A timer adds pressure.
          </p>
          <p>
            I used a Lospec-inspired pastel palette to keep the vibe friendly, not aggressive. 
            The audio clips are short 8-bit loops I made in <a href="https://beepbox.co" target="_blank" rel="noopener">BeepBox</a>.  This is a really fun tool, even for somebody like me that can't carry a tune in a bucket.
          </p>
        </div>
      </div>

      <div class="devlog-gallery">
        <BaseImage
          v-for="image in [ALPHABITS_IMAGES[1], ALPHABITS_IMAGES[3]]"
          :key="image.id"
          :asset="image"
          class="devlog-gallery__item"
        />
      </div>
    </DevLogSection>

    <!-- Technical Implementation -->
    <DevLogSection heading="How It Works">
      <ul>
        <li>
          <strong>Scene system</strong> - Menu, gameplay, pause, and game over states with transition logic
        </li>
        <li>
          <strong>Board state</strong> - Grid cells track letters, colors, and word membership. 
          Active piece moves and settles on a timer
        </li>
        <li>
          <strong>Word detection</strong> - Horizontal and vertical scans with sliding window validation 
          against a dictionary. Words update in real-time as letters are placed
        </li>
        <li>
          <strong>Letter generation</strong> - Weighted-random distribution based on English letter frequency. 
          Queued system ensures variety without flooding the board with vowels or rare letters
        </li>
        <li>
          <strong>Difficulty modes</strong> - Three tiers with different grid sizes, timers, and minimum word lengths:
          <ul>
            <li><strong>Easy</strong> - 9×9 grid, no timer, 2+ letter words</li>
            <li><strong>Medium</strong> - 11×11 grid, relaxed timer, 3+ letter words</li>
            <li><strong>Hardcade</strong> - 13×15 grid, strict timer, 4+ letter words (abilities system in progress)</li>
          </ul>
        </li>
      </ul>
    </DevLogSection>

    <!-- Challenges -->
    <DevLogSection heading="Challenges">
      <p>
        Distribution was the surprising boss fight (and lifetimes, but we aren't getting into that one today). Itch.io did not like nested asset folders, so I 
        flattened audio and other resources at the root. Getting Windows and Mac builds prepped on 
        different machines added friction. The WASM bundle came out to roughly 3 MB after optimization, 
        which is acceptable for a web game but felt heavy compared to native builds.
      </p>
      <p>
        The compiler kept me honest. The borrow checker forced me to think about data ownership upfront 
        instead of patching leaks later. Asset pipelines kept me humble. What seemed like a simple 
        "copy these files" turned into platform-specific quirks and path resolution headaches.
      </p>
    </DevLogSection>

    <!-- What I Learned -->
    <DevLogSection heading="What I Learned">
      <p>
        Ownership and borrowing finally made sense once I moved real data around in a game loop. 
        I got a better feel for stack vs heap allocation, leaned on pattern matching for state machines, 
        and appreciated how strict types catch bugs at compile time. Rust rewarded me for being explicit, 
        which made the game logic clearer.
      </p>
      <p>
        The fastest path to understanding a language is building something that refuses to compile until you do.
      </p>
    </DevLogSection>

    <!-- Tech Stack -->
    <DevLogSection heading="Tech Stack">
      <ul>
        <li>
          <strong>Language</strong> - Rust (stable)
        </li>
        <li>
          <strong>Engine</strong> - <a href="https://macroquad.rs" target="_blank" rel="noopener">Macroquad</a> 
          (lightweight 2D game framework)
        </li>
        <li>
          <strong>Targets</strong> - Native (Windows, macOS) + WebAssembly (Itch.io)
        </li>
        <li>
          <strong>Tools</strong> - BeepBox (audio), Lospec, Google Fonts, wasm-bindgen (web builds)
        </li>
      </ul>
    </DevLogSection>

    <!-- Next Steps -->
    <DevLogSection heading="Next Steps">
      <p>
        Short-term: finish the abilities system for Hardcade mode. 
        Mid-term: explore Rust for native apps where performance matters. For the next game, 
        I'll try a different language and engine to avoid getting too comfortable. 
        Long-term: dig into systems programming and performance-critical projects. 
        A Steam release is still on the bucket list.
      </p>
    </DevLogSection>

    <!-- Footer Links -->
    <template #footer>
      <button class="devlog-btn devlog-btn--primary" @click="openLink(LINKS.PROJECTS.ALPHABITS)">
        <span>🎮</span>
        <span>Play on Itch.io</span>
      </button>
      <!-- <button class="devlog-btn devlog-btn--secondary" @click="requestSource">
        <span>💾</span>
        <span>View Source (Available on Request)</span>
      </button> -->
    </template>
  </DevLogEntry>
</template>

<script setup lang="ts">
// import { computed } from 'vue'
// import { useGitHubStore } from '@/stores/github'
import DevLogEntry from '@/components/devlog/Entry.vue'
import DevLogSection from '@/components/devlog/Section.vue'
import BaseImage from '@/components/media/BaseImage.vue'
import BaseVideo from '@/components/media/BaseVideo.vue'
import { ALPHABITS_IMAGES, ALPHABITS_VIDEOS } from '@/assets/software'
import { LINKS } from '@/constants'
import type { DevLogEntryConfig } from '@/types/devlog'

const props = defineProps<{ config: DevLogEntryConfig }>()

// const githubStore = useGitHubStore()

// Swap in github stats if this repo becomes public (currently private)
const githubStats = undefined
// const githubStats = computed(() =>
//   props.config.repoId ? githubStore.getRepoStats(props.config.repoId) : undefined
// )

// TODO - this is a util
function openLink(url: string) {
  window.open(url, '_blank', 'noopener,noreferrer')
}
</script>

<style scoped lang="scss">
.devlog-media {
  margin: var(--space-6) 0;
}

.devlog-feature {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-6);
  align-items: start;
  margin: var(--space-6) 0;
  padding: var(--space-5);
  background: var(--color-surface-1);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);

  @include mobile {
    grid-template-columns: 1fr;
  }

  &__image {
    position: sticky;
    top: var(--space-4);
  }

  &__text {
    p {
      margin-bottom: var(--space-3);

      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}

.devlog-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--space-4);
  margin: var(--space-6) 0;

  @include mobile {
    grid-template-columns: 1fr;
  }

  &__item {
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px var(--color-shadow);
    }
  }
}

.devlog-links {
  display: flex;
  gap: var(--space-3);
  margin-top: var(--space-8);
  padding-top: var(--space-6);
  border-top: 1px solid var(--color-divider);

  @include mobile {
    flex-direction: column;
  }
}
.devlog-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-5);
  border-radius: var(--radius-md);
  font-family: var(--font-ui);
  font-weight: var(--font-medium);
  font-size: var(--text-base);
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;

  span:first-child {
    font-size: var(--text-lg);
  }

  &--primary {
    background: var(--color-primary);
    color: var(--color-text-inverse);

    &:hover {
      background: var(--color-secondary);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px var(--color-shadow);
    }

    &:active {
      transform: translateY(0);
    }
  }

  &--secondary {
    background: transparent;
    color: var(--color-text);
    border-color: var(--color-border);

    &:hover {
      background: var(--color-surface-1);
      border-color: var(--color-primary);
      color: var(--color-primary);
    }

    &:active {
      background: var(--color-surface-2);
    }
  }
}
.devlog-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-3) var(--space-5);
  border-radius: var(--radius-md);
  font-family: var(--font-ui);
  font-weight: var(--font-medium);
  text-decoration: none;
  transition: all 0.2s ease;

  &--primary {
    background: var(--color-primary);
    color: var(--color-text-inverse);
    border: 1px solid transparent;

    &:hover {
      background: var(--color-secondary);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px var(--color-shadow);
    }
  }

  &--secondary {
    background: transparent;
    color: var(--color-text);
    border: 1px solid var(--color-border);

    &:hover {
      background: var(--color-surface-1);
      border-color: var(--color-primary);
      color: var(--color-primary);
    }
  }
}
</style>