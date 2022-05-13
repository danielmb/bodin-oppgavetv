import Link from 'next/link';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Navbar from './navbar';
import Script from 'next/script';

export default function Layout({ children }) {
  return (
    <>
      <Script src="/js/moment-with-locales.js"></Script>
      <Navbar />
      <div className=" min-h-screen flex flex-col">
        <div className="flex flex-col md:flex-row flex-1">
          <main className=" flex-1 ">{children}</main>
        </div>
      </div>
    </>
  );
}
