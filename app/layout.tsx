import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Provider } from "./ApolloProvider";
import ThemeRegistry from "./theme/ThemeRegistry";
import { Box } from "@mui/material";
import MenuBar from "./components/menu-bar/MenuBar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider>
          <ThemeRegistry>
            <Box sx={{width:'100vw',minHeight:'100vh'}}>
              <MenuBar/>
              {children}
              </Box>
          </ThemeRegistry>
        </Provider>
      </body>
    </html>
  );
}
