import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import ApplicationStore from "@/root/redux/store"; 

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={ApplicationStore}>
      <Component {...pageProps} />
    </Provider>
  );
}
