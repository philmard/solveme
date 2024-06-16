import 'bootstrap/dist/css/bootstrap.min.css';
import { Inter } from 'next/font/google';
import "../app/globals.css"; // Ensure your global CSS is imported here
import { Footer, Header } from '../app/components';

const inter = Inter({ subsets: ['latin'] });

function MyApp({ Component, pageProps }) {
    return (
        <html lang="en" className={inter.className}>
        <body>
        <Header />
        <Component {...pageProps} />
        <Footer />
        </body>
        </html>
    );
}

export default MyApp;
