import React from 'react';
import LoadingIcon from './LoadingIcon';


export default class RegisterForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = { isBeingSubmitted: false }
    }


    onSubmit(e) {
        e.preventDefault();
        if (this.state.isBeingSubmitted) {
            return;
        }

        this.setState({
            isBeingSubmitted: true,
            inputRegisterEmailError: "",
            inputRegisterNameError: "",
            inputRegisterPasswordError: "",
            registerFormError: ""
        })

        let m = this.props.system.getMember();
        m.name = this.state.inputRegisterName;
        m.email = this.state.inputRegisterEmail;
        m.password = this.state.inputRegisterPassword;
        m.register(response => {
            //this.props.history.push("/members/dashboard/");
            if (response.error) {
                let error = response.error;
                alert("Please fix the register form errors.")
                if (error.field === "email") {
                    this.inputRegisterEmail.focus();
                    this.setState({ inputRegisterEmailError: error.msg })

                    //this.refInputRegisterEmail.current.focus();
                }

                else if (error.field === "name") {
                    this.inputRegisterName.focus();
                    this.setState({ inputRegisterNameError: error.msg })
                    //this.refInputRegisterEmail.current.focus();
                }

                else if (error.field === "password") {
                    this.inputRegisterPassword.focus();
                    this.setState({ inputRegisterPasswordError: error.msg })
                    //this.refInputRegisterEmail.current.focus();
                }

                else {
                    this.setState({ registerFormError: error.msg })
                    this.inputVoidFormError.focus();
                }
                this.setState({ isBeingSubmitted: false });
            }

            else {
                console.log("props = ", this.props)
                window.location = "/members/dashboard/";
            }
        }, error => {
            alert("There was a network error, please try again in a moment.");
            console.log(error);
            this.setState({ isBeingSubmitted: false });
            this.inputVoidFormError.focus();
        });
    }

    onChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }


    render() {
        return (
            <form className="box-brown" {...this.props}>
                <div>
                    <p className="error">{this.state.inputRegisterNameError}</p>
                    <input placeholder="What should your name be?" 
                    ref={(input) => { this.inputRegisterName = input; }}
                     type="text" className="input" 
                     onChange={this.onChange.bind(this)} name="inputRegisterName" />
                </div>

                <div>
                    <p className="error">{this.state.inputRegisterEmailError}</p>
                    <input placeholder="What is your email address?" 
                    ref={input => { this.inputRegisterEmail = input }} 
                    type="email" className="input"
                    onChange={this.onChange.bind(this)} name="inputRegisterEmail" />
                </div>


                <div>
                    <p className="error">{this.state.inputRegisterPasswordError}</p>
                    <input 
                    placeholder="What is your secret code?" 
                    type="password" 
                    className="input"
                    ref={input => { this.inputRegisterPassword = input }} onChange={this.onChange.bind(this)} name="inputRegisterPassword" />
                </div>

                <div>
                    <button id="buttonSubmit" className="button buttonSave" onClick={this.onSubmit.bind(this)}>
                        <span style={{ display: (this.state.isBeingSubmitted ? "none" : "block") }}>Become a Member</span>
                        <LoadingIcon width="50px" height="50px"
                            message="making you a member..."
                            style={{ display: (this.state.isBeingSubmitted ? "block" : "none") }} />
                    </button>

                    <input ref={i => { this.inputVoidFormError = i }} type="text" style={{ display: "none" }} />
                    <p className="error">{this.state.registerFormError}</p>
                </div>
            </form>
        )
    }
}