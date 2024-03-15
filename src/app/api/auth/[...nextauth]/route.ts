import NextAuth from 'next-auth/next'
import CredentialsProvider from 'next-auth/providers/credentials'
import KakaoProvider from "next-auth/providers/kakao";
import NaverProvider from "next-auth/providers/naver";

const handler = NextAuth({
    providers: [
        KakaoProvider({
            clientId: process?.env?.KAKAO_CLIENT_ID!,
            clientSecret: process.env.KAKAO_CLIENT_SECRET!
        }),

        NaverProvider({
            clientId: process.env.NAVER_CLIENT_ID!,
            clientSecret: process.env.NAVER_CLIENT_SECRET!
        }),
        CredentialsProvider({
          name: 'Credentials',
          credentials: {
            username: { label: '이메일', type: 'text', placeholder: '이메일 주소를 입력해 주세요.' },
            password: { label: '비밀번호', type: 'password' },
          },

          async authorize(credentials, req) {
            const res = await fetch(`${process.env.NEXTAUTH_URL}/api/signin`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                  username: credentials?.username,
                  password: credentials?.password,
              }),
            })

            const user = await res.json()

            if (user) {
                // Any object returned will be saved in `user` property of the JWT
                return user
            } else {
                // If you return null then an error will be displayed advising the user to check their details.
                return null

                // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
            }

          },
        })
    ],
    callbacks:{

      // token: Next.js JWT 토큰 , user: authorize() 반환값
      async jwt({ token, user }) {

        // 리턴된 값은 토큰에 저장된다.
        return { ...token, ...user };
      },

      // session: next-auth session , token: Next.js JWT 토큰
      async session({ session, token }) {
        session.user = token as any;

        return session;
      },
    },

    // pages:{
    //     signIn: '/auth/signin'
    // }
})

export { handler as GET, handler as POST }