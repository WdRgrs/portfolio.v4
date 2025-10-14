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
    <DevLogSection :no-divider="true">
      <p>
        A Raspberry Pi 4 arrived as a Christmas gift without a roadmap attached, just an invitation to explore.
        After browsing through project ideas, I landed on <a href="https://pi-hole.net" target="_blank" rel="noopener noreferrer">Pi-hole</a>,
        a DNS sinkhole that blocks ads and trackers at the network level. It seemed like the right mix of practical 
        and educational: immediate benefits with hands-on exposure to DNS, DHCP, and how devices communicate 
        across a home network.
      </p>
    </DevLogSection>

    <DevLogSection heading="The Goal">
      <p>
        This wasn't necessarily about optimizing network performance or achieving perfect ad-blocking coverage, 
        although these are very welcome side-effects. Privacy is another concern addressed by a network sinkhole,
        especially in today's economy of personal data. The real goal was learning & exploration: understanding how 
        DNS requests flow, what role a DHCP server plays, and how blocking works at the infrastructure level. 
      </p>
    </DevLogSection>
    
    <DevLogSection heading="Implementation">
      <p>
        There are plenty of great walkthroughs across the wild web, so I won't rehash every step here. 
        <a 
          href="https://www.youtube.com/watch?v=cE21YjuaB6o" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          World's Greatest Pi-hole Tutorial
        </a> 
        is the guide that really piqued my interest into the subject. 
        Below is a quick overview of the steps I followed, from unboxing to a live, working network sinkhole:
      </p>
      
      <ul>
        <li>Flashed Raspberry Pi OS onto the included microSD card and completed the initial setup</li>
        <li>Connected Raspberry Pi & modem/router via ethernet</li>
        <li>Assigned the Pi a static IP through the router for reliable access</li>
        <li>Configured SSH from my laptop (router and daily driver are on opposite sides of the house)</li>
        <li>Installed Pi-hole using the official guide and set 
          <a 
            href="https://developers.cloudflare.com/1.1.1.1/setup/" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            Cloudflare DNS
          </a> 
          as the upstream resolver
        </li>
        <li>Updated the router's DHCP settings so all devices used the Pi-hole for DNS</li>
        <li>Watched the admin dashboard light up with blocked requests in real time</li>
      </ul>
    </DevLogSection>

    <DevLogSection heading="Dashboard Overview">
      <div class="pihole__dashboard">
        <BaseImage :asset="PIHOLE_IMAGES[0]" expandable />
        
        <div class="pihole__dashboard-column">
          <p class="pihole__dashboard-text">
            The Pi-hole admin interface provides real-time visibility into network DNS traffic. The dashboard shows 
            query statistics, top blocked domains, and device-level breakdowns of network activity. 
          </p>
          <BaseImage :asset="PIHOLE_IMAGES[1]" expandable />
        </div>
      </div>
    </DevLogSection>
    
    <DevLogSection heading="Challenges">
      <p>
        The hardest part is resisting the urge to overload the blocklist manager with every list I come across.  
        It's not exactly that "less is more," but there's definitely a point where adding more lists stops helping. 
        Many overlap heavily, and each one adds extra processing during updates — without improving results much.
      </p>

      <p>
        <a 
          href="https://firebog.net/" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          The Big Blocklist Collection
        </a>
        is a great resource for discovering lists, with clear categories and recommendations. 
        There are countless options, each with their own philosophy and coverage focus. Too many can 
        break legitimate sites or slow down updates; too few let more noise through. 
      </p>

      <p>
        I've settled on a conservative setup: a handful of well-maintained lists that target the worst trackers 
        without causing false positives. When I feel like experimenting, it's easy to add or remove a few and 
        see what changes.
      </p>

      <p>
        One unfortunate but not totally unexpected discovery: our Roku, Netflix and various Samsung electronics generate constant DNS 
        traffic even when idle.. seriously, like every minute. What the heck? These devices and services consistently appear
        at the top of the blocked domains query tables.
      </p>
    </DevLogSection>
    
    <DevLogSection heading="Results & Metrics">
      <div class="pihole__stats">
        <div class="pihole__stat">
          <span class="pihole__stat-value">857k</span>
          <span class="pihole__stat-label">Blocked Queries / YTD</span>
        </div>
        <div class="pihole__stat">
          <span class="pihole__stat-value">2.42M</span>
          <span class="pihole__stat-label">Total Queries / YTD</span>
        </div>
        <div class="pihole__stat">
          <span class="pihole__stat-value">~35%</span>
          <span class="pihole__stat-label">Queries blocked / Daily</span>
        </div>
      </div>

      <p>
        The Pi-hole has been running continuously for months without intervention. Pages load noticeably faster 
        without ad network latency, and the reduced tracking feels like taking back a small measure of control 
        over network traffic.
      </p>
    </DevLogSection>

    <DevLogSection heading="What I Learned">
      <p>
        This project solidified foundational networking concepts: DNS resolution, DHCP server configuration, 
        and the relationship between IP addresses and domain names. I gained practical experience with Linux 
        system administration, remote access via SSH, and the satisfaction of running self-hosted infrastructure.
      </p>

      <p>
        Working through this project reinforced how much was learned as curiosity was driving the process. 
        Following a guide got the system running, but understanding why each step mattered required 
        digging deeper. Troubleshooting SSH access, choosing the right blocklists, and figuring out 
        DHCP configuration all forced me to understand the underlying networking concepts rather than 
        just executing commands.
      </p>
    </DevLogSection>

    <DevLogSection heading="Tech Stack">
      <ul>
        <li>Raspberry Pi 4 (4GB RAM) running Raspberry Pi OS Lite</li>
        <li>Pi-hole v6.x for DNS-level ad blocking</li>
        <li>Cloudflare DNS (1.1.1.1) as upstream resolver</li>
        <li>Static IP assignment via router DHCP reservation</li>
      </ul>
    </DevLogSection>
      
    <DevLogSection heading="Future Plans">
      <p>
        The Pi-hole setup has been solid, but I'm considering a migration to Docker for easier management and 
        portability. Running it in a container would make backups simpler and allow me to repurpose the Raspberry Pi 
        for other projects, possibly home automation or robotics experiments. One project always seems to seed 
        the next.
      </p>
    </DevLogSection>

    <DevLogSection heading="Resources">
      <ul>
        <li><a href="https://pi-hole.net" target="_blank" rel="noopener noreferrer">Pi-hole Official Documentation</a></li>
        <li><a href="https://discourse.pi-hole.net" target="_blank" rel="noopener noreferrer">Pi-hole Community Forum</a></li>
        <li><a href="https://www.raspberrypi.com/documentation" target="_blank" rel="noopener noreferrer">Raspberry Pi Documentation</a></li>
        <li><a href="https://www.youtube.com/watch?v=cE21YjuaB6o" target="_blank" rel="noopener noreferrer">World's Greatest Pi-hole Tutorial</a></li>
        <li><a href="https://developers.cloudflare.com/1.1.1.1/setup/" target="_blank" rel="noopener noreferrer">Cloudflare DNS Setup Guide</a></li>
        <li><a href="https://firebog.net" target="_blank" rel="noopener noreferrer">The Firebog - Curated Blocklists</a></li>
      </ul>
    </DevLogSection>
  </DevLogEntry>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useGitHubStore } from '@/stores/github'
import BaseImage from '@/components/media/BaseImage.vue'
import DevLogEntry from '@/components/devlog/Entry.vue'
import DevLogSection from '@/components/devlog/Section.vue'
import type { DevLogEntryConfig } from '@/types/devlog'
import { PIHOLE_IMAGES } from '@/assets/software'

const { config } = defineProps<{ config: DevLogEntryConfig }>()

const githubStore = useGitHubStore()

const githubStats = computed(() =>
  config.repoId ? githubStore.getRepoStats(config.repoId) : undefined
)
</script>

<style scoped lang="scss">
.pihole {
  &__dashboard {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-6);
    align-items: start;
    margin: var(--space-6) 0;
    padding: var(--space-5);
    background: var(--color-surface-2);
    border-radius: var(--radius-lg);
    border: 1px solid var(--color-border);

    @include tablet {
      grid-template-columns: 1fr;
      gap: var(--space-4);
      padding: var(--space-4);
    }

    @include mobile {
      grid-template-columns: 1fr;
      gap: var(--space-3);
      padding: var(--space-3);
    }

    &-column {
      display: grid;
      grid-template-rows: 1fr auto;
      gap: var(--space-4);
      height: 100%;
    }

    &-text {
      flex: 0 0 auto;
      font-size: var(--text-lg) !important;
      color: var(--color-info) !important;
      text-align: center;
      margin-top: 15%;
      padding: 1rem;
      
      @include tablet {
        font-size: var(--text-xl) !important;
        margin: 0;
      }
      
      @include mobile {
        font-size: var(--text-xl) !important;
        margin: 0;
      }
    }
  }

  &__stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: var(--space-4);
    margin: var(--space-5) 0;
    padding: var(--space-5);
    background: var(--color-surface-2);
    border-radius: var(--radius-md);
    border-left: 3px solid var(--color-success);
    
    @include mobile {
      grid-template-columns: 1fr;
      gap: var(--space-6);
      width: fit-content;
      margin: var(--space-4) auto;
    }
  }

  &__stat {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
    text-align: center;

    &-value {
      font-family: var(--font-mono);
      font-size: var(--text-2xl);
      font-weight: var(--font-bold);
      color: var(--color-primary);

      @include mobile {
        font-size: var(--text-xl);
      }
    }

    &-label {
      font-family: var(--font-body);
      font-size: var(--text-sm);
      color: var(--color-text-muted);
      line-height: var(--leading-tight);
    }
  }
}
</style>