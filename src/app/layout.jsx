import { Jost } from "next/font/google";

import "./globals.css";

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-jost",
});

export const metadata = {
  
  title: "NextDeal App",
  description: "Welcome to the NextDeal Home Page, Where you can get discount for every purchese.",
   icons: {
    icon: "/fab.png",
  },
};

const RootLayout = ({ children })  => {
  return (
    <>
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>NextDeal App</title>
      </head>
      <body className={`${jost.variable} antialiased`}>
        {children}
      </body>

      
    </html>
    </>
  
  );
}


export default RootLayout;