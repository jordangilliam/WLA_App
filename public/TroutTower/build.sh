#!/bin/bash
# Trout Tower Build Script for Unix/Linux/Mac

echo "========================================"
echo "  Building Trout Tower"
echo "========================================"
echo ""

# Clean previous builds
if [ -d "bin" ]; then
    echo "Cleaning previous build..."
    rm -rf bin
fi
mkdir bin

# Compile Java source files
echo "Compiling source files..."
javac -cp "lib/*" -sourcepath src -d bin \
    src/com/trouttower/Main.java \
    src/com/bakar/assest/opengl/*.java \
    src/com/bakar/assest/opengl/outsource/texture/*.java \
    src/com/bakar/assest/opengl/shapes/*.java \
    src/com/bakar/assest/opengl/texture/*.java

if [ $? -ne 0 ]; then
    echo ""
    echo "ERROR: Compilation failed!"
    exit 1
fi

# Copy resources
echo "Copying resources..."
cp -r src/assets bin/

echo ""
echo "========================================"
echo "  Build successful!"
echo "========================================"
echo ""
echo "To run the game, execute: ./run.sh"
echo ""

