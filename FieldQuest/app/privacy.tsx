/**
 * Privacy Policy page for FieldQuest
 * COPPA compliant, explains data collection and usage
 */

import React from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { Stack, useRouter } from 'expo-router'

export default function PrivacyPolicyScreen() {
  const router = useRouter()

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Privacy Policy',
          headerBackTitle: 'Back',
        }}
      />
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>FieldQuest Privacy Policy</Text>
          <Text style={styles.lastUpdated}>Last Updated: November 8, 2024</Text>

          <Text style={styles.intro}>
            FieldQuest is committed to protecting your privacy and complying with all applicable
            privacy laws, including the Children's Online Privacy Protection Act (COPPA).
          </Text>

          {/* Section 1 */}
          <Text style={styles.sectionTitle}>1. Information We Collect</Text>
          
          <Text style={styles.subsectionTitle}>Account Information</Text>
          <Text style={styles.paragraph}>
            • Name and email address (provided during account creation){'\n'}
            • Grade level (optional, for age-appropriate content){'\n'}
            • School/organization affiliation (when joining a class){'\n'}
            • Profile preferences and settings
          </Text>

          <Text style={styles.subsectionTitle}>Location Data</Text>
          <Text style={styles.paragraph}>
            • Your approximate location to show nearby wildlife and field sites{'\n'}
            • Location history for game mechanics (species catches, site visits){'\n'}
            • All location data is stored securely and never sold to third parties{'\n'}
            • Precise coordinates are redacted in logs for privacy
          </Text>

          <Text style={styles.subsectionTitle}>Game Activity</Text>
          <Text style={styles.paragraph}>
            • Species caught and collection progress{'\n'}
            • Field sites visited and interaction history{'\n'}
            • XP, level, and achievement data{'\n'}
            • Encounter outcomes and statistics
          </Text>

          <Text style={styles.subsectionTitle}>Device Information</Text>
          <Text style={styles.paragraph}>
            • Device type and operating system{'\n'}
            • App version and crash reports{'\n'}
            • Notification preferences
          </Text>

          {/* Section 2 */}
          <Text style={styles.sectionTitle}>2. How We Use Your Information</Text>
          
          <Text style={styles.paragraph}>
            We use your information to:{'\n\n'}
            • Provide the FieldQuest game experience{'\n'}
            • Show you nearby wildlife and field sites{'\n'}
            • Track your collection progress and statistics{'\n'}
            • Enable teacher-created field trip events{'\n'}
            • Send notifications about nearby rare species (if enabled){'\n'}
            • Improve the app and fix bugs{'\n'}
            • Provide customer support{'\n'}
            • Comply with legal obligations
          </Text>

          {/* Section 3 */}
          <Text style={styles.sectionTitle}>3. Children's Privacy (COPPA Compliance)</Text>
          
          <Text style={styles.paragraph}>
            FieldQuest is designed for students in grades K-12, including children under 13.
            We comply with COPPA requirements:{'\n\n'}
            • We collect minimal personal information from children{'\n'}
            • Parental consent is obtained through schools/teachers{'\n'}
            • Location data is only used for game mechanics{'\n'}
            • We do not share children's data with third parties{'\n'}
            • Parents can request deletion of their child's data at any time
          </Text>

          <Text style={styles.highlight}>
            Teachers and schools act as intermediaries and are responsible for obtaining
            appropriate parental consent before students use FieldQuest.
          </Text>

          {/* Section 4 */}
          <Text style={styles.sectionTitle}>4. Data Sharing and Disclosure</Text>
          
          <Text style={styles.paragraph}>
            We do NOT sell your personal information to anyone.{'\n\n'}
            We may share limited data with:{'\n\n'}
            • Teachers: Can see their students' game progress and participation{'\n'}
            • Service Providers: Supabase (database), Mapbox (maps) - bound by
            strict privacy agreements{'\n'}
            • Legal Requirements: If required by law or to protect safety
          </Text>

          {/* Section 5 */}
          <Text style={styles.sectionTitle}>5. Data Security</Text>
          
          <Text style={styles.paragraph}>
            We implement industry-standard security measures:{'\n\n'}
            • Encrypted data transmission (HTTPS/TLS){'\n'}
            • Secure database with row-level security{'\n'}
            • Regular security audits{'\n'}
            • Anti-cheat and fraud detection{'\n'}
            • Minimal data retention (only what's needed)
          </Text>

          {/* Section 6 */}
          <Text style={styles.sectionTitle}>6. Your Rights and Choices</Text>
          
          <Text style={styles.paragraph}>
            You have the right to:{'\n\n'}
            • Access your personal information{'\n'}
            • Correct inaccurate information{'\n'}
            • Delete your account and data{'\n'}
            • Opt out of notifications{'\n'}
            • Disable location tracking{'\n'}
            • Request a copy of your data
          </Text>

          <Text style={styles.highlight}>
            To exercise these rights, contact us at privacy@wildlifeleadershipacademy.org
          </Text>

          {/* Section 7 */}
          <Text style={styles.sectionTitle}>7. Location Services</Text>
          
          <Text style={styles.paragraph}>
            FieldQuest requires location access to function:{'\n\n'}
            • Foreground location: Shows nearby wildlife while app is open{'\n'}
            • Background location (optional): Checks for rare spawns every 10 minutes{'\n'}
            • You can disable location access in your device settings{'\n'}
            • Disabling location will prevent core game features from working
          </Text>

          {/* Section 8 */}
          <Text style={styles.sectionTitle}>8. Third-Party Services</Text>
          
          <Text style={styles.paragraph}>
            FieldQuest uses these third-party services:{'\n\n'}
            • Supabase: Database and authentication{'\n'}
            • Mapbox: Map display and location services{'\n'}
            • Expo: App development platform{'\n\n'}
            Each service has its own privacy policy. We only share data necessary for
            the service to function.
          </Text>

          {/* Section 9 */}
          <Text style={styles.sectionTitle}>9. Data Retention</Text>
          
          <Text style={styles.paragraph}>
            • Active accounts: Data retained while account is active{'\n'}
            • Inactive accounts: Deleted after 3 years of inactivity{'\n'}
            • Deleted accounts: Data permanently deleted within 30 days{'\n'}
            • Anonymous usage data: May be retained for analytics
          </Text>

          {/* Section 10 */}
          <Text style={styles.sectionTitle}>10. Changes to This Policy</Text>
          
          <Text style={styles.paragraph}>
            We may update this privacy policy from time to time. We will notify you of
            significant changes through the app or by email. Continued use of FieldQuest
            after changes constitutes acceptance of the updated policy.
          </Text>

          {/* Section 11 */}
          <Text style={styles.sectionTitle}>11. Contact Us</Text>
          
          <Text style={styles.paragraph}>
            If you have questions about this privacy policy or your data:{'\n\n'}
            Wildlife Leadership Academy{'\n'}
            Email: privacy@wildlifeleadershipacademy.org{'\n'}
            Website: wildlifeleadershipacademy.org{'\n\n'}
            For COPPA-related questions, parents and guardians should contact their
            child's teacher or school administrator.
          </Text>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              By using FieldQuest, you acknowledge that you have read and understood this
              Privacy Policy.
            </Text>
          </View>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Back to App</Text>
          </TouchableOpacity>

          <View style={styles.spacer} />
        </View>
      </ScrollView>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 8,
  },
  lastUpdated: {
    fontSize: 14,
    color: '#95A5A6',
    marginBottom: 24,
  },
  intro: {
    fontSize: 16,
    color: '#34495E',
    lineHeight: 24,
    marginBottom: 32,
    backgroundColor: '#E8F5E9',
    padding: 16,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#27AE60',
    marginTop: 24,
    marginBottom: 12,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginTop: 16,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 15,
    color: '#34495E',
    lineHeight: 24,
    marginBottom: 16,
  },
  highlight: {
    fontSize: 15,
    color: '#D97706',
    lineHeight: 24,
    backgroundColor: '#FFF7ED',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    fontWeight: '500',
  },
  footer: {
    backgroundColor: '#F5F7FA',
    padding: 20,
    borderRadius: 12,
    marginTop: 32,
    marginBottom: 24,
  },
  footerText: {
    fontSize: 14,
    color: '#7F8C8D',
    lineHeight: 20,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  backButton: {
    backgroundColor: '#27AE60',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  spacer: {
    height: 40,
  },
})

