"use client";
import React, { useState, useEffect } from "react";
import { Button, Typography, Popover } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { getUser } from "@/app/utils/localstorage";
import { gql, useMutation } from "@apollo/client";

export default function LikePost({ id, likes, likeCount }: LikePostProps) {
  const user = getUser();
  const [liked, setLiked] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  useEffect(() => {
    if (user && likes.find((like) => like.username === user)) {
      setLiked(true);
    } else setLiked(false);
  }, [user, likes]);

  const [likePost] = useMutation(LIKE_POST_MUTATION, {
    variables: { postId: id },
    refetchQueries: [LIKE_POST_MUTATION],
  });

  return (
    <>
      <Button
        aria-owns={open ? "mouse-over-popover" : undefined}
        aria-haspopup="true"
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
        onClick={() => likePost()}
        sx={{ gap: "5px" }}
      >
        <FavoriteIcon sx={liked ? { color: "red" } : { color: "#ccc" }} />
        <Typography>{likeCount}</Typography>
      </Button>
      {likes.length ? (
        <Popover
          id="mouse-over-popover"
          sx={{ pointerEvents: "none" }}
          open={open}
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          onClose={handlePopoverClose}
          disableRestoreFocus
        >
          {likes.map((like) => (
            <Typography key={like.username} sx={{ p: 1 }}>
              {like.username}
            </Typography>
          ))}
        </Popover>
      ) : (
        <></>
      )}
    </>
  );
}

const LIKE_POST_MUTATION = gql`
  mutation likePost($postId: ID!) {
    likePost(postId: $postId) {
      id
      likes {
        id
        username
      }
      likeCount
    }
  }
`;
