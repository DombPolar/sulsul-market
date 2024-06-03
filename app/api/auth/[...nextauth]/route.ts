import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({  
	providers: [
  GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "", // clientId가 항상 string이어야 한다.
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "", 

	  }),
	],
});

export { handler as GET, handler as POST };