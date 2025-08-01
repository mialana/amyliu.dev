---
title: Mini Minecraft in C++
slug: Mini_Minecraft
startDate: 2023-03-27
endDate: 2023-05-08
type: group
category: school
demoVideoLink: https://youtu.be/KJk70-qdE_o
techStack:
    - C++
    - QT
    - GLSL
    - OpenGL
tags:
    - "2023"
    - game_physics
    - game_development
    - multi-threading
    - NPC_behavior
    - artificial_intelligence
description: A simple C++ program to emulate the 3D entity interactivity and world exploration themes of Minecraft.
code: https://github.com/mialana/mini-minecraft
---

## Summary

This project is a simplified Minecraft-style game implemented in C++ using OpenGL and QT, designed for real-time terrain rendering, block manipulation, and player-NPC interaction. The world is divided into dynamic chunks to optimize memory and rendering efficiency, with support for both first- and third-person camera modes. Players can navigate, edit the terrain, and observe animated non-player characters (NPCs) exhibiting basic autonomous behavior. Key features include chunked world generation, a custom tick-based game loop, animated third-person character control, and NPCs capable of environmental navigation and basic pathfinding.

## Motivation

The goal of this project was to explore core game engine components such as terrain management, real-time simulation, and AI-driven character behavior within a constrained graphics framework. Implementing gameplay mechanics such as chunked world rendering and third-person animation provided insight into performance trade-offs in graphics and simulation loops. Additionally, developing autonomous NPC behavior—including reactive movement and simple pathfinding—offered a practical foundation in game AI techniques and reinforced broader principles of game design and player immersion.

## Achievements

1. Implemented chunk-based terrain rendering.
2. Designed a tick-based game loop to update player movement and physics.
3. Developed terrain-aware NPCs capable of wandering, jumping, and navigating obstacles.
4. Added third-person mode with animated player movement.
5. Enabled basic NPC pathfinding for hostile mobs to follow players around the world.

## Next Steps

- [ ] Expand NPC behaviors and types

## Method

### Terrain Chunking and Rendering

The world is partitioned into 16×256×16 chunks, each representing a segment of the 3D terrain. Chunks loaded in dynamically as the player moves through the world. This system reduces draw calls by culling off-screen chunks and batching vertex data. Vertex and index buffers for each chunk are stored and updated via OpenGL, using VBOs and VAOs to manage geometry efficiently.

```cpp
// miniMinecraft/src/scene/chunk.cpp
void Chunk::linkNeighbor(uPtr<Chunk>& neighbor, Direction dir)
{
    if (neighbor != nullptr) {
        this->m_neighbors[dir] = neighbor.get();
        neighbor->m_neighbors[oppositeDirection.at(dir)] = this;
    }
}
```

Block data is stored in a 3D array for each chunk. When blocks are added or removed by the player, affected chunks are marked dirty, and their mesh is rebuilt. Faces between adjacent opaque blocks are culled to minimize overdraw.

### Game Loop and Tick System

The main simulation runs on a fixed timestep via a tick-based loop that decouples logic updates from rendering. This allows consistent simulation behavior regardless of framerate. The `MyGL::tick()` function handles player input, physics, and AI logic updates. Each tick processes gravity, collision detection, jumping, and velocity integration for the player and NPCs.

```cpp
// miniMinecraft/src/mygl.cpp
void MyGL::tick()
{
    glm::vec3 prevPlayerPos = m_player.m_position;
    float dT = (QDateTime::currentMSecsSinceEpoch() - m_currMSecSinceEpoch) / 1000.f;
    m_player.tick(dT, m_terrain);

    for (auto& mob : m_mobs) {
        mob->m_inputs.playerPosition = m_player.m_position;
        mob->tick(dT, m_terrain);
    }
    m_currMSecSinceEpoch = QDateTime::currentMSecsSinceEpoch();
}
```

```cpp
// miniMinecraft/src/scene/player.cpp
void Player::tick(float dT, Terrain& terrain)
{
    Entity::isOnGround(terrain);
    Entity::isInLiquid(terrain);
    Entity::isUnderLiquid(terrain);
    processInputs();
    Entity::computePhysics(dT, terrain);
    Entity::animate(dT);
}
```

Player physics are implemented using the concept of axis-aligned bounding box (AAABB) collision checks against solid block dimensions. The system prevents tunneling by clamping velocity and checking collisions along each axis sequentially.

```cpp
// miniMinecraft/src/scene/entity.h
class Entity
{
protected:
    // Check if the entity is submerged in water or lava
    void isInLiquid(Terrain& terrain);

    // Check if the entity is standing on solid ground
    void isOnGround(Terrain& terrain);

    // Check if the entity's head is underwater or under lava for full-screen post-processing
    void isUnderLiquid(Terrain& terrain);

public:
    // Update entity state and behavior each tick
    virtual void tick(float dT, Terrain& terrain) = 0;

    // Apply gravity, velocity, and movement integration
    virtual void computePhysics(float dT, Terrain& terrain);

    // Resolve collisions with surrounding solid blocks
    virtual void detectCollision(Terrain& terrain);

    // Perform voxel grid traversal to find first intersected block
    virtual bool gridMarch(glm::vec3 rayOrigin,
                           glm::vec3 rayDirection,
                           float* out_dist,
                           glm::ivec3* out_blockHit,
                           Terrain& terrain,
                           BlockType* out_type = nullptr);
}
```

### NPC Behavior and Navigation

The project features two classes of non-player characters: non-hostile mobs (pigs) and hostile mobs (zombies). Both are implemented with custom movement and behavior logic integrated into the engine's tick-based update system.

Non-hostile mobs perform ambient wandering behavior. At randomized intervals, they select a new direction and walk forward for a set duration, creating the appearance of idle exploration. When encountering obstacles such as low walls or terrain changes, they attempt to jump over them, allowing for limited traversal without requiring complex navigation graphs or pathfinding algorithms.

Hostile mobs exhibit pursuit behavior. When the player enters a predefined detection radius, the mob aligns its orientation toward the player and moves forward in that direction. Like non-hostile mobs, they perform basic terrain checks and can jump over minor obstacles to maintain pursuit.

Both pig and zombie agents update once per engine tick. Their movement routines are integrated into the same fixed-time simulation loop handling physics and player updates. Collision detection with the environment ensures correct positioning and prevents agents from falling through terrain or entering solid blocks. This minimalist AI design avoids complexity while providing lifelike, responsive NPC behavior.

```cpp
// miniMinecraft/src/scene/mob.cpp
void Mob::tick(float dT, Terrain& terrain)
{
    if (!this->needsRespawn) {
        computePhysics(dT, terrain);
        animate(dT);
        isInLiquid(terrain);
        isUnderLiquid(terrain);
        pathFind();

        timeSinceLastPathRecompute += dT;
        timeSinceLastDirectionCompute += dT;

        if (timeSinceLastDirectionCompute > 0.3f) {
            timeSinceLastDirectionCompute = 0.f;

            if (glm::length(m_position - m_lastPosition) < 0.1f) {
                m_realDirection = glm::vec3(0.f);
            } else {
                m_realDirection = glm::normalize(m_position - m_lastPosition);
                m_lastPosition = m_position;
            }
        }
    }

    if (glm::distance(this->m_position, this->m_inputs.playerPosition) > 100.f) {
        this->needsRespawn = true;
    }
}
```

### Multi-View Modes and Player Animation

The game supports first-person, second-person, and third-person camera modes. Keyboard input allows toggling between views, each with a distinct camera configuration. All views maintain alignment with the player’s facing direction.

Animation states are driven by user input and player movement speed. Keyframe-based animations are triggered for idle and walking movement.

The player is represented using a node-based scene graph. The cube-based player body is traversed at runtime and sent to OpenGL for rendering if the current camera view is second or third-person.

```cpp
// miniMinecraft/src/scene/player.h
class Player : public Entity
{
private:
    Camera m_camera;
    Camera m_thirdPersonCamera;
    Camera m_frontViewCamera;

public:
    void calculateThirdPersonCameraRotation();
    void calculateFrontViewCameraRotation();
    void changeCamera();
}
```
