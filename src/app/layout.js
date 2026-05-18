import "./globals.css";
import Providers from "./provider";


export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
    >
      <body >
        <Providers>
          <div className="min-h-full flex flex-col">
            {children}
          </div>
        </Providers>

      </body>
    </html>
  );
}
