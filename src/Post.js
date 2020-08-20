import React from "react";
import {
  Card,
  Typography,
  Avatar,
  CardContent,
  IconButton,
} from "@material-ui/core";
import "./Post.css";
import { db } from "./firebase";
import ChatBubbleOutlineOutlinedIcon from "@material-ui/icons/ChatBubbleOutlineOutlined";
import CloseIcon from "@material-ui/icons/Close";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import firebase from "firebase";

function Post({ username, message, imageUrl, postId, user }) {
  const [comments, setComments] = React.useState([]);
  const [comment, setcomment] = React.useState("");
  const [viewComments, setViewComments] = React.useState(false);

  React.useEffect(() => {
    let unsubscribe;
    if (postId) {
      unsubscribe = db
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .orderBy("timestamp","desc")
        .onSnapshot((snapshot) => {
          setComments(snapshot.docs.map((doc) => doc.data()));
        });
    }
    return () => {
      unsubscribe();
    };
  }, [postId]);

  const postComment = (e) => {
    e.preventDefault();
    // setComments(comment);
    db.collection("posts").doc(postId).collection("comments").add({
      text: comment,
      username : user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    })

    setcomment("");
  };

  const handleClose = () => {
    setViewComments(false);
  };

  return (
    <div>
      <Card className="post__card">
        <CardContent>
          <div className="post__cardTop">
            <Avatar alt={username} src="" />
            <Typography className="post__cardUsername">{username}</Typography>
          </div>
          <div className="post__Message">
            <Typography className="post__cardMessage">{message}</Typography>
          </div>

          <img className="post__img" src={imageUrl} />
        </CardContent>
        <button
          className="viewComment__button"
          onClick={(e) => {
            setViewComments(true);
          }}
        >
          View Comments
        </button>
        <Modal
          open={viewComments}
          onClose={handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={viewComments}>
            <div className="viewComment__box">
              <div className="head__commentBox">
                <h3>Comments</h3>
                <IconButton>
                  <CloseIcon className="closeIcon" onClick={(e) => setViewComments(false)} />
                </IconButton>
              </div>
              <div className="comments">
                {
                  comments.map(comment=>(
                    <p >
                      <strong>{comment.username}</strong>  {comment.text}
                    </p>
                  
                  ))
                }
              </div>
            </div>
          </Fade>
        </Modal>

        <form className="postComment__box">
          <input
            className="post__input"
            type="text"
            placeholder="Enter your comment.."
            value={comment}
            onChange={(e) => setcomment(e.target.value)}
          />
          <button
            className="post__button"
            disabled={!comment}
            onClick={postComment}
            type="submit"
          >
            <ChatBubbleOutlineOutlinedIcon className="postComment__icon" /> <p>Post</p> 
          </button>
        </form>
      </Card>
    </div>
  );
}
// https://i.redd.it/5uyrc8opy9uy.jpg

export default Post;
