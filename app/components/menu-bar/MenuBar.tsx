"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Box,
  AppBar,
  Toolbar,
  CssBaseline,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Drawer,
  IconButton,
  Button,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Home from "@/app/pages/home/HomePage";
import Login from "@/app/pages/login/Login";
import Register from "@/app/pages/register/Register";
import { getUser, getToken, removeToken, removeUser } from "@/app/utils/localstorage";
import { useRouter } from "next/navigation";

interface Props {
  window?: () => Window;
}

const drawerWidth = 240;
const navItems = ["Home", "Login", "Register"];

export default function MenuBar(props: Props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const token = getToken();
  const username = getUser();
  const router = useRouter();

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <List>
        <ListItem disablePadding>
          <ListItemButton component="a" href="/">
            {token ? (
              <ListItemText
                sx={{ color: pathname === "/" ? "primary" : "" }}
                primary={username}
              />
            ) : (
              <ListItemText
                sx={{ color: pathname === "/" ? "primary" : "" }}
                primary="Home"
              />
            )}
          </ListItemButton>
        </ListItem>
        {token ? (
          <ListItem disablePadding>
            <ListItemButton
              component="button"
              onClick={() => {
                router.push("/login");
                removeToken();
                removeUser();
              }}
            >
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        ) : (
          <>
            <ListItem disablePadding>
              <ListItemButton component="a" href="/login">
                <ListItemText
                  sx={{ color: pathname === "/login" ? "primary" : "" }}
                  primary="Login"
                />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component="a" href="/register">
                <ListItemText
                  sx={{ color: pathname === "/register" ? "primary" : "" }}
                  primary="Register"
                />
              </ListItemButton>
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box
      sx={{
        display: "flex",
      }}
    >
      <CssBaseline />
      <AppBar position="static" component="nav">
        <Toolbar
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "100%",
          }}
        >
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          {token ? (
            <Box sx={{ display: { xs: "none", sm: "block" } }}>
              <Link
                className={`link ${pathname === "/" ? "active" : ""}`}
                href={"/"}
              >
                {username}
              </Link>
            </Box>
          ) : (
            <Box sx={{ display: { xs: "none", sm: "block" } }}>
              <Link
                className={`link ${pathname === "/" ? "active" : ""}`}
                href={"/"}
              >
                Home
              </Link>
            </Box>
          )}
          <Box
            sx={{
              display: { xs: "none", sm: "flex" },
              gap: "1rem",
              height: "100%",
            }}
          >
            {token ? (
              <Button
                variant="outlined"
                color="error"
                onClick={() => {
                  router.push("/login");
                  removeToken();
                  removeUser();
                }}
              >
                Logout
              </Button>
            ) : (
              <>
                <Link
                  className={`link ${pathname === "/login" ? "active" : ""}`}
                  href={"/login"}
                >
                  Login
                </Link>

                <Link
                  className={`link ${pathname === "/register" ? "active" : ""}`}
                  href={"/register"}
                >
                  Register
                </Link>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <nav>
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
    </Box>
  );
}
