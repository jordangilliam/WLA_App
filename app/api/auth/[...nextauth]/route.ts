import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import AzureADProvider from "next-auth/providers/azure-ad";

const authOptions: NextAuthOptions = {
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
    async jwt({ token, account, profile }) {
      if (account && account.provider === "google") {
        token.access_token = account.access_token;
        token.refresh_token = account.refresh_token;
      }
      if (account && account.provider === "azure-ad") {
        token.ms_access_token = account.access_token;
        token.ms_refresh_token = account.refresh_token;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        (session as any).access_token = token.access_token;
        (session as any).refresh_token = token.refresh_token;
        (session as any).ms_access_token = (token as any).ms_access_token;
        (session as any).ms_refresh_token = (token as any).ms_refresh_token;
      }
      return session;
    }
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
