import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
	return (
		<Html>
			<Head />
			<body className="modern-design">
				<Main />
				<NextScript />

				<div id="portal-root"></div>
				<div id="portal-notification"></div>
			</body>
		</Html>
	);
}
