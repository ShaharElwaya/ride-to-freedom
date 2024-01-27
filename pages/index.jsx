import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import axios from "axios";
import { useRouter } from 'next/router'; // Import useRouter from next/router

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  
  const router = useRouter();

  const body = {
    name: "Google I/O 2015",
    date: "2024-01-11T17:00:00-07:00",
    location: "800 Howard St., San Francisco, CA 94103",
    description: "A chance to hear more about Google\'s developer products.",
    users: [
      'mayavivi1412@gmail.com',
      'shahar.al22@gmail.com',
      'orreuven1243@gmail.com',
    ]
  };
  const handleClick = async () => {
    const res = await axios.post("api/google", body);
    console.log("🚀 ~ handleClick ~ res:", res)
  };

  const handleClickPatient = () => {
    router.push(`/lessonSummary/summariesPatientLessons?patientId=${encodeURIComponent(12)}`);
  };

  const handleClickLogin = async (e) => {
    e.preventDefault()
    try {
      const email = e.target[0].value
      const password = e.target[1].value
      const res = await axios.post("api/login", {email, password});
      alert('Login successful!')
    }catch(err) {
      alert('Incorrect credenetials!')
    }
  };

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
        <div className={styles.description}>
          <p>
            Get started by editing&nbsp;
            <code className={styles.code}>pages/index.js</code>
          </p>
          <div>
            <a
              href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
            >
              By{" "}
              <Image
                src="/vercel.svg"
                alt="Vercel Logo"
                className={styles.vercelLogo}
                width={100}
                height={24}
                priority
              />
            </a>
          </div>
        </div>

        <div className={styles.center}>
          <Image
            className={styles.logo}
            src="/next.svg"
            alt="Next.js Logo"
            width={180}
            height={37}
            priority
          />
        </div>

        <div className={styles.grid}>
          <a
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2>
              Docs <span>-&gt;</span>
            </h2>
            <p>
              Find in-depth information about Next.js features and&nbsp;API.
            </p>
          </a>

          <a
            href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2>
              Learn <span>-&gt;</span>
            </h2>
            <p>
              Learn about Next.js in an interactive course with&nbsp;quizzes!
            </p>
          </a>

          <a
            href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2>
              Templates <span>-&gt;</span>
            </h2>
            <p>
              Discover and deploy boilerplate example Next.js&nbsp;projects.
            </p>
          </a>

          <a
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2>
              Deploy <span>-&gt;</span>
            </h2>
            <p>
              Instantly deploy your Next.js site to a shareable URL
              with&nbsp;Vercel.
            </p>
          </a>
        </div>
        <button onClick={handleClick}>Click to add meeting</button>
        <button onClick={handleClickPatient}>patients example</button>
        <form onSubmit={handleClickLogin}>
          <input type="email" />
          <input type="password" />
          <button>Submit</button>
        </form>
      </main>
    </>
  );
}
