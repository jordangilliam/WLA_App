# AI Integration Architecture
## Next-Generation Conservation Platform

**Version**: 1.0  
**Last Updated**: October 12, 2025

---

## 🎯 Overview

This document outlines the AI/ML integration strategy for the WLA Ambassadors App, focusing on open-source tools and models that enhance learning, engagement, and species identification.

---

## 🧠 AI Capabilities

### 1. Computer Vision (Species Identification)

#### Primary Use Cases
- Real-time species identification from photos
- Plant identification in the field
- Wildlife detection and tracking
- Habitat type classification

#### Technology Stack

**Browser-Based (Client-Side)**
```javascript
// TensorFlow.js for in-browser inference
- Model: MobileNet V2 / EfficientNet-Lite
- Size: ~5-10MB (optimized for mobile)
- Speed: <1s inference on modern devices
- Offline capable: Yes
```

**Server-Side (Higher Accuracy)**
```python
// Python backend with PyTorch/ONNX
- Models: ResNet50, EfficientNet, Vision Transformer
- Custom fine-tuned on PA species
- API response time: ~2-3s
- Confidence scoring and multi-species detection
```

**Third-Party APIs (Validation)**
```
- iNaturalist API (species validation)
- PlantNet API (plant identification)
- Merlin Bird ID integration (birds)
- GBIF API (species data)
```

#### Implementation Example

```typescript
// lib/ai/species-identification.ts

import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';

export class SpeciesIdentifier {
  private model: tf.GraphModel | null = null;
  private labels: string[] = [];

  async loadModel() {
    // Load pre-trained model
    this.model = await tf.loadGraphModel('/models/species-classifier/model.json');
    
    // Load species labels
    const response = await fetch('/models/species-classifier/labels.json');
    this.labels = await response.json();
  }

  async identifySpecies(imageElement: HTMLImageElement) {
    if (!this.model) {
      throw new Error('Model not loaded');
    }

    // Preprocess image
    const tensor = tf.browser
      .fromPixels(imageElement)
      .resizeBilinear([224, 224])
      .expandDims(0)
      .toFloat()
      .div(255.0);

    // Run inference
    const predictions = await this.model.predict(tensor) as tf.Tensor;
    const probabilities = await predictions.data();

    // Get top 5 predictions
    const top5 = Array.from(probabilities)
      .map((prob, index) => ({
        species: this.labels[index],
        confidence: prob,
      }))
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 5);

    // Cleanup
    tensor.dispose();
    predictions.dispose();

    return top5;
  }

  async validateWithAPI(imageUrl: string, topPrediction: string) {
    // Use iNaturalist API for validation
    const response = await fetch('/api/ai/validate-species', {
      method: 'POST',
      body: JSON.stringify({ imageUrl, prediction: topPrediction }),
    });

    return response.json();
  }
}
```

---

### 2. Natural Language Processing (AI Tutor)

#### Primary Use Cases
- Answer conservation questions
- Explain species information
- Guide learning paths
- Provide field tips and safety information

#### Technology Stack

**Local LLM (Privacy-First)**
```
- Ollama (local inference)
- Models: Llama 3, Mistral, Phi-3
- Custom fine-tuned on conservation content
- No data sent to cloud
- Runs on user's device or edge server
```

**Embeddings & Semantic Search**
```
- Model: all-MiniLM-L6-v2
- Use case: Content recommendations
- Vector database: Pinecone/Weaviate (lite)
- Enables natural language content search
```

#### Implementation Example

```typescript
// lib/ai/conservation-tutor.ts

export class ConservationTutor {
  private ollamaEndpoint = 'http://localhost:11434/api/generate';

  async askQuestion(question: string, context?: string) {
    const prompt = this.buildPrompt(question, context);

    const response = await fetch(this.ollamaEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'conservation-assistant', // Custom fine-tuned model
        prompt,
        stream: true,
      }),
    });

    return this.streamResponse(response);
  }

  private buildPrompt(question: string, context?: string) {
    return `You are a helpful conservation education assistant for youth in Pennsylvania.
    
Context: ${context || 'General conservation question'}

Student Question: ${question}

Please provide a clear, educational answer suitable for middle and high school students. Include relevant Pennsylvania examples when possible.

Answer:`;
  }

  private async *streamResponse(response: Response) {
    const reader = response.body?.getReader();
    if (!reader) return;

    const decoder = new TextDecoder();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n').filter(Boolean);
      
      for (const line of lines) {
        try {
          const data = JSON.parse(line);
          if (data.response) {
            yield data.response;
          }
        } catch (e) {
          console.error('Parse error:', e);
        }
      }
    }
  }
}
```

---

### 3. Personalized Learning (Recommendation Engine)

#### Primary Use Cases
- Suggest next lessons based on interests and progress
- Recommend locations to visit
- Adaptive difficulty adjustments
- Learning style detection

#### Technology Stack

```
- Collaborative filtering (similar users)
- Content-based filtering (interests)
- Hybrid approach for best results
- Lightweight ML models (scikit-learn)
```

#### Implementation Example

```typescript
// lib/ai/recommendations.ts

export interface RecommendationEngine {
  suggestNextLesson(userId: string): Promise<Lesson[]>;
  suggestLocations(userId: string, currentLocation: Coordinates): Promise<Location[]>;
  adaptDifficulty(userId: string, performanceHistory: number[]): string;
}

export class ContentRecommender implements RecommendationEngine {
  async suggestNextLesson(userId: string): Promise<Lesson[]> {
    // Get user's completed lessons and interests
    const userProfile = await this.getUserLearningProfile(userId);
    
    // Calculate similarity scores
    const allLessons = await this.getAllLessons();
    const scored = allLessons.map(lesson => ({
      lesson,
      score: this.calculateRelevanceScore(lesson, userProfile),
    }));

    // Sort and filter
    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map(s => s.lesson);
  }

  private calculateRelevanceScore(lesson: Lesson, profile: UserLearningProfile): number {
    let score = 0;

    // Interest match (40% weight)
    const interestMatch = lesson.topics.filter(t => 
      profile.interests.includes(t)
    ).length / lesson.topics.length;
    score += interestMatch * 0.4;

    // Difficulty match (30% weight)
    const difficultyMatch = this.matchesDifficultyLevel(
      lesson.difficulty,
      profile.currentLevel
    );
    score += difficultyMatch * 0.3;

    // Prerequisite check (20% weight)
    const hasPrereqs = lesson.prerequisites.every(p =>
      profile.completedLessons.includes(p)
    );
    score += hasPrereqs ? 0.2 : 0;

    // Learning style match (10% weight)
    const styleMatch = lesson.format === profile.preferredFormat ? 1 : 0.5;
    score += styleMatch * 0.1;

    return score;
  }

  async suggestLocations(userId: string, currentLocation: Coordinates): Promise<Location[]> {
    const userProfile = await this.getUserLearningProfile(userId);
    
    // Get nearby locations
    const nearby = await findLocationsWithinRadius(currentLocation, [], 50000);

    // Score based on interests and rarity
    return nearby
      .map(({ location, distance }) => ({
        location,
        score: this.calculateLocationScore(location, userProfile, distance),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map(s => s.location);
  }

  adaptDifficulty(userId: string, performanceHistory: number[]): string {
    // Calculate average performance over last 10 activities
    const recent = performanceHistory.slice(-10);
    const average = recent.reduce((a, b) => a + b, 0) / recent.length;

    // Adaptive difficulty
    if (average >= 90) return 'hard'; // Excelling, increase challenge
    if (average >= 75) return 'medium'; // Doing well
    if (average >= 60) return 'easy'; // Needs support
    return 'easy'; // Struggling, simplify
  }

  private async getUserLearningProfile(userId: string): Promise<UserLearningProfile> {
    // TODO: Fetch from database
    return {
      interests: [],
      completedLessons: [],
      currentLevel: 1,
      preferredFormat: 'visual',
      averageQuizScore: 0,
    };
  }
}
```

---

### 4. Predictive Analytics

#### Use Cases
- Predict which students are at risk of disengagement
- Forecast seasonal species activity
- Optimize challenge timing and difficulty
- Identify high-value intervention opportunities

#### Implementation

```typescript
// lib/ai/analytics.ts

export class PredictiveAnalytics {
  async predictEngagement(userId: string): Promise<EngagementRisk> {
    const activity = await this.getUserActivityPattern(userId);
    
    // Risk factors
    const riskFactors = {
      inactiveDays: activity.daysSinceLastActivity > 7 ? 1 : 0,
      decreasingTrend: activity.weeklyActivityTrend < 0 ? 1 : 0,
      lowCompletion: activity.challengeCompletionRate < 0.3 ? 1 : 0,
      noSocialActivity: activity.friendInteractions === 0 ? 1 : 0,
    };

    const riskScore = Object.values(riskFactors).reduce((a, b) => a + b, 0);

    return {
      userId,
      riskLevel: riskScore >= 3 ? 'high' : riskScore >= 2 ? 'medium' : 'low',
      riskScore,
      recommendations: this.generateRetentionStrategies(riskFactors),
    };
  }

  async predictSpeciesActivity(speciesId: string, location: Coordinates, date: Date) {
    // Use historical observation data + seasonal patterns
    const historicalData = await this.getSpeciesObservations(speciesId, location);
    
    // Simple seasonal model (can be enhanced with ML)
    const month = date.getMonth();
    const seasonalScore = historicalData.byMonth[month] || 0;
    
    return {
      species: speciesId,
      probability: seasonalScore,
      peakMonths: this.findPeakMonths(historicalData),
      recommendedTimes: this.getOptimalTimeOfDay(historicalData),
    };
  }

  private generateRetentionStrategies(riskFactors: any) {
    const strategies = [];

    if (riskFactors.inactiveDays) {
      strategies.push({
        action: 'send_personalized_notification',
        message: 'New challenge available near you!',
      });
    }

    if (riskFactors.noSocialActivity) {
      strategies.push({
        action: 'suggest_team_join',
        message: 'Join a team to compete and collaborate!',
      });
    }

    return strategies;
  }
}
```

---

## 🚀 Deployment Strategy

### Phase 1: Client-Side AI (Immediate)
1. Deploy TensorFlow.js species identifier
2. Implement local embeddings for content search
3. Basic recommendation engine
4. **Benefits**: Fast, private, offline-capable

### Phase 2: Edge AI (Month 2)
1. Deploy Ollama on edge servers
2. Custom fine-tuned models for PA conservation
3. Advanced personalization
4. **Benefits**: Better accuracy, still private

### Phase 3: Hybrid Approach (Month 3+)
1. Client-side for instant feedback
2. Server-side for complex analysis
3. Third-party APIs for validation
4. **Benefits**: Best of all worlds

---

## 📊 Model Training Strategy

### Custom Species Classifier

**Data Collection**
```
- iNaturalist PA observations (public domain)
- GBIF species data
- User-submitted verified photos
- Target: 500+ species, 10,000+ images
```

**Training Pipeline**
```bash
# 1. Data preparation
python scripts/prepare_species_dataset.py \
  --source inaturalist \
  --region PA \
  --min-quality research \
  --output data/species

# 2. Train model
python scripts/train_species_classifier.py \
  --architecture efficientnet_lite \
  --epochs 50 \
  --batch-size 32 \
  --augmentation standard

# 3. Convert to TensorFlow.js
tensorflowjs_converter \
  --input_format keras \
  --output_format tfjs_graph_model \
  models/species_classifier.h5 \
  public/models/species-classifier
```

### Conservation Tutor Fine-Tuning

**Dataset Creation**
```
- WLA course content
- PA conservation guidelines
- Species fact sheets
- Q&A from educators
- Target: 10,000+ Q&A pairs
```

**Fine-Tuning**
```bash
# Using Ollama
ollama create conservation-assistant -f Modelfile

# Modelfile content:
FROM llama3
PARAMETER temperature 0.7
PARAMETER top_p 0.9
SYSTEM You are a conservation education assistant...
```

---

## 🔒 Privacy & Ethics

### Data Privacy
- All personal data encrypted
- AI processing primarily client-side
- Optional cloud processing (opt-in)
- No sharing with third parties
- COPPA compliant

### Model Bias Mitigation
- Diverse training data
- Regular accuracy audits
- Human validation loop
- Transparent confidence scores
- User feedback integration

### Responsible AI Use
- AI assists, doesn't replace learning
- Encourage critical thinking
- Show uncertainty (confidence scores)
- Educational focus, not just gamification

---

## 📈 Success Metrics

### Technical Metrics
- Species ID accuracy: >85% for common species
- Inference latency: <2s average
- Model size: <20MB total
- Offline functionality: 100%

### User Metrics
- AI feature usage rate: >50% of active users
- Species ID satisfaction: >4.0/5.0
- Learning outcome improvement: +15%
- Engagement increase: +25%

---

## 🛠️ Development Roadmap

**Week 1-2**: TensorFlow.js species classifier
**Week 3-4**: Ollama integration for Q&A
**Week 5-6**: Recommendation engine
**Week 7-8**: Testing and refinement
**Week 9-10**: Model training and optimization
**Week 11-12**: Production deployment

---

## 📚 Resources

### Open-Source Models
- **Vision**: EfficientNet, MobileNet, ResNet
- **NLP**: Llama 3, Mistral, Phi-3
- **Embeddings**: all-MiniLM-L6-v2
- **Pre-trained**: iNaturalist models, Merlin Bird ID

### APIs
- iNaturalist: https://api.inaturalist.org
- PlantNet: https://my.plantnet.org
- GBIF: https://www.gbif.org/developer
- eBird: https://documenter.getpostman.com/view/664302/S1ENwy59

### Tools
- TensorFlow.js: https://www.tensorflow.org/js
- Ollama: https://ollama.ai
- Hugging Face: https://huggingface.co
- ONNX Runtime: https://onnxruntime.ai

---

**Next Steps**: Begin with Phase 1 implementation focusing on client-side species identification and basic recommendations.

