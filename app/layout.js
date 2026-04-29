import "./globals.css";

export const metadata = {
  title: "Grad Party",
  description: "Scrapbook-style Grad Quest party app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
