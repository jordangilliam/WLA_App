# Trout Tower - Quick Start Guide

Get up and running with Trout Tower in minutes!

## For Windows Users

### Option 1: Using Build Scripts (Recommended)

1. **Build the game**:
   ```cmd
   build.bat
   ```

2. **Run the game**:
   ```cmd
   run.bat
   ```

### Option 2: Manual Commands

1. **Compile**:
   ```cmd
   mkdir bin
   javac -cp "lib/*" -sourcepath src -d bin src/com/trouttower/Main.java
   ```

2. **Copy assets**:
   ```cmd
   xcopy /E /I /Y src\assets bin\assets
   ```

3. **Run**:
   ```cmd
   java -Djava.library.path=lib/JOGLwin/lib64 -cp "bin;lib/*" com.trouttower.Main
   ```

## For Mac/Linux Users

### Using Build Scripts

1. **Make scripts executable** (first time only):
   ```bash
   chmod +x build.sh run.sh
   ```

2. **Build the game**:
   ```bash
   ./build.sh
   ```

3. **Run the game**:
   ```bash
   ./run.sh
   ```

**Note**: You'll need to obtain JOGL native libraries for your OS and place them in `lib/JOGLwin/`.

## Game Controls

- **Arrow Keys** (←/→): Move left/right
- **Spacebar**: Jump
- **P**: Pause game
- **Arrow Keys** (↑/↓): Navigate menus
- **Enter/Space**: Select menu option

## Tips for Your First Game

1. **Start Simple**: Just focus on jumping platform to platform
2. **Build Speed**: Moving faster allows for higher jumps
3. **Watch the Edge**: Character will balance on platform edges
4. **Combo Jumps**: Chain jumps together for higher scores
5. **Rotating Jumps**: Very high jumps trigger a rotation animation

## Troubleshooting

### Game Won't Compile
- Ensure you have JDK 8+ installed
- Check that `lib` folder contains JOGL JAR files
- Verify you're in the TroutTower directory

### Black Screen on Start
- Check that assets were copied to `bin/assets`
- Verify JOGL native libraries match your system architecture

### No Sound
- Check volume settings in game (Settings menu)
- Verify sound files exist in `src/assets/Sounds/`

### Score Not Saving
- Ensure `scores.dat` exists in the working directory
- Check write permissions for the directory

## Next Steps

- Read [README.md](README.md) for full documentation
- See [INTEGRATION.md](docs/INTEGRATION.md) for WLA_App integration
- Check out the [GitHub repository](https://github.com/jordangilliam/trouttower)

## Support

Having issues? 
- Check [GitHub Issues](https://github.com/jordangilliam/trouttower/issues)
- Review the full [README.md](README.md)

---

**Enjoy Trout Tower! 🐟🗼**

