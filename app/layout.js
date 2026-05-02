import "./globals.css";

export const metadata = {
  title: "Grad Party",
  description: "Scrapbook-style grad party app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
