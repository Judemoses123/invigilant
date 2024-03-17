import "../styles/globals.css";
import type, { AppProps } from "next/app";
import { Nunito } from "next/font/google";
import { Provider } from "react-redux";
import store from "../store/store";
import NextTopLoader from "nextjs-toploader";

// If loading a variable font, you don't need to specify the font weight
const nunito = Nunito({ subsets: ["latin"] });
export default function App({ Component, pageProps }) {
  return (
    <main className={`${nunito.className} h-screen`}>
      <Provider store={store}>
        <NextTopLoader />
        <Component {...pageProps} />
      </Provider>
    </main>
  );
}
