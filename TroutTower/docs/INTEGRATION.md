# Trout Tower - WLA_App Integration Guide

This guide explains how to integrate Trout Tower into your WLA_App project.

## Table of Contents
- [Overview](#overview)
- [Integration Methods](#integration-methods)
- [Method 1: Standalone Process](#method-1-standalone-process)
- [Method 2: Embedded Module](#method-2-embedded-module)
- [Method 3: JAR Integration](#method-3-jar-integration)
- [Configuration](#configuration)
- [Troubleshooting](#troubleshooting)

## Overview

Trout Tower can be integrated into WLA_App in several ways depending on your requirements:

1. **Standalone Process** - Launch as a separate Java process
2. **Embedded Module** - Include as a module in your application
3. **JAR Integration** - Package as a JAR and include in classpath

## Integration Methods

### Method 1: Standalone Process

This is the simplest method - launch Trout Tower as a separate process.

#### Step 1: Copy Trout Tower to WLA_App
```
WLA_App/
├── modules/
│   └── TroutTower/
│       ├── src/
│       ├── lib/
│       ├── assets/
│       └── ...
```

#### Step 2: Create Launcher in WLA_App

```java
// In your WLA_App main application
public class GameLauncher {
    
    public static void launchTroutTower() {
        try {
            // Build the command
            List<String> command = new ArrayList<>();
            command.add("java");
            command.add("-Djava.library.path=modules/TroutTower/lib/JOGLwin/lib64");
            command.add("-cp");
            command.add("modules/TroutTower/bin;modules/TroutTower/lib/*");
            command.add("com.trouttower.Main");
            
            // Create process builder
            ProcessBuilder pb = new ProcessBuilder(command);
            pb.directory(new File("modules/TroutTower"));
            
            // Start the game
            Process process = pb.start();
            
            // Optional: Monitor the process
            int exitCode = process.waitFor();
            System.out.println("Trout Tower exited with code: " + exitCode);
            
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

#### Step 3: Add Menu Button in WLA_App

```java
JButton playTroutTowerBtn = new JButton("Play Trout Tower");
playTroutTowerBtn.addActionListener(e -> GameLauncher.launchTroutTower());
```

### Method 2: Embedded Module

Integrate Trout Tower directly into your application's source.

#### Step 1: Copy Source Files

Copy the `com.trouttower` package into your WLA_App source:

```
WLA_App/
├── src/
│   ├── com/
│   │   ├── wla/
│   │   │   └── ... (your WLA_App code)
│   │   ├── trouttower/
│   │   │   ├── controller/
│   │   │   ├── model/
│   │   │   ├── views/
│   │   │   ├── utils/
│   │   │   └── Main.java
│   │   └── bakar/
│   │       └── ... (OpenGL utilities)
```

#### Step 2: Copy Libraries and Assets

```
WLA_App/
├── lib/
│   └── JOGLwin/
│       ├── lib32/
│       └── lib64/
├── resources/
│   └── trouttower/
│       └── assets/
```

#### Step 3: Launch from WLA_App

```java
// In your WLA_App
import com.trouttower.views.GameFrame;

public class WLAMainApp {
    
    public void launchTroutTower() {
        SwingUtilities.invokeLater(() -> {
            GameFrame gameFrame = new GameFrame();
            gameFrame.setVisible(true);
        });
    }
}
```

### Method 3: JAR Integration

Package Trout Tower as a JAR file and include it in WLA_App.

#### Step 1: Create Executable JAR

Create a `MANIFEST.MF`:
```
Manifest-Version: 1.0
Main-Class: com.trouttower.Main
Class-Path: lib/jogl.jar lib/gluegen-rt.jar
```

Build JAR:
```bash
# Compile
javac -cp "lib/*" -d bin src/com/trouttower/**/*.java src/com/bakar/**/*.java

# Copy resources
cp -r src/assets bin/

# Create JAR
jar cfm TroutTower.jar MANIFEST.MF -C bin .
```

#### Step 2: Add to WLA_App

```
WLA_App/
├── games/
│   └── TroutTower.jar
└── lib/
    └── jogl/
        ├── jogl.jar
        ├── gluegen-rt.jar
        └── natives/
            └── windows/
                ├── gluegen-rt.dll
                └── jogl.dll
```

#### Step 3: Launch from WLA_App

```java
public class GameLauncher {
    
    public static void launchTroutTowerJar() {
        try {
            ProcessBuilder pb = new ProcessBuilder(
                "java",
                "-Djava.library.path=lib/jogl/natives/windows",
                "-jar",
                "games/TroutTower.jar"
            );
            pb.start();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

## Configuration

### Setting Native Library Path

Ensure JOGL native libraries are accessible:

```java
// Method 1: System property
System.setProperty("java.library.path", "path/to/natives");

// Method 2: Command line
java -Djava.library.path=path/to/natives -jar TroutTower.jar
```

### Resource Path Configuration

If integrating as a module, update resource paths:

```java
// In your code, update paths like:
// From: "/assets/menu/logo.png"
// To: "/trouttower/assets/menu/logo.png"
```

### Scores and Data Files

Trout Tower saves scores to `scores.dat`. Ensure write permissions:

```java
// Set working directory
ProcessBuilder pb = new ProcessBuilder(command);
pb.directory(new File("path/to/trouttower"));
```

## UI Integration Examples

### Example 1: Main Menu Button

```java
JPanel gamePanel = new JPanel();
gamePanel.setLayout(new GridLayout(3, 1, 10, 10));

JButton troutTowerBtn = new JButton("🐟 Trout Tower");
troutTowerBtn.setFont(new Font("Arial", Font.BOLD, 24));
troutTowerBtn.addActionListener(e -> GameLauncher.launchTroutTower());

gamePanel.add(troutTowerBtn);
// Add other game buttons...
```

### Example 2: Game Card in Grid

```java
// Create game card
JPanel troutTowerCard = new JPanel();
troutTowerCard.setLayout(new BorderLayout());

ImageIcon icon = new ImageIcon("modules/TroutTower/assets/menu/logo.png");
JLabel iconLabel = new JLabel(icon);

JButton playBtn = new JButton("Play");
playBtn.addActionListener(e -> GameLauncher.launchTroutTower());

troutTowerCard.add(iconLabel, BorderLayout.CENTER);
troutTowerCard.add(playBtn, BorderLayout.SOUTH);

// Add to your games grid
gamesPanel.add(troutTowerCard);
```

### Example 3: Embedded in Tab

```java
JTabbedPane tabbedPane = new JTabbedPane();

// Add other tabs...

// Embedded game tab
JPanel gameTab = new JPanel();
gameTab.setLayout(new BorderLayout());

JButton launchBtn = new JButton("Launch Trout Tower");
launchBtn.addActionListener(e -> {
    // Launch game
    GameFrame game = new GameFrame();
    game.setVisible(true);
});

gameTab.add(launchBtn, BorderLayout.CENTER);
tabbedPane.addTab("Trout Tower", gameTab);
```

## Troubleshooting

### Issue: UnsatisfiedLinkError

**Problem**: Native library not found

**Solution**:
```java
// Ensure correct path to native libraries
System.setProperty("java.library.path", "lib/JOGLwin/lib64");

// Or use absolute path
String libPath = new File("lib/JOGLwin/lib64").getAbsolutePath();
System.setProperty("java.library.path", libPath);
```

### Issue: Resources Not Found

**Problem**: Assets/images not loading

**Solution**:
```java
// Ensure resources are in classpath
// Check working directory
System.out.println("Working Directory: " + System.getProperty("user.dir"));

// Or use absolute paths in ImageEngine.java
```

### Issue: Score File Not Saving

**Problem**: Scores not persisting

**Solution**:
```java
// Ensure write permissions
File scoreFile = new File("scores.dat");
System.out.println("Can write: " + scoreFile.canWrite());

// Check working directory
ProcessBuilder pb = new ProcessBuilder(command);
pb.directory(new File("modules/TroutTower"));
```

### Issue: Multiple Windows

**Problem**: Multiple game instances

**Solution**:
```java
// Track game instance
private static GameFrame currentGame = null;

public static void launchTroutTower() {
    if (currentGame == null || !currentGame.isVisible()) {
        currentGame = new GameFrame();
        currentGame.setVisible(true);
    } else {
        currentGame.toFront();
    }
}
```

## Advanced Integration

### Custom Themes

Modify game theme for WLA_App:

```java
// In Config.java, add:
public static String THEME_COLOR = "#YOUR_COLOR";
public static String APP_NAME = "WLA Games";

// Update branding text
public final static String INFO_TEXT = 
    "Part of " + APP_NAME + "\n" +
    "Trout Tower\n" +
    "...";
```

### Score Integration

Share scores with WLA_App:

```java
// Create callback interface
public interface ScoreCallback {
    void onScoreUpdated(String playerName, int score);
}

// In GameEngine.java, add:
private ScoreCallback scoreCallback;

public void setScoreCallback(ScoreCallback callback) {
    this.scoreCallback = callback;
}

// Call on score update
if (scoreCallback != null) {
    scoreCallback.onScoreUpdated(playerName, score);
}
```

### WLA_App Dashboard Integration

```java
// Add to WLA dashboard
public class Dashboard {
    
    public void addGameWidget() {
        JPanel widget = new JPanel();
        widget.add(new JLabel("Trout Tower"));
        
        // Show high score
        int highScore = getHighScore();
        widget.add(new JLabel("High Score: " + highScore));
        
        // Quick launch
        JButton quickPlay = new JButton("Play");
        quickPlay.addActionListener(e -> GameLauncher.launchTroutTower());
        widget.add(quickPlay);
        
        dashboard.add(widget);
    }
    
    private int getHighScore() {
        // Read from TroutTower scores.dat
        ScoreReader.Score[] scores = ScoreReader.scoreData();
        return scores[0].score;
    }
}
```

## Building for Distribution

When packaging WLA_App with Trout Tower:

1. **Include all dependencies**:
   - JOGL JAR files
   - Native libraries (DLLs)
   - Game assets
   - Source or compiled classes

2. **Set correct paths**:
   - Use relative paths when possible
   - Document any required environment setup

3. **Create installer**:
   - Use tools like Launch4j or jpackage
   - Bundle JRE if needed

4. **Test on target systems**:
   - Verify native libraries load correctly
   - Check file permissions
   - Test resource loading

## Support

For issues specific to Trout Tower integration:
- GitHub: https://github.com/jordangilliam/trouttower
- Issues: https://github.com/jordangilliam/trouttower/issues

---

**Happy Gaming! 🐟🎮**

