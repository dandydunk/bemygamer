import React from 'react';
import {Link} from "react-router-dom";
import "../sass/mainTemplate.scss"
import * as firebase from "firebase/app";
import "firebase/auth";

export default class MainTemplate extends React.Component  {
  constructor(props) {
    super(props);

    this.state = {showMenu:false, 
                  name:this.props.system.getMember().profile.name,
                  profilePic:this.props.system.getMember().profile.photos[0],
                memberId:this.props.system.getMember().profile.memberId}
    this.refButtonHideMenu = React.createRef();
    this.refButtonShowMenu = React.createRef();
    this.refMenu = React.createRef();
  }

  profileChangeEvent() {
    this.setState({name:this.props.system.getMember().profile.name})
  }

  componentDidMount() {
    this.props.system.addEventListener("profile", this.profileChangeEvent.bind(this));
    console.log("init firebase...");
    firebase.initializeApp(this.props.system.firebaseConfig);
  }

  componentWillUnmount() {
    this.props.system.removeEventListener("profile", this.profileChangeEvent.bind(this))
  }

  onClickButtonShowMenu(e) {
    e.preventDefault();
    e.currentTarget.setAttribute("disabled", "disabled");

    this.setState({showMenu:true});
  }

  menuTransitionEnd() {
    this.refButtonShowMenu.current.removeAttribute("disabled");
    this.refButtonHideMenu.current.removeAttribute("disabled");
    this.refMenu.current.removeEventListener("transitionend", this.menuTransitionEnd);
    console.log("menu is closed");
  }

  onClickButtonCloseMenu(e) {
    e.preventDefault();
    e.currentTarget.setAttribute("disabled", "disabled");

    this.refMenu.current.addEventListener("transitionend", this.menuTransitionEnd.bind(this));
    this.setState({showMenu:false});
  }

  logOut() {
    console.log("soinging out...");
    firebase.auth().signOut().then(()=>{
      console.log("logging out nw")
      this.props.system.getMember().logout(r=>{
        console.log("done...");
        window.location = "/";
        return;
      }, e=>{
        console.log("error - ", e)
        window.location = "/";
        
      });
    }).catch(function(error) {
      alert("error trying to log out...");
      console.log("error:", error);
    });
  }

  onClickLink(e) {
    this.refMenu.current.addEventListener("transitionend", this.menuTransitionEnd.bind(this));
    this.setState({showMenu:false});
  }

  render() {
    let menuClass = "hideMenu";
    if(this.state.showMenu) {
        menuClass = "showMenu";
    }

    return(
      <div id="pageMainTemplate">
        <nav id="menu" ref={this.refMenu} className={menuClass}>
            
            <button ref={this.refButtonHideMenu} onClick={this.onClickButtonCloseMenu.bind(this)}>X</button>
            
            <div id="boxMemberProfile">
                <img alt="member profile photo"
                    id="menuProfilePic"
                    src={this.state.profilePic} />
                <div className="menuProfileMemberName">{this.state.name}</div>
                <button onClick={(e)=>{e.preventDefault(); this.props.history.push("/members/editProfile/");}}>EDIT PROFILE</button>
                <button onClick={(e)=>{e.preventDefault(); this.logOut(); }}>LOG OUT</button>
            </div>
            <ul>
                <li><Link onClick={this.onClickLink.bind(this)} to="/members/">Home</Link></li>
            </ul>
        </nav>
        
        <div>
            <div>
                <button id="buttonShowMenu"  ref={this.refButtonShowMenu} onClick={this.onClickButtonShowMenu.bind(this)}>
                    <i className="material-icons md-48 md-light md-inactive">menu</i>
                </button>
            </div>

            <div>
                {this.props.children}
            </div>
        </div>
      </div>
    )
  }
}