"use client";
import React, { useState,useEffect } from "react";
import {
  Button,
  Typography,
  Modal,
  Box,
  TextField,
  Card,
  CardHeader,
  CardContent,
  CardActions,
} from "@mui/material";
import CommentIcon from "@mui/icons-material/Comment";
import moment from "moment";
import FavoriteIcon from "@mui/icons-material/Favorite";
import DeleteIcon from "@mui/icons-material/Delete";
import { gql, useQuery } from "@apollo/client";
import { useMutation } from "@apollo/client";
import { FETCH_POSTS_QUERY } from "@/app/utils/graphql";

export default function CommentPost({
  postId,
}: CommentPostProps) {
  const [commentsPost,setCommentsPost] = useState<Post>()
  const [open, setOpen] = React.useState(false);
  const [comment, setComment] = useState("");
  const [commentId, setCommentId] = useState("");
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  const {data} = useQuery(FETCH_POST_QUERY,{
    variables:{
      postId
    }
  })

  useEffect(() => {
    if(data) {
      setCommentsPost(data.getPost as Post)
    }
  },[data])

  const [createComment] = useMutation(CREATE_COMMENT_MUTATION, {
    update() {
      setComment("");
    },
    refetchQueries: [FETCH_POST_QUERY],
    variables: {
      postId,
      body: comment,
    },
  });

  const [deleteComment] = useMutation(DELETE_COMMENT_MUTATION, {
    variables: {
      postId,
      commentId,
    },
    refetchQueries: [FETCH_POST_QUERY],
  });

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    createComment();
  };
  return (
    <>
      <Button onClick={handleOpen} sx={{ gap: "5px" }}>
        <CommentIcon sx={{ color: "#ccc" }} />
        <Typography>{commentsPost?.commentCount}</Typography>
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Post:{commentsPost?.body}
          </Typography>
          <Box>
            <form onSubmit={handleAddComment} className="form-comment">
              <TextField
                sx={{ flex: "1" }}
                label="Enter your comment"
                size="small"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <Button variant="contained" type="submit">
                Submit
              </Button>
            </form>
            {commentsPost?.comments.map((comment) => (
              <Card key={comment.id}>
                <CardHeader
                  title={comment.username}
                  subheader={moment(comment.createdAt).fromNow(true)}
                />
                <CardContent>
                  <Typography>{comment.body}</Typography>
                </CardContent>
                <CardActions
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "right",
                  }}
                  disableSpacing
                >
                  <Button
                    onClick={() => {
                      setCommentId(comment.id ? comment.id : "")
                      deleteComment();
                    }}
                  >
                    <DeleteIcon />
                  </Button>
                </CardActions>
              </Card>
            ))}
          </Box>
        </Box>
      </Modal>
    </>
  );
}

const FETCH_POST_QUERY = gql`
query($postId:ID!) {
  getPost(postId:$postId) {
    id
    body
    commentCount
    comments{
      id
      username
      createdAt
      body
    }
  }
}
`

const CREATE_COMMENT_MUTATION = gql`
  mutation ($postId: String!, $body: String!) {
    createComment(postId: $postId, body: $body) {
      id
      comments {
        id
        body
        createdAt
        username
      }
      commentCount
    }
  }
`;

const DELETE_COMMENT_MUTATION = gql`
  mutation deleteComment($postId: ID!, $commentId: ID!) {
    deleteComment(postId: $postId, commentId: $commentId) {
      id
      username
      comments {
        id
        username
        createdAt
        body
      }
      commentCount
    }
  }
`;
