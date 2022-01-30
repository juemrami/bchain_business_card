
import Document, { DocumentContext, Html, Head, Main, NextScript } from 'next/document'
const customStyles={
    body: "p-0 m-0 bg-darkgray font-body text-white"
}

class MyDocument extends Document {
  static async getInitialProps(ctx : DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }
  
  render() {
    return (
      <Html>
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument