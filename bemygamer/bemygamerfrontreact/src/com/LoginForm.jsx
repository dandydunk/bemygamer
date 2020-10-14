import React from 'react';
import LoadingIcon from './LoadingIcon';
import "../sass/login.scss"
import { Alert } from "../system/Alert"
import * as firebase from "firebase/app";
import "firebase/auth";

export default class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { loginEmail: "", loginPassword: "", isBeingSubmitted: false }
  }

  componentDidMount() {
    console.log("init firebase...");
    firebase.initializeApp(this.props.system.firebaseConfig);
    var user = firebase.auth().currentUser;
    console.log("fb user: ", user);
  }

  onChangeField(e) {
    this.setState({ [e.currentTarget.name]: e.currentTarget.value });
  }

  onSubmit(e) {
    e.preventDefault();
    if (this.state.isBeingSubmitted) {
      return;
    }
    this.setState({ isBeingSubmitted: true })

    console.log("logging in...");
    firebase.auth().signInWithEmailAndPassword(this.state.loginEmail, this.state.loginPassword)
      .then(i => {
        console.log("getting token...");
        firebase.auth().currentUser.getIdToken(true).then(token => {
          console.log("confirming token...");
          this.props.system.getMember().login(token, result => {
            if (result.error) {
              if (result.error.msg) {
                alert(result.error.msg);
              }
              else {
                alert("There was an error trying to log you in.");
              }
              this.setState({ isBeingSubmitted: false });
              return;
            }
            console.log("init member...");
            this.props.system.getMember().init(()=>{
              console.log("login finished...");
              window.location = "/members/";
            })
          });
        }).catch(function (error) {
          // Handle error
        });
      })
      .catch(error => {
        var errorMessage = error.message;
        Alert.show(errorMessage);
        this.setState({ isBeingSubmitted: false });
      });
  }

  render() {
    return (
      <form className="box-brown" {...this.props}>
        <div className="boxFormField">
          <span className="form-field-error hide"></span>
          <input className="input" placeholder="Email" type="email" value={this.state.loginEmail} onChange={this.onChangeField.bind(this)} name="loginEmail" />
        </div>

        <div className="boxFormField">
          <span className="form-field-error hide"></span>
          <input className="input" type="password" placeholder="Password"
            value={this.state.loginPassword} onChange={this.onChangeField.bind(this)}
            name="loginPassword" />
        </div>

        <div className="boxFormField">
          <button className="button buttonSave" ref={this.buttonSubmitRef} id="buttonSubmit" onClick={this.onSubmit.bind(this)}>
            <span style={{ display: (this.state.isBeingSubmitted ? "none" : "block") }}>LOGIN</span>
            <LoadingIcon
              message="logging you in..."
              style={{ display: (this.state.isBeingSubmitted ? "block" : "none") }} />
          </button>
        </div>
      </form>
    )
  }
}