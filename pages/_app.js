import '../styles/globals.css'
import { CartProvider } from '../context/CartContext'
import Head from 'next/head'

export default function App({ Component, pageProps }) {
  return (
    <CartProvider>
      <Head>
        <title>OnlyInTX - Authentic Texas Pride Apparel & Gifts</title>
        <meta name="description" content="Discover authentic Texas pride with our premium collection of t-shirts, hoodies, and gifts celebrating Texas cities, landmarks, and culture. Always free shipping on all orders." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </CartProvider>
  )
}