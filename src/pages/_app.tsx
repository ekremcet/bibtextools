import "@/styles/globals.css";
import type {AppProps} from "next/app";
import Head from "next/head";

export default function App({Component, pageProps}: AppProps) {
    return (
        <>
            <Head>
                <script defer src="https://api.pirsch.io/pa.js"
                        id="pianjs"
                        data-code="FnDxizwlunzCVNodkM83pW53biTjhObt"></script>
            </Head>
            <Component {...pageProps} />
        </>
    )
}
