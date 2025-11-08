/**
 * Terms of Service page for FieldQuest
 */

import React from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { Stack, useRouter } from 'expo-router'

export default function TermsOfServiceScreen() {
  const router = useRouter()

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Terms of Service',
          headerBackTitle: 'Back',
        }}
      />
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>FieldQuest Terms of Service</Text>
          <Text style={styles.lastUpdated}>Effective Date: November 8, 2024</Text>

          <Text style={styles.intro}>
            Welcome to FieldQuest! These Terms of Service ("Terms") govern your use of the
            FieldQuest mobile application. By using FieldQuest, you agree to these Terms.
          </Text>

          {/* Section 1 */}
          <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
          <Text style={styles.paragraph}>
            By downloading, installing, or using FieldQuest, you agree to be bound by these
            Terms. If you do not agree, do not use the app.{'\n\n'}
            For users under 18, a parent, guardian, or teacher must agree to these Terms on
            your behalf.
          </Text>

          {/* Section 2 */}
          <Text style={styles.sectionTitle}>2. Description of Service</Text>
          <Text style={styles.paragraph}>
            FieldQuest is an educational location-based game that teaches users about
            Pennsylvania wildlife and conservation through exploration of real-world field
            sites.{'\n\n'}
            Features include:{'\n'}
            • Species collection and tracking{'\n'}
            • Location-based encounters{'\n'}
            • Field site exploration{'\n'}
            • Educational content{'\n'}
            • Teacher-created field trip events
          </Text>

          {/* Section 3 */}
          <Text style={styles.sectionTitle}>3. User Accounts</Text>
          <Text style={styles.paragraph}>
            To use FieldQuest, you must create an account:{'\n\n'}
            • You are responsible for maintaining account security{'\n'}
            • You must provide accurate information{'\n'}
            • One account per person{'\n'}
            • Do not share your account credentials{'\n'}
            • Notify us immediately of unauthorized access
          </Text>

          {/* Section 4 */}
          <Text style={styles.sectionTitle}>4. Age Requirements</Text>
          <Text style={styles.paragraph}>
            FieldQuest is designed for students in grades K-12:{'\n\n'}
            • Users under 13 require school/parent consent{'\n'}
            • Teachers act as intermediaries for student accounts{'\n'}
            • We comply with COPPA requirements{'\n'}
            • Parents can request account deletion at any time
          </Text>

          {/* Section 5 */}
          <Text style={styles.sectionTitle}>5. Acceptable Use</Text>
          
          <Text style={styles.subsectionTitle}>You MAY:</Text>
          <Text style={styles.paragraph}>
            • Use FieldQuest for personal educational purposes{'\n'}
            • Participate in teacher-organized activities{'\n'}
            • Share your collection progress with classmates{'\n'}
            • Provide feedback and report bugs
          </Text>

          <Text style={styles.subsectionTitle}>You MAY NOT:</Text>
          <Text style={styles.paragraph}>
            • Cheat, hack, or exploit the game{'\n'}
            • Use GPS spoofing or location manipulation{'\n'}
            • Share or sell your account{'\n'}
            • Harass or bully other users{'\n'}
            • Trespass on private property{'\n'}
            • Play while driving or in unsafe situations{'\n'}
            • Reverse engineer or copy the app{'\n'}
            • Use the app for commercial purposes
          </Text>

          {/* Section 6 */}
          <Text style={styles.sectionTitle}>6. Safety Guidelines</Text>
          
          <Text style={styles.highlight}>
            ⚠️ IMPORTANT SAFETY RULES
          </Text>
          
          <Text style={styles.paragraph}>
            • Always be aware of your surroundings{'\n'}
            • Never trespass on private property{'\n'}
            • Do not play while driving{'\n'}
            • Obey all traffic laws and signals{'\n'}
            • Stay in safe, well-lit public areas{'\n'}
            • Younger users should be accompanied by an adult{'\n'}
            • Respect wildlife and natural habitats{'\n'}
            • Follow all posted rules at field sites
          </Text>

          <Text style={styles.paragraph}>
            Wildlife Leadership Academy and FieldQuest are not responsible for accidents,
            injuries, or incidents that occur while playing.
          </Text>

          {/* Section 7 */}
          <Text style={styles.sectionTitle}>7. Cheating and Fair Play</Text>
          <Text style={styles.paragraph}>
            We take fair play seriously:{'\n\n'}
            • GPS spoofing is prohibited and detected{'\n'}
            • Suspicious activity is logged and reviewed{'\n'}
            • Cheating may result in account suspension{'\n'}
            • All game mechanics are server-validated{'\n'}
            • Report suspected cheaters to support
          </Text>

          {/* Section 8 */}
          <Text style={styles.sectionTitle}>8. Teacher and School Use</Text>
          <Text style={styles.paragraph}>
            Teachers using FieldQuest for educational purposes:{'\n\n'}
            • Must obtain necessary permissions from parents/guardians{'\n'}
            • Are responsible for student supervision during field trips{'\n'}
            • Can create events and manage class rosters{'\n'}
            • Should follow school policies and procedures{'\n'}
            • Must comply with FERPA and other education privacy laws
          </Text>

          {/* Section 9 */}
          <Text style={styles.sectionTitle}>9. Intellectual Property</Text>
          <Text style={styles.paragraph}>
            All content in FieldQuest is owned by Wildlife Leadership Academy or licensed:{'\n\n'}
            • App code, design, and graphics{'\n'}
            • Species information and images{'\n'}
            • Educational content{'\n'}
            • Logos and trademarks{'\n\n'}
            You may not copy, modify, or distribute any FieldQuest content without permission.
          </Text>

          {/* Section 10 */}
          <Text style={styles.sectionTitle}>10. Privacy</Text>
          <Text style={styles.paragraph}>
            Your use of FieldQuest is subject to our Privacy Policy, which explains how we
            collect, use, and protect your personal information.{'\n\n'}
            By using FieldQuest, you consent to our data practices as described in the
            Privacy Policy.
          </Text>

          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => router.push('/privacy')}
          >
            <Text style={styles.linkButtonText}>View Privacy Policy →</Text>
          </TouchableOpacity>

          {/* Section 11 */}
          <Text style={styles.sectionTitle}>11. Modifications to Service</Text>
          <Text style={styles.paragraph}>
            We reserve the right to:{'\n\n'}
            • Modify or discontinue features{'\n'}
            • Update game mechanics and balance{'\n'}
            • Add or remove content{'\n'}
            • Change these Terms with notice{'\n\n'}
            Continued use after changes constitutes acceptance of updated Terms.
          </Text>

          {/* Section 12 */}
          <Text style={styles.sectionTitle}>12. Account Termination</Text>
          <Text style={styles.paragraph}>
            We may suspend or terminate your account if:{'\n\n'}
            • You violate these Terms{'\n'}
            • You cheat or exploit the game{'\n'}
            • You engage in harmful behavior{'\n'}
            • Required by law{'\n\n'}
            You may delete your account at any time in app settings.
          </Text>

          {/* Section 13 */}
          <Text style={styles.sectionTitle}>13. Disclaimer of Warranties</Text>
          <Text style={styles.paragraph}>
            FieldQuest is provided "AS IS" and "AS AVAILABLE":{'\n\n'}
            • No guarantees of uptime or availability{'\n'}
            • May contain bugs or errors{'\n'}
            • No warranty of fitness for any purpose{'\n'}
            • We are not liable for data loss or damage
          </Text>

          {/* Section 14 */}
          <Text style={styles.sectionTitle}>14. Limitation of Liability</Text>
          <Text style={styles.paragraph}>
            TO THE MAXIMUM EXTENT PERMITTED BY LAW:{'\n\n'}
            Wildlife Leadership Academy is not liable for:{'\n'}
            • Personal injuries while using the app{'\n'}
            • Property damage{'\n'}
            • Lost or stolen devices{'\n'}
            • Loss of data or progress{'\n'}
            • Indirect, incidental, or consequential damages
          </Text>

          {/* Section 15 */}
          <Text style={styles.sectionTitle}>15. Indemnification</Text>
          <Text style={styles.paragraph}>
            You agree to indemnify and hold harmless Wildlife Leadership Academy from claims
            arising from:{'\n\n'}
            • Your use of FieldQuest{'\n'}
            • Your violation of these Terms{'\n'}
            • Your violation of any laws or third-party rights
          </Text>

          {/* Section 16 */}
          <Text style={styles.sectionTitle}>16. Governing Law</Text>
          <Text style={styles.paragraph}>
            These Terms are governed by the laws of the Commonwealth of Pennsylvania,
            without regard to conflict of law provisions.
          </Text>

          {/* Section 17 */}
          <Text style={styles.sectionTitle}>17. Contact Us</Text>
          <Text style={styles.paragraph}>
            Questions about these Terms?{'\n\n'}
            Wildlife Leadership Academy{'\n'}
            Email: support@wildlifeleadershipacademy.org{'\n'}
            Website: wildlifeleadershipacademy.org
          </Text>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              By using FieldQuest, you acknowledge that you have read, understood, and agree
              to be bound by these Terms of Service.
            </Text>
          </View>

          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
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
    fontSize: 16,
    color: '#E74C3C',
    lineHeight: 24,
    backgroundColor: '#FFEBEE',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  linkButton: {
    backgroundColor: '#3498DB',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginVertical: 16,
  },
  linkButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
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

