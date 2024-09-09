import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <script
          defer
          src="https://api.pirsch.io/pa.js"
          id="pianjs"
          data-code="hsKXS6s0dnl9ABqti34whB8AZH8yN1MS"
        ></script>
        <script
          src="https://app.suppa.ai/integration/script.js"
          data-api-key="8dd81ab4-7ed9-4c67-86b3-7b11b174a467"
        ></script>
      </Head>
      <Component {...pageProps} />
    </>
  );
}
