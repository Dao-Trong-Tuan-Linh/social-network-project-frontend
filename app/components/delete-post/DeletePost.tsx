"use client";
import React, { useState } from "react";
import { Button, Modal, Typography,Box } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client";
import { FETCH_POSTS_QUERY } from "@/app/utils/graphql";

export default function DeletePost({ id }: DeletePostProps) {
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  const [deletePost] = useMutation(DELETE_POST_MUTATION, {
    update() {
        handleClose()
    },
    variables: {
        postId:id
    },
    refetchQueries:[
        FETCH_POSTS_QUERY
    ]
  });
  return (
    <>
    <Button onClick={handleOpen}>
      <DeleteIcon />
    </Button>
    <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
            <Typography>
                Do you want to delete this post?
            </Typography>
            <Box sx={{display:"flex",alignItems:"center",justifyContent:"flex-end"}}>
            <Button color="success" onClick={handleClose}>No</Button>
            <Button color="error" onClick={() => deletePost()}>Yes</Button>
            </Box>
        </Box>
    </Modal>
    </>
  );
}

const DELETE_POST_MUTATION = gql`
mutation deletePost($postId:ID!){
    deletePost(postId:$postId)
}
`
