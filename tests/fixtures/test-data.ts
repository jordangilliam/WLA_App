/**
 * Mock data for testing
 */

export const mockFieldSite = {
  id: 'test-site-1',
  name: 'Test Field Site',
  description: 'A test field site for automated testing',
  location: {
    latitude: 40.4406,
    longitude: -79.9959,
  },
  site_type: 'park',
  address: '123 Test St',
  city: 'Pittsburgh',
  state: 'PA',
};

export const mockObservation = {
  id: 'test-obs-1',
  user_id: 'test-user-1',
  field_site_id: 'test-site-1',
  species_name: 'American Robin',
  notes: 'Test observation',
  photos: [],
  created_at: new Date().toISOString(),
};

export const mockChallenge = {
  id: 'test-challenge-1',
  title: 'Test Challenge',
  description: 'A test challenge',
  challenge_type: 'daily',
  target_metric: 'observations',
  target_count: 5,
  reward_points: 100,
  active: true,
  start_date: new Date().toISOString(),
  end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
};

export const mockMission = {
  id: 'test-mission-1',
  title: 'Test Mission',
  synopsis: 'A test mission',
  difficulty: 'beginner',
  hero_image_url: '/images/test-mission.jpg',
};

export const mockLesson = {
  id: 'test-lesson-1',
  title: 'Test Lesson',
  description: 'A test lesson',
  content: 'Test lesson content',
  difficulty: 'beginner',
  estimated_time: 15,
};

