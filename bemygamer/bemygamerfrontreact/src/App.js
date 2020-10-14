import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import { useRouteMatch } from "react-router-dom";
import * as firebase from "firebase/app";
import InboxPage from "./pages/members/InboxPage"
import DashboardPage from './pages/members/DashboardPage'
import BeMyGamer from './system/BeMyGamer';
import LoadingPage from "./pages/LoadingPage"
import IndexPage from './pages/IndexPage'
import LoginPage from "./pages/members/LoginPage"
import InterviewPage from "./pages/members/InterviewPage"
import EditProfilePage from "./pages/members/EditProfilePage"
import MemberPage from './pages/members/MemberPage';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    if (!props.apiUrl) {
      throw Error("The API URL is not set")
    }

    this.state = { systemInit: false };

    this.system = new BeMyGamer();
    this.system.setApiUrl(props.apiUrl);

    this.system.firebaseConfig = {
      apiKey: "AIzaSyDiitErwfzUOUE-2jWJE0-lMoJb3L6bTLk",
      authDomain: "bemygamerdev.firebaseapp.com",
      databaseURL: "https://bemygamerdev.firebaseio.com",
      projectId: "bemygamerdev",
      storageBucket: "bemygamerdev.appspot.com",
      messagingSenderId: "846648586342",
      appId: "1:846648586342:web:0bc85f4ae8f1d047f2fda7",
      measurementId: "G-5VYC7JHDR3"
    };

  }

  componentDidMount() {
    this.preloadImages(() => {
      this.system.getMember().init(()=>{
        this.setState({systemInit:true});
      })
    })
  }

  preloadImages(cb) {
    let imagePaths = ["/images/backgrounds/903580.png",
      "/images/backgrounds/536426.png",
      "/images/backgrounds/673328.png",
      "/images/backgrounds/love.png",
      "/images/backgrounds/purple.jpg",
      "/images/backgrounds/pokeone.jpg",
      "/images/backgrounds/stain.jpg",
      "/images/icons/female_user.png",
      "/images/landing/be_my_gamer.png",
      "/images/landing/be_my_gamer_couch.png",
      "/images/landing/be_my_gamer_couch_two.png"];

    let indexImgLoaded = 0;
    //console.log("waiting for [" + imagePaths.length + "] images to load...");
    imagePaths.forEach(imgPath => {
      let i = new Image();
      i.onload = () => {
        if (++indexImgLoaded >= imagePaths.length) {
          //console.log("all images are loaded...");
          cb();
        }
        //console.log("one down...");
      }
      i.src = imgPath;
    })
  }

  render() {
    if (!this.state.systemInit) {
      return <LoadingPage />
    }
    return (
      <Router>
        <Switch>
          <Route exact path="/members/interview/" 
                render={props=>{return <InterviewPage system={this.system} {...props}  />}}/>
          <Route path="/members/" 
              render={props=>{return <MemberPage {...props} system={this.system} />}} />
          <Route exact path="/" 
              render={props=>{return <IndexPage system={this.system} {...props}  />}} />    
        </Switch>
      </Router>
    )
  }
}