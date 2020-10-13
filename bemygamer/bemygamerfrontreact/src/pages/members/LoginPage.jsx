import React from 'react';
import {
  Link
} from "react-router-dom";
import "../../sass/login.scss"
import * as firebase from "firebase/app";
import "firebase/auth";
import {Alert} from "../../system/Alert"

export default class LoginPage extends React.Component  {
  constructor(props) {
    super(props);
    this.state = {loginEmail:"", loginPassword:"", isFormSubmiting:false}
    this.system = props.system;
    this.buttonSubmitRef = React.createRef();
  }

  componentDidMount() {
    //this.setState({isFormSubmiting:true})
  }

  onChangeField(e) {
    this.setState({[e.currentTarget.name]:e.currentTarget.value});
  }

  onSubmit(e) {
    e.preventDefault();
    if(this.state.isFormSubmiting) {
      return;
    }
    this.setState({isFormSubmiting:true})
    
    console.log("logging in...");
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        console.log(user);
      }
    });

    let self = this;
    firebase.auth().signInWithEmailAndPassword(this.state.loginEmail, this.state.loginPassword)
    .catch(error => {
      // Handle Errors here.
      //var errorCode = error.code;
      var errorMessage = error.message;
      Alert.show(errorMessage);
      self.setState({isFormSubmiting:false});
    });
  }

  render() {
    return(
      <div id="pageLogin">
          <form className="box-brown">
            <div className="boxFormField">
              <label>Email
                <span className="form-field-error hide"></span>
              </label>
              
              <input type="text" value={this.state.loginEmail} onChange={this.onChangeField.bind(this)} name="loginEmail" />
            </div>

            <div className="boxFormField">
              <label>Password
                <span className="form-field-error hide"></span>
              </label>
              <input type="password" value={this.state.loginPassword} onChange={this.onChangeField.bind(this)} name="loginPassword" />
            </div>

            <div className="boxFormField">
                <button ref={this.buttonSubmitRef} id="buttonSubmit" onClick={this.onSubmit.bind(this)}>
                  <span>LOGIN</span>
                </button>
            </div>
          </form>
      
      </div>
    )
  }
}