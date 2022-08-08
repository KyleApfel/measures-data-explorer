import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.scss'
import Footer from '../components/Footer'
import Link from 'next/link'

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Measures Data Explorer</title>
        <meta name="description" content="Measures Explorer" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <Link href={"/measures-explorer"}><a>Measures Explorer!</a></Link>
        </h1>
        <h2 className={styles.title}>
          ...and <Link href={"/mvp-factory"}><a>MVP Factory</a></Link>
        </h2>

      </main>
      <Footer/>
    </div>
  )
}

export default Home
