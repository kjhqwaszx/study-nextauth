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
                console.log('$$$user: ', user)

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

        /**
         * JWT Callback
         * 웹 토큰이 실행 혹은 업데이트 될 때마다 콜백이 실행
         * 반환된 값은 암호화되어 쿠키에 저장됨
         */

        async jwt({ token, user, account }) {
            return { ...token, ...user};
        },
        /**
         * Session Callback
         * ClientSide에서 NextAuth에 세션을 체크할때마다 실행
         * 반환된 값은 useSession을 통해 ClientSide에서 사용할 수 있음
         * JWT 토큰의 정보를 Session에 유지 시킨다.
         */
        async session({ session, token }) {
            console.log('$$$ token: ', token)
            session.user = token as any;
            console.log('$$$ session: ', session)
            return session;
        },
    },

    // pages:{
    //     signIn: '/auth/signin'
    // }
})

export { handler as GET, handler as POST }