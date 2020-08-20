import React from "react";
import "./App.css";
import { db, auth, storage } from "./firebase";
import firebase from "firebase";
import {
  TextField,
  Button,
  Avatar,
  Card,
  Typography,
  CardContent,
  Input,
  TextareaAutosize,
  Tooltip,
  IconButton,
} from "@material-ui/core";
import HomeIcon from "@material-ui/icons/Home";
import PeopleRoundedIcon from "@material-ui/icons/PeopleRounded";
import OndemandVideoRoundedIcon from "@material-ui/icons/OndemandVideoRounded";
import StoreRoundedIcon from "@material-ui/icons/StoreRounded";
import SupervisedUserCircleIcon from "@material-ui/icons/SupervisedUserCircle";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import Post from "./Post";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

// https://lh3.googleusercontent.com/proxy/h_cboCjIyt0F0ji7uoZU__4EykjpNKVPPv2wjcKlo4LNLxHUsykMccQCw25CRjNutrRHvnAeyKlF9okUWLDU8rIL-9gAnoJFUkNbfQkBImFawpMX2CQRw3RhYPG0XV2m2mQF3NbBDUGQoE1R
// https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png

function App() {
  const [input, setInput] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [user, setUser] = React.useState(null);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [posts, setPost] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [signupOpen, setSignupOpen] = React.useState(false);
  const [signinOpen, setSigninOpen] = React.useState(false);
  const [image, setImage] = React.useState(null);
  const [progress, setProgress] = React.useState(0);
  

  const useStyles = makeStyles((theme) => ({
    modal: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      outline: "none",
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
  }));
  const classes = useStyles();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const createPost = (event) => {
    event.preventDefault();
    if (image != null) {
      const uploadTask = storage.ref(`images/${image.name}`).put(image);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress(progress);
        },
        (error) => {
          console.log(error);
          alert(error.message);
        },
        () => {
          storage
            .ref("images")
            .child(image.name)
            .getDownloadURL()
            .then((url) => {
              db.collection("posts").add({
                username: user.displayName,
                message: input,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                imageUrl: url,
              });
            });
          setProgress(0);
          setImage(null);
        }
      );
    } else {
      db.collection("posts").add({
        username: user.displayName,
        message: input,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        imageUrl: "",
      });
    }

    setOpen(false);
    // setPost({
    //   username: user.displayName,
    //   message: input,
    // });
    console.log(input);
    setInput("");
  };

  React.useEffect(() => {
    db.collection("posts").orderBy("timestamp","desc").onSnapshot((snapshot) => {
      setPost(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          post: doc.data(),
        }))
      );
    });
  }, []);

  const signIn = () => {
    auth.signInWithEmailAndPassword(email, password);
    setSigninOpen(false);
    setPassword("");
    setEmail("");
  };

  const logOut = () => {
    auth.signOut();
  };

  const signUp = () => {
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username,
        });
      })
      .catch((error) => alert(error.message));
    setSignupOpen(false);
    setUsername("");
    setPassword("");
    setEmail("");
  };

  React.useEffect(() => {
    auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
        if (authUser.displayName) {
        } else {
        }
      } else {
        setUser(null);
      }
    });
  }, [user]);

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    } else {
      setImage(null);
    }
  };

  

  return (
    <div className="App">
      {/* Navbar-Section */}
      <div className="app__navbar">
        <div className="app__leftNavbar">
          <img
            className="fb__logo"
            src="https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png"
            alt="Facebook"
          />
          <input
            className="app__SearchBar"
            name="search"
            placeholder="Search Facebook"
            type="text"
          />
        </div>
        <div className="app__centerNavbar">
          <IconButton>
            <Tooltip title="Home" placement="bottom-start">
              <HomeIcon className="homeIcon" />
            </Tooltip>
          </IconButton>
          <IconButton>
            <Tooltip title="Friends" placement="bottom-start">
              <PeopleRoundedIcon className="grayIcon" />
            </Tooltip>
          </IconButton>
          <IconButton>
            <Tooltip title="Watch" placement="bottom-start">
              <OndemandVideoRoundedIcon className="grayIcon" />
            </Tooltip>
          </IconButton>
          <IconButton>
            <Tooltip title="Marketplace" placement="bottom-start">
              <StoreRoundedIcon className="grayIcon" />
            </Tooltip>
          </IconButton>
          <IconButton>
            <Tooltip title="Groups" placement="bottom-start">
              <SupervisedUserCircleIcon className="grayIcon" />
            </Tooltip>
          </IconButton>
        </div>
        <div className="app__rightNavbar">
          {user ? (
            <div className="user__info">
              <Tooltip className="tooltip" title={user.displayName}>
              <Avatar
                className="app__navbarAvatar"
                alt={user.displayName}
                src="/static/images/avatar/1.jpg"
              /></Tooltip>

              <p className="display__username">{user.displayName}</p>
            </div>
          ) : (
            <p></p>
          )}

          {user ? (
            <Button className="logout__button" onClick={logOut}>
              <ExitToAppIcon /> Logout
            </Button>
          ) : (
            <div>
              <Button onClick={() => setSigninOpen(true)}>Login</Button>
              <Button onClick={() => setSignupOpen(true)}>Signup</Button>
            </div>
          )}

          <Modal
            open={signinOpen}
            onClose={handleClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
              timeout: 500,
            }}
          >
            <Fade in={signinOpen}>
              <div className="signInForm">
                <img
                  className="signInForm__image"
                  src="https://www.logo.wine/a/logo/Facebook/Facebook-Logo.wine.svg"
                  alt="facebook"
                />
                <Input
                  type="text"
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="email"
                />
                <Input
                  type="password"
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="password"
                />
                <Button className="signInForm__button" onClick={signIn}>
                  SignIn
                </Button>
              </div>
            </Fade>
          </Modal>

          <Modal
            open={signupOpen}
            onClose={handleClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
              timeout: 500,
            }}
          >
            <Fade in={signupOpen}>
              <div className="signInForm">
                <img
                  className="signInForm__image"
                  src="https://www.logo.wine/a/logo/Facebook/Facebook-Logo.wine.svg"
                  alt="facebook"
                />
                <Input
                  type="text"
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="email"
                />
                <Input
                  type="text"
                  onChange={(event) => setUsername(event.target.value)}
                  placeholder="username"
                />
                <Input
                  type="password"
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="password"
                />
                <Button className="signInForm__button" onClick={signUp}>
                  SignUp
                </Button>
              </div>
            </Fade>
          </Modal>
        </div>
      </div>

      {/* App body */}

      <div className="app__mainBody">
        <div className="app__bodyLeft"></div>
        <div className="app__bodycenter">
          {user?.displayName ? (
            <Card className="app__postCard">
              <CardContent>
                <div className="cardTop">
                  <Avatar alt="Shudh" src="" />
                  <button
                    className="app__SearchBar"
                    onClick={handleOpen}
                    placeholder="Whats on your Mind?"
                  >
                    Whats on your Mind, {user.displayName}?
                  </button>
                  <Modal
                    open={open}
                    onClose={handleClose}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                      timeout: 500,
                    }}
                  >
                    <Fade in={open}>
                      <div className="createPostModal">
                        <div className="createPostModalHeader">
                          <Typography className="createPostModalHeader__Text">
                            Create Post
                          </Typography>
                        </div>
                        <TextareaAutosize
                          onChange={(event) => {
                            setInput(event.target.value);
                          }}
                          placeholder="Tell us Whats on your Mind?"
                          className="createPostModalHeader__Input"
                          type="text"
                        />
                        <input className="fileupload__button" type="file" onChange={handleChange}></input>
                        <progress className="progress__bar" value={progress} max="100" />

                        <Button
                          disabled={!input}
                          onClick={createPost}
                          className="app__postButton"
                          type="submit"
                        >
                          Post
                        </Button>
                      </div>
                    </Fade>
                  </Modal>
                </div>
              </CardContent>
            </Card>
          ) : (
            <img src=""></img>
          )}

          {posts.map(({ id, post }) => (
            <Post
              key={id}
              postId={id}
              username={post.username}
              message={post.message}
              imageUrl={post.imageUrl}
              user={user}
            />
          ))}
        </div>
        <div className="app__bodyright"></div>
      </div>
    </div>
  );
}

export default App;
