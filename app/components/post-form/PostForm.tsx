"use client";
import React, { useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import { gql, useMutation } from "@apollo/client";
import { FETCH_POSTS_QUERY } from "@/app/utils/graphql";

export default function PostForm() {
  const [post, setPost] = useState("");
  const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
    variables: {body:post},
    update(proxy, result) {
      console.log(result);
      const data = proxy.readQuery({
        query:FETCH_POSTS_QUERY
      })
      data.getPosts = [result.data.createPost,...data.getPosts]
      console.log("posts:",data)
      proxy.writeQuery({query:FETCH_POSTS_QUERY,data:data})
      setPost("")
    },
    refetchQueries:[
     {
      query:FETCH_POSTS_QUERY
     }
    ]
  });

  const handleAddPost = (e:React.FormEvent) => {
    e.preventDefault()
    createPost()
  }
  return (
    <Box>
      <form onSubmit={handleAddPost}>
        <TextField
          label="Enter a post"
          variant="outlined"
          size="small"
          onChange={(e) => setPost(e.target.value)}
          value={post}
        />
        <Button
          variant="contained"
          disabled={!post}
          type="submit"
        >
          Add Post
        </Button>
      </form>
    </Box>
  );
}

const CREATE_POST_MUTATION = gql`
  mutation createPost($body: String!) {
    createPost(body: $body) {
      id
      body
      createdAt
      username
      likes {
        id
        username
        createdAt
      }
      likeCount
      comments {
        id
        body
        username
        createdAt
      }
      commentCount
    }
  }
`;
