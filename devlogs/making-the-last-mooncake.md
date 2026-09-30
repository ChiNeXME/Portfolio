---
title: Making The Last Mooncake
date: 2026-09-30
summary: A cozy bakery game about the Mid-Autumn Festival, made in three days for Cozy Fall Jam 2026. What we built, what broke, and what we'd do differently.
tags: Game jam, Unity, Devlog
image: images/mooncake/main-menu.png
---

<figure class="fig">
  <img src="images/mooncake/main-menu.png" width="962" height="536" alt="main menu shit" />
  <figcaption>The main menu. Artemis, waiting for the moon to come back.</figcaption>
</figure>

The Last Mooncake is a cozy game about a small bakery on the night of the Mid-Autumn Festival. Customers come in carrying stories, and the only way to bake them the right mooncake is to actually read those stories.

We made it for [Cozy Fall Jam 2026](https://itch.io/jam/cozy-fall-jam-2026) around the theme "Fall" and the optional theme "Roots". You can [play it on itch.io](https://mzee08.itch.io/the-last-mooncake).

## Four people, four ways in

The easiest way to explain where the game came from is to let each of us say how we read the theme.

**ChiNeXME (programmer).** Honestly, at first I just wanted to make a cafe game. You serve customers, then buy upgrades after each level. No story in mind, just that loop.

**Hoji (art).** Man idk, I was just eating a mooncake and boom, "isn't it like Mid-Autumn for mooncakes, haha the moon story."

**HappyCPPD (programmer).** Mid-Autumn was a big part of my childhood, so when Hoji brought up the Chang'e idea, all those memories came flooding back. The salty egg yolk, the red bean filling, sharing mooncakes with family. I wasn't even in the class, but I wanted to help turn that feeling into a game.

**Bummer (music).** When the idea was pitched to me, I wanted music that fit both the cafe setting and the autumn vibe. I wrote a few songs and made some simple sound effects to match. I also added traditional Chinese instruments so it felt tied to Mid-Autumn.

Put together, my cafe became a mooncake bakery on the night of the festival, where every customer brings a story.

## The story and the characters

On the night of the Mid-Autumn Festival, the moon has forgotten how to shine. You play Artemis, a little cat who wanders into a bakery and finds an old, cracked mooncake mold. The Baker takes you in, and together you help customers rebuild mooncakes from their memories. Each time you get a recipe right, the moon gets a little brighter.

- Lina hasn't been home in five years. She wants to bring her father the mooncake he used to make for her, but she never learned the recipe. She's also the tutorial customer.
- Mei and Jian are twins trying to remake their late grandmother's mooncake. Each of them only remembers half of it, and they have to stop blaming each other to finish it.
- Chang'e is a faint voice guiding Artemis, and the reason the mold remembers anything at all.

## What each of us built

### ChiNeXME

A story like this lives or dies on the dialogue, so getting it working is where I spent most of my time. I built the dialogue system that runs every conversation in the game. Portraits swap in when each character speaks, their mouths move while they're "talking," and every character has their own voice. Those voices are my own, pitched up or down in GarageBand.

The hardest part was finding fixes for my bugs. I'd google them, but it was a gamble whether I'd find the answer. When I didn't, I kept working on the bug myself, and fixing it on my own made me want to keep going. I also found it hard to read my teammate's code, since I'm not used to working with other people yet. I powered through, though, and got it doing what I wanted.

I'm proudest of the dialogue. It turned out exactly how I pictured it: the SFX playing, the portraits changing, the characters visibly talking, and all of it very modular.

### HappyCPPD

I built the recipe side, so the clues customers give you turn into actual choices. You pick the filling, the yolk, the sweetness and the finishing touch.

## How the three days went

### Day 1

We were still working out who owned what. HappyCPPD started on a simple top-down 2D game, which we scrapped later. I built the CafeTime scene, where most of the gameplay would happen, along with the barebones around it. Then I noticed HappyCPPD had started on the gameplay loop, which I'd assumed was my part, so I moved over to the dialogue and the NPCs.

<figure class="fig fig-log">
  <div class="log-scroll" tabindex="0" role="group" aria-label="Day 1 commit history, scrollable">
    <img src="images/mooncake/commits-day1.png" width="406" height="1258" alt="who eve reads these also i just learnt baout figcaption so yay" loading="lazy" />
  </div>
  <figcaption>Day 1 commits, scroll to read. Note the "Revert" followed by "Reapply". That was us learning to share a repo.</figcaption>
</figure>

### Day 2

The commits slowed down, but the work inside them didn't. HappyCPPD wrote the dialogue and scripts for the NPCs, made assets, built and polished the gameplay loop, and wrote the documents. I added a global SFX and BGM player, then built the settings menu (volume and auto notes), manual note taking for when auto notes is off, and saving for all of it.

<figure class="fig fig-sm">
  <img src="images/mooncake/commits-day2.png" width="482" height="294" alt="stf" loading="lazy" />
  <figcaption>Day 2 commits. Lina joins the game.</figcaption>
</figure>

### Day 3

The last day was for finishing and joining everything together, and there were plenty of roadblocks. We were missing some assets. There were bugs, a teammate's Unity crashed, and the UI glitched. Building the game took 20 minutes each time.

HappyCPPD made the final assets (Artemis, backgrounds and so on), the intro and ending scenes, and put the music in. I fixed bugs (mostly resolution ones), made more SFX, cleaned up the gameplay, polished the scene, and finished the portraits for the rest of the NPCs.

<figure class="fig fig-log">
  <div class="log-scroll" tabindex="0" role="group" aria-label="Day 3 commit history, scrollable">
    <img src="images/mooncake/commits-day3.png" width="374" height="1408" alt="STAFF" loading="lazy" />
  </div>
  <figcaption>Day 3 commits, scroll to read. Almost every one is a fix, a portrait or a sound.</figcaption>
</figure>

## What went wrong

**Day 1.** We weren't sure what each person was supposed to work on, and that caused confusion. We made a Trello board and barely used it. Some ideas had to be scrapped because of time.

**Day 2.** We were short on assets, so the developers stepped in and tried to make some. Getting the systems to work together was harder than we expected. Merge conflicts showed up, and cleaning them took a while. I had to read a lot of scripts before I could fully integrate some of the systems.

**Day 3.** Bugs we hadn't seen showed up as we wrapped up. The worst was UI scaling on other screens. All of us had worked at 1920 x 1080, so we had to fix the resolution scaling and resubmit. The 20 minute build was the other pain, but we'd planned to finish two hours before the deadline for exactly this kind of thing.

## What we learnt

1. **Plan better.** Getting everyone on the same page mattered more than we thought. Because our planning was thin, people got confused, and that slowed us down.
2. **Have a plan B.** When we needed assets and our artist had something come up, the developers tried to make the assets themselves. Looking back, we could have grabbed some assets online to move faster.

## Credits

- ChiNeXME: lead, programmer, UI. Dialogue system, settings, audio implementation.
- Hoji: artist, model. Came up with the Chang'e story.
- lbummer: music composer and sound effects.
- HappyCPPD: programmer, artist, story, dialogue writer.

Thanks for reading, and happy Mid-Autumn. 🥮

[Play The Last Mooncake on itch.io](https://mzee08.itch.io/the-last-mooncake)
