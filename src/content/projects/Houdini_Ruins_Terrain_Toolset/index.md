---
title: Houdini Ruins Terrain Toolset
slug: Houdini_Ruins_Terrain_Toolset
startDate: 2025-06-14
endDate: 2025-07-16
type: individual
category: personal
techStack:
    - SideFX_Houdini
    - Vex
    - Unity_Game_Engine
tags:
    - "2025"
    - game_art_challenge
    - procedural
    - tech_art
    - VFX
description: A toolset for creating procedural ruined terrains and associated assets in Houdini.
code: https://github.com/mialana/houdini-ruins-terrain-toolset
---

## Summary

## Motivation

## Achievements

## Next Steps

## References

### Tutorial Series

[Post Apocalyptic Ruins in UE4 - YouTube Playlist](https://www.youtube.com/playlist?list=PLXNFA1EysfYkqx3R-WyQHYEYR3c1odJPX)
[Castle Wall Tool -YouTube Playlist](https://www.youtube.com/playlist?list=PLNbgmFvU__fiPhyUWHHzZ2Nv5ieM_bOdB)

### Copernicus

1. [Texture Transfer Walkthrough](https://www.youtube.com/watch?v=5N846UXGbrA)
2. [Exporting Textures from COPs](https://www.youtube.com/watch?v=iGkl5VV3m8M)
3. [Sponge in COP](https://www.youtube.com/watch?v=LzNcoG1e9oc)
4. [Create a sharp rock material](https://www.sidefx.com/tutorials/houdini-205-copernicus-creating-a-sharp-rock-material/)
5. [LOP Import from Group Forum](https://www.sidefx.com/forum/topic/71692/)

### Terrain Concepts

1. [Custom Instancer HDA](https://youtu.be/Qj54ifydULo?si=da8bCOvnipuHcsuf&t=900)
2. [Terrain Shaders & Rendering](https://www.youtube.com/watch?v=Kg7WOZqzAME)
3. [Houdini 20.5 - COPs in terrain](https://www.youtube.com/watch?v=9xZFu2XJTBA)
4. [Houdini Heightfields and Cliffs](https://www.youtube.com/watch?v=fF01Lyg_G48)

![img](./assets/Screenshot%202025-06-26%20at%203.21.15%20PM.png)

### Ruin Concepts

1. [Rolling Debris with VEX](https://vimeo.com/277642002)

### Underwater Concepts

1. [Seaweed 01](https://www.youtube.com/watch?v=T2Xmff4WqPc)
2. [Underwater Sunrays](https://www.youtube.com/watch?v=FXzQA9r4r98)
3. [Underwater Bubbles](https://www.youtube.com/watch?v=aom7ZYMAxV4)
4. [Underwater Effects (Turkish)](https://www.youtube.com/watch?v=KIJg0R0gOe0&)

### Relevant Houdini Nodes:

1. [Shallow Water Solver Node Tutorial](https://www.youtube.com/watch?v=-bcxSBuA7vk)
2. [Ocean Spectrum](https://www.youtube.com/watch?v=R-QzOTRUPng)

### Blender:

1. [Critical Giants - Underwater Scenes in Blender](https://www.youtube.com/watch?v=I2B-x3J0W4I)
2. [Arko Visuals - Underwater Scenes in 1 minute](https://www.youtube.com/watch?v=xvgOTeJXKII)

### Cool Assets:

1. [Canyon Cliffs](https://www.youtube.com/watch?v=AGJ4pRFfbBo)
2. [Natural Rock Wall](https://www.youtube.com/watch?v=q-9cVBVMv2E)
3. [Advanced Scattering](https://www.youtube.com/watch?v=N7CDHwgWKVo)
4. [Procedural Greek Pillars](https://www.youtube.com/watch?v=XAIzUKZoe5Q)

## Method

Welcome to my first large-scale Houdini project. Although I've experimented with a few single-file Houdini assets in the past, it's remained for a long time as one of the "explore further" items on my to-do list.

The very beginning of the project process meant watching and following many tutorials videos. I found this to be the best way to learn about the Houdini nodes and features available to me. And thankfully, 1.5 tutorial series later, I seemed to have caught on, i.e. being able to go off script and start building my own node networks. "Houdini-brain" is contagious, that's for sure.

A big limitation though were the requirements of the Game Art Challenge: "Houdini-only, Copernicus for textures, terrain tools for sculpting". So whenever a tutorial mentioned quickly grabbing a Quixel megascan to instance / add detail, it meant a full asset creation process for me.

To modularize my workflow, I compiled a list of different features for my underwater terrain:

Natural Assets:

1. [ ] Seashells / Starfish
2. [ ] Seagrass / Seaweed
3. [ ] Coral Reefs (big & flat, tubes, hand-like shapes)
4. [x] Rocks
5. [ ] Jellyfish

Manmade Assets:

1. [ ] Brick walls
2. [ ] Decayed Structures
3. [ ] Maze tool

Physical Simulation:

1. [ ] Water Volume Field
2. [ ] Caustic lighting
3. [ ] Flow / Current Fields
4. [ ] Bubbles

![img](./assets/underwater-statues-head-of-caesarion-alexandria-egypt-atlantis-1024x768.avif)

![https://www.popularmechanics.com/science/archaeology/a63544905/race-to-study-submerged-settlements/](./assets/ruins-of-the-atlantis-civilization-underwater-ruins-royalty-free-image-1698786770.avif)

### Terrain Assets

#### Rock Wall

![img](./assets/Screenshot%202025-07-03%20at%206.29.01%20PM.png)
![img](./assets/Screenshot%202025-07-03%20at%207.40.29%20PM.png)

- [ ] "Hero":
- [ ] Main Terrain

- [ ] Hero Interaction:
- [ ] Embedded objects (hf project)
- [ ] Shaping tools
- [ ] Scattered objects (rbd sims)

- [ ] Assets:
- [ ] decayed rock wall
- [ ] decayed stone column
- [ ] frayed rope

- [ ] Tools:
- [ ] Terrain shaper
- [x] Terrain algorithmic path curves
- [ ] Custom Layered Fracture tool
- [ ] Flooded Water Generator

Features:

- Flooded water layer
