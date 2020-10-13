import React from 'react';
import "../../../sass/interview.scss";

export default class InterviewQuestion1 extends React.Component  {
    constructor(props) {
        super(props);
        this.state = {isSubmitting:false,
                    gameConsoles:[{name:"XBox"}, {name:"PS4"}, {name:"Nintendo"}]};


    }

    onSubmit(e) {
        e.preventDefault();
        if(this.state.isSubmitting) return;

        this.setState({isSubmitting:true});

    }

    onChangeForm(e) {
        //this.setState({[e.target.name]:e.target.value})
    }

    render() {
        return(
            <form className="box-brown" id={this.props.id}>
                <h1>select your favorite game consoles</h1>
                {this.state.gameConsoles && this.state.gameConsoles.map((e,i)=>{
                    return (
                        <div key={i} data-name="{e.name}" style={{backgroundColor:"black", color:"white"}}>
                            {e.name}
                        </div>
                    )
                })}
            </form>
        )
    }
}