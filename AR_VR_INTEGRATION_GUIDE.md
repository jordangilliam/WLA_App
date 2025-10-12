# AR/VR Integration Guide
## Immersive Conservation Experiences

**Version**: 1.0  
**Last Updated**: October 12, 2025

---

## 🎯 Vision

Transform conservation education through immersive AR/VR experiences that bring students closer to nature, even when they can't be physically present in the field.

---

## 🥽 AR (Augmented Reality) Implementation

### Technology Stack

**Web-Based AR (Cross-Platform)**
```
Primary: WebXR Device API
Fallback: AR.js (marker-based)
Advanced: 8th Wall (markerless)
3D Engine: Three.js + A-Frame
```

### AR Use Cases

#### 1. Location-Based AR Content

**Virtual Wildlife at Habitats**
```typescript
// lib/ar/location-ar.ts

import * as THREE from 'three';
import 'aframe';

export class LocationAR {
  private scene: THREE.Scene;
  private camera: THREE.Camera;
  private renderer: THREE.WebGLRenderer;

  async initializeAR(coordinates: Coordinates) {
    // Check AR support
    if (!navigator.xr) {
      throw new Error('WebXR not supported');
    }

    // Initialize AR session
    const session = await navigator.xr.requestSession('immersive-ar', {
      requiredFeatures: ['hit-test', 'dom-overlay'],
      optionalFeatures: ['light-estimation'],
    });

    // Set up Three.js scene
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20);
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    // Configure for AR
    this.renderer.xr.enabled = true;
    this.renderer.xr.setSession(session);

    return session;
  }

  async placeVirtualWildlife(speciesId: string, location: Coordinates) {
    // Load 3D model
    const model = await this.load3DModel(speciesId);

    // Position based on GPS coordinates
    const position = this.gpsToScene(location);
    model.position.set(position.x, position.y, position.z);

    // Add to scene
    this.scene.add(model);

    // Add animation
    this.animateModel(model, speciesId);

    return model;
  }

  private async load3DModel(speciesId: string) {
    // Use GLTFLoader for efficient 3D models
    const loader = new THREE.GLTFLoader();
    const gltf = await loader.loadAsync(`/models/species/${speciesId}.glb`);
    return gltf.scene;
  }

  private gpsToScene(coordinates: Coordinates): THREE.Vector3 {
    // Convert GPS to local AR coordinates
    // This is simplified - real implementation needs proper projection
    return new THREE.Vector3(
      coordinates.longitude * 100,
      0,
      coordinates.latitude * 100
    );
  }

  private animateModel(model: THREE.Object3D, speciesId: string) {
    // Add species-appropriate animations
    // e.g., birds flap wings, fish swim, deer graze
    const animations = {
      bird: () => this.flapWings(model),
      fish: () => this.swimMotion(model),
      deer: () => this.grazingMotion(model),
    };

    // Start animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      // Animation logic here
    };
    animate();
  }
}
```

**A-Frame Component Example**
```html
<!-- AR Wildlife Scene -->
<a-scene embedded arjs='sourceType: webcam; debugUIEnabled: false;'>
  <!-- Camera -->
  <a-camera gps-camera rotation-reader></a-camera>

  <!-- Virtual Bald Eagle at specific location -->
  <a-entity
    gps-entity-place="latitude: 40.2732; longitude: -76.8867"
    gltf-model="/models/bald-eagle.glb"
    scale="2 2 2"
    animation="property: rotation; to: 0 360 0; loop: true; dur: 10000"
  ></a-entity>

  <!-- Educational Info Panel -->
  <a-entity
    gps-entity-place="latitude: 40.2732; longitude: -76.8867"
    geometry="primitive: plane; width: 1; height: 0.5"
    material="color: white; opacity: 0.9"
    text="value: Bald Eagle Habitat\nClick to learn more; align: center"
    position="0 1 0"
  ></a-entity>
</a-scene>
```

#### 2. Species Identification AR

**Point Camera, Get Info Overlay**
```typescript
// lib/ar/species-overlay.ts

export class SpeciesOverlayAR {
  private videoElement: HTMLVideoElement;
  private canvas: HTMLCanvasElement;
  private aiModel: SpeciesIdentifier;

  async startCamera() {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' },
    });

    this.videoElement.srcObject = stream;
    await this.videoElement.play();

    // Start real-time identification
    this.identifyLoop();
  }

  private async identifyLoop() {
    const identify = async () => {
      // Capture frame
      const ctx = this.canvas.getContext('2d')!;
      ctx.drawImage(this.videoElement, 0, 0);

      // Run AI identification
      const results = await this.aiModel.identifySpecies(this.canvas);

      // Show AR overlay with species info
      if (results[0].confidence > 0.7) {
        this.showAROverlay(results[0]);
      }

      requestAnimationFrame(identify);
    };

    identify();
  }

  private showAROverlay(species: SpeciesResult) {
    // Create AR overlay with species information
    const overlay = document.createElement('div');
    overlay.className = 'ar-species-overlay';
    overlay.innerHTML = `
      <div class="ar-card">
        <h2>${species.commonName}</h2>
        <p class="scientific">${species.scientificName}</p>
        <div class="confidence">
          Confidence: ${(species.confidence * 100).toFixed(0)}%
        </div>
        <button onclick="learnMore('${species.id}')">Learn More</button>
      </div>
    `;

    // Position based on detection bounds
    overlay.style.position = 'absolute';
    overlay.style.top = `${species.bounds.y}px`;
    overlay.style.left = `${species.bounds.x}px`;

    document.body.appendChild(overlay);
  }
}
```

#### 3. Field Guide AR

**3D Anatomical Models**
```html
<!-- Interactive 3D Species Model -->
<a-scene embedded>
  <!-- White-tailed Deer Model -->
  <a-entity
    id="deer-model"
    gltf-model="/models/white-tailed-deer.glb"
    position="0 0 -3"
    rotation="0 45 0"
    scale="1 1 1"
  >
    <!-- Clickable anatomical features -->
    <a-entity 
      class="anatomy-hotspot"
      position="0 1.2 0.5"
      geometry="primitive: sphere; radius: 0.05"
      material="color: red; opacity: 0.7"
      animation="property: scale; to: 1.2 1.2 1.2; dir: alternate; loop: true"
      click-handler="showInfo: antlers"
    ></a-entity>

    <a-entity 
      class="anatomy-hotspot"
      position="0.2 0.8 0.3"
      geometry="primitive: sphere; radius: 0.05"
      material="color: red; opacity: 0.7"
      click-handler="showInfo: heart"
    ></a-entity>
  </a-entity>

  <!-- Camera controls -->
  <a-entity camera look-controls orbit-controls></a-entity>

  <!-- Lighting -->
  <a-light type="ambient" intensity="0.5"></a-light>
  <a-light type="directional" position="1 1 1" intensity="0.8"></a-light>
</a-scene>
```

#### 4. Scavenger Hunt AR

**Find Virtual Clues in Real World**
```typescript
// lib/ar/scavenger-hunt.ts

export class ARScavengerHunt {
  private clues: ARClue[] = [];
  private session: XRSession;

  async startHunt(challengeId: string) {
    // Load challenge clues
    this.clues = await this.loadClues(challengeId);

    // Initialize AR session
    this.session = await this.initializeAR();

    // Place clues in the world
    for (const clue of this.clues) {
      await this.placeClue(clue);
    }
  }

  private async placeClue(clue: ARClue) {
    // Place virtual object at GPS location
    const model = await this.createClueModel(clue);
    
    // Add interaction
    model.addEventListener('select', () => {
      this.onClueFound(clue);
    });

    return model;
  }

  private onClueFound(clue: ARClue) {
    // Award points
    // Reveal next clue
    // Show educational content
    
    this.showClueContent(clue);
    
    if (this.isHuntComplete()) {
      this.completeHunt();
    }
  }

  private showClueContent(clue: ARClue) {
    // Display educational AR content
    // Could be 3D model, video, quiz, etc.
  }
}
```

---

## 🎮 VR (Virtual Reality) Implementation

### Technology Stack

```
WebXR API (primary)
Three.js for 3D rendering
A-Frame for scene composition
Support: Quest 2/3, PSVR2, PC VR
```

### VR Experiences

#### 1. Virtual Field Trips

**PA Ecosystem Tours**
```html
<!-- VR Forest Experience -->
<a-scene>
  <!-- Sky and Environment -->
  <a-sky src="/textures/forest-360.jpg"></a-sky>
  
  <!-- Ground -->
  <a-entity
    geometry="primitive: plane; width: 50; height: 50"
    rotation="-90 0 0"
    material="src: /textures/forest-floor.jpg; repeat: 10 10"
  ></a-entity>

  <!-- Trees -->
  <a-entity id="forest">
    <!-- Procedurally generated or hand-placed trees -->
    <a-entity
      gltf-model="/models/oak-tree.glb"
      position="2 0 -3"
      scale="1.5 1.5 1.5"
    ></a-entity>
    <!-- More trees... -->
  </a-entity>

  <!-- Wildlife -->
  <a-entity
    gltf-model="/models/white-tailed-deer.glb"
    position="5 0 -8"
    animation="property: position; to: -5 0 -8; dur: 20000; loop: true"
    sound="src: /audio/deer-sounds.mp3; autoplay: true; loop: true"
  ></a-entity>

  <!-- Interactive Stations -->
  <a-entity
    position="0 1.5 -4"
    geometry="primitive: box; width: 0.5; height: 0.5; depth: 0.1"
    material="color: blue; opacity: 0.8"
    text="value: Learn about Oak Trees; align: center"
    class="info-station"
    cursor-listener
  ></a-entity>

  <!-- VR Camera/Player -->
  <a-entity id="rig" position="0 0 0">
    <a-entity camera look-controls wasd-controls position="0 1.6 0"></a-entity>
    <a-entity
      cursor="rayOrigin: mouse"
      raycaster="objects: .info-station"
    ></a-entity>
  </a-entity>

  <!-- Audio ambiance -->
  <a-entity
    sound="src: /audio/forest-ambiance.mp3; autoplay: true; loop: true; volume: 0.5"
  ></a-entity>
</a-scene>
```

#### 2. Underwater VR Exploration

**Stream and Lake Ecosystems**
```typescript
// lib/vr/underwater-scene.ts

export class UnderwaterVRScene {
  private scene: THREE.Scene;
  private renderer: THREE.WebGLRenderer;

  async createUnderwaterWorld(waterBodyId: string) {
    // Initialize VR session
    const session = await navigator.xr.requestSession('immersive-vr');
    
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x006994, 0.05); // Underwater fog

    // Add water effects
    this.addWaterEffects();

    // Add underwater plants
    this.addAquaticPlants();

    // Add fish and aquatic life
    this.addAquaticLife(waterBodyId);

    // Add interactive elements
    this.addInteractiveStations();

    // Start render loop
    this.renderer.xr.setSession(session);
    this.renderer.setAnimationLoop(this.render.bind(this));
  }

  private addWaterEffects() {
    // Caustics (light patterns)
    const caustics = new THREE.Mesh(
      new THREE.PlaneGeometry(50, 50),
      new THREE.ShaderMaterial({
        // Custom caustics shader
        uniforms: {
          time: { value: 0 },
        },
        vertexShader: `...`,
        fragmentShader: `...`,
      })
    );
    this.scene.add(caustics);

    // Particles (suspended sediment)
    this.addParticles();
  }

  private addAquaticLife(waterBodyId: string) {
    // Load species data for this water body
    const species = this.getWaterBodySpecies(waterBodyId);

    species.forEach(sp => {
      const fish = this.createFishModel(sp);
      
      // Add swimming behavior
      this.addSwimmingAnimation(fish);
      
      // Add interaction
      fish.userData.speciesInfo = sp;
      fish.userData.interactive = true;
      
      this.scene.add(fish);
    });
  }

  private addSwimmingAnimation(fish: THREE.Object3D) {
    // Realistic swimming motion
    const swimPath = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-10, 0, 0),
      new THREE.Vector3(-5, 2, -5),
      new THREE.Vector3(0, 1, -8),
      new THREE.Vector3(5, -1, -5),
      new THREE.Vector3(10, 0, 0),
    ]);

    // Animate along path
    let progress = 0;
    const animate = () => {
      progress = (progress + 0.001) % 1;
      const position = swimPath.getPoint(progress);
      fish.position.copy(position);

      // Orient fish to direction of movement
      const tangent = swimPath.getTangent(progress);
      fish.lookAt(fish.position.clone().add(tangent));
    };

    return animate;
  }
}
```

#### 3. Time-Lapse Ecosystem Changes

**See Seasonal Changes in VR**
```html
<!-- Seasonal Transformation VR -->
<a-scene>
  <a-entity id="ecosystem" seasonal-transition>
    <!-- Spring -->
    <a-entity class="season" data-season="spring" visible="true">
      <a-sky src="/textures/spring-sky.jpg"></a-sky>
      <a-entity gltf-model="/models/spring-forest.glb"></a-entity>
      <a-entity sound="src: /audio/spring-birds.mp3; autoplay: true"></a-entity>
    </a-entity>

    <!-- Summer -->
    <a-entity class="season" data-season="summer" visible="false">
      <a-sky src="/textures/summer-sky.jpg"></a-sky>
      <a-entity gltf-model="/models/summer-forest.glb"></a-entity>
      <a-entity sound="src: /audio/summer-cicadas.mp3"></a-entity>
    </a-entity>

    <!-- Fall -->
    <a-entity class="season" data-season="fall" visible="false">
      <a-sky src="/textures/fall-sky.jpg"></a-sky>
      <a-entity gltf-model="/models/fall-forest.glb"></a-entity>
      <a-entity sound="src: /audio/fall-wind.mp3"></a-entity>
    </a-entity>

    <!-- Winter -->
    <a-entity class="season" data-season="winter" visible="false">
      <a-sky src="/textures/winter-sky.jpg"></a-sky>
      <a-entity gltf-model="/models/winter-forest.glb"></a-entity>
      <a-entity sound="src: /audio/winter-silence.mp3"></a-entity>
    </a-entity>
  </a-entity>

  <!-- UI Controls -->
  <a-gui-flex-container
    flex-direction="column"
    position="0 1.5 -2"
  >
    <a-gui-button
      value="Spring"
      onclick="switchSeason('spring')"
    ></a-gui-button>
    <a-gui-button
      value="Summer"
      onclick="switchSeason('summer')"
    ></a-gui-button>
    <a-gui-button
      value="Fall"
      onclick="switchSeason('fall')"
    ></a-gui-button>
    <a-gui-button
      value="Winter"
      onclick="switchSeason('winter')"
    ></a-gui-button>
  </a-gui-flex-container>
</a-scene>
```

#### 4. Virtual Museum Tours

**Ned Smith Center VR Experience**
```typescript
// lib/vr/museum-tour.ts

export class MuseumVRTour {
  async createMuseumExperience(museumId: string) {
    // Load museum 3D model (photogrammetry or 3D scan)
    const museum = await this.loadMuseum3DModel(museumId);

    // Add artwork and exhibits
    const exhibits = await this.loadExhibits(museumId);
    exhibits.forEach(exhibit => {
      this.placeExhibit(museum, exhibit);
    });

    // Add guided tour system
    this.createGuidedTour();

    // Add interactive elements
    this.addInteractiveDisplays();

    return museum;
  }

  private placeExhibit(museum: THREE.Object3D, exhibit: Exhibit) {
    // Place 3D scanned artwork or photos
    const frame = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 1.5),
      new THREE.MeshStandardMaterial({
        map: new THREE.TextureLoader().load(exhibit.imageUrl),
      })
    );

    frame.position.copy(exhibit.position);
    frame.rotation.copy(exhibit.rotation);

    // Add info placard
    const placard = this.createInfoPlacard(exhibit);
    frame.add(placard);

    // Add interaction
    frame.userData.exhibit = exhibit;
    frame.userData.interactive = true;

    museum.add(frame);
  }

  private createGuidedTour() {
    // Waypoint-based tour system
    const waypoints = this.defineWaypoints();
    
    // Audio narration at each waypoint
    // Auto-teleport or guide path
    // Educational overlays
  }
}
```

---

## 📱 Progressive Web App AR (Cardboard)

**Low-Cost VR Access**
```html
<!-- Google Cardboard Compatible -->
<a-scene>
  <!-- Stereo camera for cardboard -->
  <a-entity camera="active: true">
    <a-entity 
      cursor="fuse: true; fuseTimeout: 2000"
      position="0 0 -1"
      geometry="primitive: ring; radiusInner: 0.02; radiusOuter: 0.03"
      material="color: cyan; shader: flat"
    ></a-entity>
  </a-entity>

  <!-- Simple forest scene optimized for mobile -->
  <a-sky src="/textures/forest-360-lowres.jpg"></a-sky>
  
  <!-- Mobile-optimized models -->
  <a-entity 
    gltf-model="/models/simple-deer.glb"
    position="0 0 -5"
    scale="0.5 0.5 0.5"
  ></a-entity>

  <!-- Gaze-based interaction -->
  <a-entity
    position="2 1.6 -3"
    geometry="primitive: box; width: 0.5; height: 0.5"
    material="color: blue"
    class="gazeable"
    event-set__enter="_event: mouseenter; material.color: yellow"
    event-set__leave="_event: mouseleave; material.color: blue"
    event-set__click="_event: click; visible: false"
  ></a-entity>
</a-scene>
```

---

## 🎨 3D Asset Pipeline

### Creating Optimized 3D Models

**Workflow**
```
1. Source Model (high-poly)
   ↓
2. Retopology (low-poly for real-time)
   ↓
3. UV Unwrapping
   ↓
4. Texture Baking (PBR textures)
   ↓
5. Export as GLB/GLTF
   ↓
6. Compression & Optimization
```

**Tools**
- Blender (free, open-source)
- Sketchfab (free 3D models)
- Photogrammetry (iPhone/Android apps)
- Ready Player Me (avatars)

**Optimization**
```javascript
// Optimize 3D models for web
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/draco/');

const loader = new GLTFLoader();
loader.setDRACOLoader(dracoLoader);

// Load compressed model (50-90% smaller)
const gltf = await loader.loadAsync('/models/species/deer-compressed.glb');
```

---

## 📊 Performance Optimization

### Best Practices

**General**
- Target 60 FPS for VR (90 FPS for high-end headsets)
- Keep models under 100k triangles
- Use texture atlases
- Implement LOD (Level of Detail)
- Frustum culling
- Occlusion culling

**Mobile AR**
- Limit to 20k-50k triangles per scene
- Use compressed textures (Basis Universal)
- Implement aggressive LOD
- Minimize draw calls
- Use instancing for repeated objects

**Code Example**
```typescript
// LOD (Level of Detail) System
export function setupLOD(model: THREE.Object3D) {
  const lod = new THREE.LOD();

  // High detail (close)
  lod.addLevel(model.getObjectByName('high'), 0);
  
  // Medium detail (mid-range)
  lod.addLevel(model.getObjectByName('medium'), 10);
  
  // Low detail (far)
  lod.addLevel(model.getObjectByName('low'), 25);

  return lod;
}
```

---

## 🚀 Deployment Strategy

### Phase 1: Basic AR (Weeks 1-4)
- Marker-based AR with AR.js
- Species ID overlay
- Simple 3D models
- **Device Support**: All modern smartphones

### Phase 2: Advanced AR (Weeks 5-8)
- WebXR location-based AR
- Scavenger hunts
- Educational overlays
- **Device Support**: WebXR-capable devices

### Phase 3: VR Experiences (Weeks 9-12)
- Virtual field trips
- Museum tours
- Underwater exploration
- **Device Support**: VR headsets + Cardboard

### Phase 4: Polish & Scale (Weeks 13-16)
- Performance optimization
- More 3D assets
- User-generated AR content
- **Device Support**: All platforms

---

## 📚 Learning Resources

- WebXR Spec: https://immersiveweb.dev
- A-Frame: https://aframe.io
- Three.js: https://threejs.org
- AR.js: https://ar-js-org.github.io/AR.js-Docs/
- 8th Wall: https://www.8thwall.com

---

**Ready to bring conservation to life in AR/VR! 🌲🦌**

