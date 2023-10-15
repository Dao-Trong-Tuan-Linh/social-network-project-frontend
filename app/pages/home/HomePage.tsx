"use client";
import React, { useState, useEffect } from "react";
import { gql, useQuery } from "@apollo/client";
import { Box, Grid, Typography } from "@mui/material";
import PostCard from "@/app/components/post-card/PostCard";
import { useRouter } from "next/navigation";
import { getToken } from "@/app/utils/localstorage";
import PostForm from "@/app/components/post-form/PostForm";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/ReactToastify.css";

export default function HomePage() {
  const token = getToken();
  const { loading, data } = useQuery(FETCH_POSTS_QUERY);
  const [posts, setPosts] = useState<Post[]>([]);
  console.log("getPosts:", data);
  useEffect(() => {
    if (data) {
      const initialPosts = data.getPosts ? (data.getPosts as Post[]) : [];
      if (initialPosts.length > 0) {
        setPosts(initialPosts);
      }
    }
  }, [data]);
  console.log("posts:", posts);

  return (
    <Box sx={{ mt: 2, width: "100vw", padding: "0 24px" }}>
      <Grid container spacing={2}>
        <Grid
          item
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0",
          }}
          xs={12}
        >
          <Typography sx={{ fontSize: "32px", fontWeight: "600" }}>
            Recent Posts
          </Typography>
        </Grid>

        {token ? (
          <Grid
            item
            xs={12}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0",
            }}
          >
            <PostForm />
          </Grid>
        ) : (
          <></>
        )}
        {loading ? (
          <h1>Loading posts...</h1>
        ) : (
          posts &&
          posts.map((post) => (
            <Grid key={post.id} item xs={3} sx={{ padding: "0" }}>
              <PostCard post={post} />
            </Grid>
          ))
        )}
      </Grid>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </Box>
  );
}

const FETCH_POSTS_QUERY = gql`
  {
    getPosts {
      id
      body
      createdAt
      username
      likeCount
      likes {
        username
      }
      commentCount
      comments {
        id
        username
        createdAt
        body
      }
    }
  }
`;
