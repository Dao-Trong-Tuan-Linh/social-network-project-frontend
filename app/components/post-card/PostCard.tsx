import React from "react";
import {
  Box,
  Card,
  CardHeader,
  Avatar,
  CardContent,
  Typography,
  CardActions,
  Divider,
  Button,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import { getUser, getToken } from "@/app/utils/localstorage";
import moment from "moment";
import LikePost from "../like-post/LikePost";
import DeletePost from "../delete-post/DeletePost";
import CommentPost from "../comment-post/CommentPost";

export default function PostCard({ post }: { post: Post }) {
  const token = getToken();
  const user = getUser();

  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  return (
    <Card sx={{ width: "100%",cursor:"pointer" }}>
      <CardHeader
        avatar={
          <Avatar>
            <PersonIcon />
          </Avatar>
        }
        title={post.username}
        subheader={moment(post.createdAt).fromNow(true)}
      />
      <CardContent>
       <Button>
       <Typography variant="body2" color="text.secondary">
          {post.body}
        </Typography>
       </Button>
      </CardContent>
      <Divider light />
      <CardActions disableSpacing>
        <Box>
          <LikePost id={post.id} likeCount={post.likeCount} likes={post.likes}/>
          <CommentPost postId={post.id}/>
          {token && user == post.username ? (
            <DeletePost id={post.id}/>
          ) : (
            <></>
          )}
        </Box>
      </CardActions>
    </Card>
  );
}
