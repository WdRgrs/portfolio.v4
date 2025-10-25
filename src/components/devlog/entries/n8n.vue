<template>
  <DevLogEntry 
    :title="config.title" 
    :date="config.date" 
    :types="config.types" 
    :tags="config.tags"
    :read-time="config.readTime" 
    :logo="config.logo" 
    :default-expanded="config.defaultExpanded" 
  >
    <DevLogSection :no-divider="true">
      <p>
        The most recent curiosity has led me down the rabbit-hole of automation.
        In between juggling family, honey-dos & daily chores I needed a good side quest to
        aid in procrastination with the job hunt. A small down payment of effort has resulted in a net positive of the
        job posts now coming to me.
      </p>

      <p>
        <strong>TL;DR:</strong> I built a self-hosted n8n workflow that pulls jobs from free APIs, filters them, and
        posts to a dedicated Discord channel at 9 AM every morning. It beats juggling five tabs before coffee and it’s
        easy to tweak over time.
      </p>
    </DevLogSection>

    <DevLogSection heading="The Goal">
      <p>
        Automate the boring part of job hunting. Collect listings for frontend and full-stack roles, keep an eye on
        AR/VR opportunities,
        and ship a focused digest on a schedule. Keep it local, free, safe, and simple to run on my
        own hardware.
      </p>
    </DevLogSection>

    <DevLogSection heading="Implementation">
      <p>
        After a quick intro into the n8n world, I've settled on the Docker implementation.
      </p>

      <p>
        I started with the endpoints at the edges: Make a request, post to a Discord channel. Plan to meet in the middle
        once the ends work. After a little prodding, the first API answered - It isn't pretty but at least it's got lots
        of unnecessary information. Dig a bit into various API docs and in typical developer fashion: these free
        resources have unfortunate and varied shapes, docs & interactions. I wouldn't have it any other way.
      </p>

      <div class="media-float media-float--right">
        <BaseImage :asset="N8N_IMAGES[0]" expandable />
        <p class="media-float__caption">n8n workflow canvas</p>
      </div>

      <p>
        At this point I've realized I'm going to need a fair bit of
        filtering-finesse, and I hadn't even stumbled into discord's 2k
        char message limit yet.. <span>(ooo foreshadowing)</span>.
      </p>

      <p>
        <strong> On to the destination:</strong>
        Discord setup was straightforward. It felt a lot like wiring a Teams webhook from a previous project. I used to
        assume there were more gates to pass for this kind of integration. Credit to the platform teams for making it
        simple.
      </p>

      <p>
        A small cheer as "Hello world" pops up in the discord channel and the prototypical idea begins to take
        shape.
      </p>

      <p>
        With a working prototype I turned to secrets and time. Webhook URLs moved into env vars. Timezone quirks in
        Docker showed up fast, so I set <code>GENERIC_TIMEZONE</code> and cleaned up the container config. A few cycles
        of start, stop, prune, repeat, and kinks were straightened out - shoutout to the docs for not hallucinating.
      </p>

      <div class="media-float media-float--left">
        <BaseVideo :asset="N8N_VIDEOS[0]" :controls="false" autoplay muted loop />
        <p class="media-float__caption">Daily digest landing in Discord at 9 AM Central. Quietly satisfying.</p>
      </div>


      <p>
        Once the foundation was solid, I layered in more sources: Adzuna with API keys, The Muse with a
        loop for pagination, and RemoteOK x2 to track both frontend and AR/VR roles separately.
        Each has their own quirks, easily managed by normalization via Code node, filtered with keyword boundaries and
        trimmed any unnecessary metadata.
      </p>

      <p>
        It didn't take long to run into Discord’s 2k character message limit. Message splitting to the rescue.
        Short lists send as one message. Long lists fan out across a few, still under Discord’s rate limits of about
        ~30/min.
      </p>
    </DevLogSection>

    <DevLogSection heading="Challenges">
      <p>
        The big platforms love developers but do not expose practical job APIs. LinkedIn is partner-only for this use,
        so I worked with what was available. Every provider had a new idea about field names, data organization &
        response
        handling. Creative and defensive parsing kept it honest.
      </p>

      <p>
        Timezones inside containers can be sneaky but is a well documented hurdle for locally hosted n8n'ers. Once env
        vars and the container clock agreed, the rest of the workflow felt sturdy.
      </p>
    </DevLogSection>

    <DevLogSection heading="What I Learned">
      <p>
        "I should have started this sooner" - an all too common sentiment with most personal projects and just as
        fitting here.
        n8n makes the plumbing simple, and a small Code node covers edge cases that visual nodes do not. A splitter
        pattern and a few reusable filters carry surprisingly far.
      </p>

      <p>
        The workflow has been running for a few days. I see better matches, sooner, and I am not burning time on manual
        checks. Local runtime makes me the owner.. no vendor lock-in or fees.
      </p>
    </DevLogSection>

    <DevLogSection heading="Tech Stack">
      <ul>
        <li>n8n in Docker, running locally on the daily driver (will migrate to Raspberry Pi soon)</li>
        <li>JavaScript Code nodes for normalization, filtering, and message splitting</li>
        <li>Discord Webhooks for delivery</li>
        <li>APIs: Remotive, Adzuna, The Muse, RemoteOK</li>
        <li>Core nodes: Schedule Trigger, HTTP Request, Loop Over Items</li>
      </ul>
    </DevLogSection>

    <DevLogSection heading="Next Steps">
      <p>
        Add SQLite to track seen IDs and prevent duplicates. Migrate the workflow to the Raspberry Pi that already runs
        Pi-hole. Add location filters for Austin, Olympia, WA and North Carolina. Try a weekly email summary for a
        different view.
        Start sprinkling in small home automations using the same n8n instance. Aggregate tech news articles in a
        similar fashion.
      </p>
    </DevLogSection>
  </DevLogEntry>
</template>

<script setup lang="ts">
// import { useGitHubStore } from '@/stores/github'
import DevLogEntry from '@/components/devlog/Entry.vue'
import DevLogSection from '@/components/devlog/Section.vue'
import BaseImage from '@/components/media/BaseImage.vue'
import BaseVideo from '@/components/media/BaseVideo.vue'
import { N8N_IMAGES, N8N_VIDEOS } from '@/assets/software'

import type { DevLogEntryConfig } from '@/types/devlog'

const props = defineProps<{ config: DevLogEntryConfig }>()
// const githubStore = useGitHubStore()
// const githubStats = computed(() =>
//   props.config.repoId ? githubStore.getRepoStats(props.config.repoId) : undefined
// )
</script>

<style scoped lang="scss">
.media-float {
  float: right;
  max-width: 45%;
  margin: 0 0 var(--space-4) var(--space-6);

  &--left {
    float: left;
    margin: 0 var(--space-6) var(--space-4) 0;
  }

  @include tablet {
    float: none;
    max-width: 100%;
    margin: var(--space-4) 0;
  }

  @include mobile {
    float: none;
    max-width: 100%;
    margin: var(--space-4) 0;
  }

  &__caption {
    margin-top: var(--space-2);
    font-size: var(--text-sm);
    color: var(--color-text-muted);
    text-align: center;
  }
}
</style>
