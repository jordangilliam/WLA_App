# Trout Tower

<p align="center">
  <img src="assets/logo.png" alt="Trout Tower Logo" width="300">
</p>

## Overview

**Trout Tower** is a fun, endless tower climbing game built with Java and OpenGL. Jump from platform to platform, climb as high as you can, and set new records! This game is a custom-themed version inspired by the classic "Icy Tower" game.

## Table of Contents
- [Overview](#overview)
- [Game Description](#game-description)
- [Screenshots](#screenshots)
- [How to Run](#how-to-run)
- [Building the Game](#building-the-game)
- [Integration with WLA_App](#integration-with-wla_app)
- [Technologies Used](#technologies-used)
- [GitHub Repository](#github-repository)
- [License](#license)

## Game Description

### Gameplay
Control your character as they jump up an endless series of platforms inside a tower. The objective is to climb as high as possible without falling. Points are scored based on the height reached and performing tricks such as combos and high jumps.

### Controls
- **Arrow Keys (Left/Right)**: Move left or right
- **Spacebar**: Jump
- **P**: Pause game
- **Arrow Keys (Up/Down)**: Navigate menus
- **Enter/Space**: Select menu option

### Features
- **Classic Gameplay**: Addictive endless climbing mechanics
- **Enhanced Graphics**: OpenGL-powered graphics with smooth animations
- **Sound Effects and Music**: Immersive audio experience
- **Score System**: Track your performance and compete for high scores
- **Multiple Floor Types**: Different visual themes as you climb higher

## Screenshots

Here are some screenshots from the game:

![Main Menu](screenshots/Screenshot1.png)
*Main menu for the game*

![Game Screen](screenshots/Screenshot2.png)
*In-game action*

![Character Jumping](screenshots/Screenshot3.png)
*Character jumping on platforms*

![Different Floors](screenshots/Screenshot4.png)
*Different floor types as you progress*

## How to Run

### Prerequisites
- **Java Development Kit (JDK)**: JDK 8 or higher
- **Windows OS**: The JOGL libraries are currently configured for Windows

### Quick Start
1. **Clone the Repository**:
    ```sh
    git clone https://github.com/jordangilliam/trouttower.git
    ```
2. **Navigate to the Project Directory**:
    ```sh
    cd trouttower
    ```
3. **Copy OpenGL Libraries**:
   - The `lib/JOGLwin` folder contains the necessary JOGL DLLs
   - Ensure they're in the correct path or copy to `C:\JOGLWin` as needed

4. **Compile the Source Code**:
    ```sh
    javac -cp "lib/*" -d bin src/com/trouttower/**/*.java src/com/bakar/**/*.java
    ```

5. **Run the Game**:
    ```sh
    java -Djava.library.path=lib/JOGLwin/lib64 -cp "bin;lib/*" com.trouttower.Main
    ```

## Building the Game

### Build Script (Windows)
A build script is provided for easy compilation and running:

```cmd
build.bat
```

This will:
1. Clean previous builds
2. Compile all source files
3. Copy necessary resources
4. Create a runnable JAR (optional)

### Manual Build
You can also build manually:

1. **Compile**:
```cmd
mkdir bin
javac -cp "lib/*" -sourcepath src -d bin src/com/trouttower/Main.java
```

2. **Copy Resources**:
```cmd
xcopy /E /I src\assets bin\assets
```

3. **Run**:
```cmd
java -Djava.library.path=lib/JOGLwin/lib64 -cp "bin;lib/*" com.trouttower.Main
```

## Integration with WLA_App

### Adding Trout Tower to WLA_App

To integrate Trout Tower into your WLA_App:

1. **Copy the TroutTower directory** to your WLA_App project
2. **Add as a module** or reference the compiled JAR
3. **Launch from WLA_App**:
   ```java
   // Example integration code
   ProcessBuilder pb = new ProcessBuilder(
       "java",
       "-Djava.library.path=TroutTower/lib/JOGLwin/lib64",
       "-cp", "TroutTower/bin;TroutTower/lib/*",
       "com.trouttower.Main"
   );
   pb.start();
   ```

See [INTEGRATION.md](docs/INTEGRATION.md) for detailed integration instructions.

## Technologies Used

- **Programming Language**: Java 8+
- **Graphics Library**: OpenGL (JOGL)
- **GUI Framework**: Java Swing
- **Audio**: Java Sound API
- **Build Tool**: Command-line compilation (can be adapted to Maven/Gradle)

## Project Structure

```
TroutTower/
├── src/
│   ├── com/
│   │   ├── trouttower/        # Main game package
│   │   │   ├── controller/    # Game controllers
│   │   │   ├── model/         # Game models
│   │   │   ├── views/         # Game views
│   │   │   ├── utils/         # Utilities
│   │   │   └── Main.java      # Entry point
│   │   └── bakar/             # OpenGL utilities
│   └── assets/                # Game assets
├── lib/                       # External libraries
├── screenshots/               # Game screenshots
├── docs/                      # Documentation
└── README.md                  # This file
```

## GitHub Repository

This project is hosted at: **https://github.com/jordangilliam/trouttower**

## Credits and Attribution

**Trout Tower** is developed by Jordan Gilliam and is based on the classic Icy Tower game.

### Original Work Attribution
This project is a themed rebuild based on the [IcyTowerGame](https://github.com/Mahmoudbakar2002/IcyTowerGame) by:
- Mahmoud Atef (mahmoudAtef.coder@gmail.com)
- Mohamed Atef Shata (mohamedshata9898@gmail.com)

Their excellent work in recreating Icy Tower with OpenGL and Java provided the foundation for this themed version.

### Character Sprites
Character sprites sourced from: [Icy Tower Resources](http://www.icytower.unas.cz/down2.htm)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

The original Icy Tower game and its assets are property of their respective owners.

---

## Contact

For questions, issues, or contributions:
- **GitHub**: [jordangilliam](https://github.com/jordangilliam)
- **Repository**: [trouttower](https://github.com/jordangilliam/trouttower)

---

**Enjoy climbing Trout Tower! 🐟🗼**

