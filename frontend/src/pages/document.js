import Document, { Html, Head, Main, NextScript } from 'next/document';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

class MyDocument extends Document {
    render() {
        return (
            <Html lang="en" className={inter.className}>
                <Head />
                <body>
                <Main />
                <NextScript />
                </body>
            </Html>
        );
    }
}

export default MyDocument;
