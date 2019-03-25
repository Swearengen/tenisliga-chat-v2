import React from 'react';
import Document, { Head, Main, NextScript } from 'next/document';
import flush from 'styled-jsx/server';

interface Props {
    pageContext: any
}

class MyDocument extends Document<Props> {

    static async getInitialProps(ctx: any) {
		// Render app and page and get the context of the page with collected side effects.
        let pageContext: any;
        const page = ctx.renderPage((Component: any) => {
          const WrappedComponent = (props: any) => {
            pageContext = props.pageContext;
            return <Component {...props} />;
          };

          return WrappedComponent;
        });

        let css;
        // It might be undefined, e.g. after an error.
        if (pageContext) {
          css = pageContext.sheetsRegistry.toString();
        }

        return {
          ...page,
          pageContext,
          // Styles fragment is rendered after the app and page rendering finish.
          styles: (
            <React.Fragment>
              <style
                id="jss-server-side"
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{ __html: css }}
              />
              {flush() || null}
            </React.Fragment>
          ),
        };
	}

  render() {
    const { pageContext } = this.props;

    return (
      <html lang="en" dir="ltr">
        <Head>
          <meta charSet="utf-8" />
          <meta name="robots" content="noindex" />
          {/* Use minimum-scale=1 to enable GPU rasterization */}
          <meta
            name="viewport"
            content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
          />
          {/* PWA primary color */}
          <meta
            name="theme-color"
            content={pageContext ? pageContext.theme.palette.primary.main : null}
          />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}

export default MyDocument;