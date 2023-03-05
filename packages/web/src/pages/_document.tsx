import Document, {
	Html,
	Head,
	Main,
	NextScript,
	DocumentContext,
} from "next/document";

class MyDocument extends Document {
	render() {
		return (
			<Html>
				<Head>
					<meta charSet="utf-8" />
					<meta property="og:title" content="Gnoswap" />
					<meta property="og:image" content="" />
					<meta property="og:description" content="" />
					<meta property="og:url" content="//" />
					<meta name="description" content="" />
					<meta name="keywords" content="" />
					<link rel="preconnect" href="https://fonts.gstatic.com" />
					<link
						href="https://fonts.googleapis.com/css2?family=Inter:wght@500;700&family=Roboto:wght@500;700&display=swap"
						rel="preload"
						as="style"
					/>
					<link
						href="https://fonts.googleapis.com/css2?family=Inter:wght@500;700&family=Roboto:wght@500;700&display=swap"
						rel="stylesheet"
					/>
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}

export default MyDocument;
