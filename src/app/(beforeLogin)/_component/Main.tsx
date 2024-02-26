"use client"
import styles from "@/app/(beforeLogin)/_component/main.module.css";
import Image from "next/image";
import nextAuth from "../../../../public/next-auth.png";
import Link from "next/link";
import {signIn, signOut, useSession} from "next-auth/react";

export default function Main() {
    const { data: session } = useSession();

    return (
    <>
      <div className={styles.left}>
        <Image src={nextAuth} alt="logo" />
      </div>

      <div className={styles.right}>
        <h1>Next-Auth Login</h1>
        <h2>지금 가입하세요.</h2>
        <Link href="/signup" className={styles.signup}>계정 만들기</Link>
          {
              (session && session.user) ? (
                  // 로그인 되어있을 경우
                  <>
                      <h3>{session.user.name}님 안녕하세요!</h3>
                      <button className={styles.signup} onClick={()=>signOut()}>
                          {session.user.name}님 LogOut
                      </button>
                  </>

              ) :
                  (
                      <>
                          <h3>이미 가입하셨나요?</h3>
                          {/* Intercepting & Parallel 화면 */}
                          {/*<Link href="/auth/signin" className={styles.signup}>로그인하기</Link>*/}

                          {/* 새로운 페이지(기본 로그인 폼)가 열림 */}
                          <button className={styles.signup} onClick={()=>signIn()}>아이디 로그인</button>

                          {/*페이지 이동 없이 바로 소셜 로그인 */}
                          <button className={`${styles.signup} ${styles.kakao}`} onClick={() => signIn("kakao", { redirect: true, callbackUrl: "/" })}>카카오 로그인</button>
                          <button className={`${styles.signup} ${styles.naver}`} onClick={() => signIn("naver", { redirect: true, callbackUrl: "/" })}>네이버 로그인</button>
                      </>
                  )
          }

      </div>
    </>
    )
}

