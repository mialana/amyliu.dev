---
title: Chess in Java
slug: Chess_in_Java
startDate: 2021-11-20
endDate: 2021-12-07
type: individual
category: school
demoVideoLink: https://youtu.be/R_H4NLFAtWQ
techStack:
    - Java
    - Java_Swing
tags:
    - "2021"
    - turn-based
    - game_development
    - graphical_user_interface
description: A simple chess application with state-saving and move-hints / limitations.
repository: https://github.com/mialana/chess
---

## Summary

This chess game was my first coding project, created using standard Java and the Swing library. The project can serve as a baseline from where my skillset has grown. Furthermore, looking back, I am glad that I demonstrated an ability to use external resources and go beyond set requirements as a beginner programmer.

## Motivation

To create a "plug-and-play" application for playing chess. Although the interface is straightforward at its core, it also prioritizes user-experience through state-saving and a built-in move-hinting system.

## Achievements

1. Implement File I/O for state-saving using the `BufferedReader` and `BufferedWriter` classes in Java.
2. Support move-hinting and complex game logic (en passant, pawn swap, check, checkmate, castling) through inheritance/sub-typing and dynamic dispatch.

## Next Steps

- [x] Add subtitles for written explanation to demo video.

## References

[Java Swing Library](https://docs.oracle.com/javase/7/docs/api/javax/swing/package-summary.html)
[Java BufferedReader](https://docs.oracle.com/javase/8/docs/api/java/io/BufferedReader.html)
[Java BufferedWriter](https://docs.oracle.com/javase/8/docs/api/java/io/BufferedWriter.html)

## Method

### Architecture and Class Design

The chess application was structured with a modular object-oriented design in Java. Each class serves a dedicated role to maintain clarity and separation of concerns:

- **`RunChess`** manages the primary user interface and event listeners. It initializes the game window, listens for mouse clicks, and coordinates drawing calls.
- **`Chess`** handles rendering logic, including drawing the game board, highlighting active pieces or legal moves, displaying game-end states, and managing user interactions such as saving the game.
- **`ChessBoard`** maintains the internal state of the game, including the 2D array of pieces, current turn tracking, and overall board logic.
- **`Piece` and Subclasses** define the behaviors of different chess pieces. A shared abstract `Piece` class provides a general interface, while subclasses (e.g., `Rook`, `Pawn`, `King`) implement unique movement rules and special actions like en passant, pawn promotion, and castling.

This structure allowed the game to handle complex rule variations with clear and maintainable logic.

### Inheritance and Polymorphism

Special behaviors for certain pieces were implemented using inheritance and dynamic dispatch. For instance, methods such as `getValidMoves()` were overridden in subclasses to respect the movement rules specific to each piece. This approach made it easier to handle special-case rules dynamically, without introducing excessive conditional logic into the main game loop.

### File Input/Output

To support saving and loading game states, Java's `BufferedReader` and `BufferedWriter` classes were used. Game state data is written to and parsed from a plain text file format, allowing users to resume previous games. All I/O operations include appropriate exception handling to prevent data corruption or crashes during read/write events.

### Development Process

Development followed an iterative and exploratory process. As this was an early-stage project for me, significant time was invested in understanding Java Swing and its event model. Emphasis was placed on clear commenting, manageable method scope, and gradual integration of features like move highlighting and end-state detection. While some areas (e.g., encapsulation of private state) need improvement in retrospect, the project served as a strong foundational exercise in object-oriented design and user interface programming.
