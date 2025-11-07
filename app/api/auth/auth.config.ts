import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import AzureADProvider from "next-auth/providers/azure-ad";
import { supabaseAdmin } from "@/lib/db/client";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          scope: "openid email profile https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/spreadsheets",
          access_type: "offline",
          prompt: "consent"
        }
      }
    }),
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID || "",
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET || "",
      tenantId: process.env.AZURE_AD_TENANT_ID || "common",
      authorization: { params: { scope: "openid profile email offline_access Files.ReadWrite", prompt: "consent" } }
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, account, profile }) {
      // Create or update user in Supabase on first sign-in
      if (!supabaseAdmin || !user.email) {
        return true; // Allow sign-in even if DB fails (will retry on next access)
      }

      try {
        // Check if user already exists
        const { data: existingUser, error: checkError } = await supabaseAdmin
          .from('users')
          .select('id, email, name')
          .eq('email', user.email)
          .maybeSingle();

        if (checkError) {
          console.error('Error checking user:', checkError);
          return true; // Allow sign-in anyway
        }

        if (!existingUser) {
          // Create new user in Supabase
          const { error: insertError } = await supabaseAdmin
            .from('users')
            .insert({
              email: user.email,
              name: user.name || user.email.split('@')[0],
              avatar_url: user.image,
              role: 'student', // Default role - can be changed by admin
              auth_provider: account?.provider || 'email',
            });

          if (insertError) {
            console.error('Error creating user in Supabase:', insertError);
            // Still allow sign-in - they can try again
          } else {
            console.log(`✅ Created new user in Supabase: ${user.email}`);
          }
        } else {
          // Update last sign-in timestamp
          await supabaseAdmin
            .from('users')
            .update({ 
              last_login_at: new Date().toISOString(),
              avatar_url: user.image // Update avatar if changed
            })
            .eq('email', user.email);
        }

        return true;
      } catch (error) {
        console.error('Error in signIn callback:', error);
        return true; // Allow sign-in anyway
      }
    },
    async jwt({ token, account, profile, user }) {
      // Store access tokens for external APIs
      if (account && account.provider === "google") {
        token.access_token = account.access_token;
        token.refresh_token = account.refresh_token;
      }
      if (account && account.provider === "azure-ad") {
        token.ms_access_token = account.access_token;
        token.ms_refresh_token = account.refresh_token;
      }

      // Load user details from Supabase
      if (user && user.email && supabaseAdmin) {
        try {
          const { data: dbUser } = await supabaseAdmin
            .from('users')
            .select('id, role, name')
            .eq('email', user.email)
            .maybeSingle();

          if (dbUser) {
            token.userId = dbUser.id;
            token.role = dbUser.role;
            token.name = dbUser.name;
          }
        } catch (error) {
          console.error('Error loading user from DB:', error);
        }
      }

      return token;
    },
    async session({ session, token }) {
      // Add custom fields to session
      if (token) {
        (session as any).access_token = token.access_token;
        (session as any).refresh_token = token.refresh_token;
        (session as any).ms_access_token = (token as any).ms_access_token;
        (session as any).ms_refresh_token = (token as any).ms_refresh_token;
        
        // Add user details from token
        if (session.user) {
          (session.user as any).id = token.userId;
          (session.user as any).role = token.role || 'student';
        }
      }
      return session;
    }
  }
};

