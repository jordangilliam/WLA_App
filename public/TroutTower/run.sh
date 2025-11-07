#!/bin/bash
# Trout Tower Run Script for Unix/Linux/Mac

echo "========================================"
echo "  Starting Trout Tower"
echo "========================================"
echo ""

# Check if compiled
if [ ! -f "bin/com/trouttower/Main.class" ]; then
    echo "ERROR: Game not compiled. Please run ./build.sh first."
    exit 1
fi

# Note: This script is for reference. JOGL libraries need to be 
# configured for your specific OS (Linux/Mac)
# The current lib folder contains Windows DLLs only

# Copy scores.dat if not exists
if [ ! -f "bin/scores.dat" ]; then
    cp scores.dat bin/scores.dat
fi

# Run the game (adjust library path for your OS)
echo "Running Trout Tower..."
echo ""
java -Djava.library.path=lib/JOGLwin/lib64 -cp "bin:lib/*" com.trouttower.Main

if [ $? -ne 0 ]; then
    echo ""
    echo "ERROR: Failed to run the game!"
    exit 1
fi

