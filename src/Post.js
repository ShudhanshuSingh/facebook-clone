import React from "react";
import { Card, Typography, Avatar, CardContent } from "@material-ui/core";
import "./Post.css";


function Post({ username, message,imageUrl }) {
  return (
    <div>
      <Card className="post__card">
        <CardContent>
          <div className="post__cardTop">
            <Avatar alt="${username}" src="" />
            <Typography className="post__cardUsername">{username}</Typography>
          </div>
          <div className="post__Message">
            <Typography className="post__cardMessage">{message}</Typography>
          </div>

          <img className="post__img" src={imageUrl} />
        </CardContent>
      </Card>
    </div>
  );
}
// https://i.redd.it/5uyrc8opy9uy.jpg

export default Post;
