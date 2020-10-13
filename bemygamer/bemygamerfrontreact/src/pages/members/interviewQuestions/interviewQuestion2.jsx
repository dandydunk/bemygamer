import React from 'react';
import "../../../sass/interview.scss";

export default class InterviewQuestion1 extends React.Component  {
  constructor(props) {
    super(props);
    this.state = {isSubmitting:false};
  }

  onSubmit(e) {
      e.preventDefault();
      if(this.state.isSubmitting) return;
      this.setState({isSubmitting:true});

      let a = e.currentTarget.getAttribute("data");
      this.props.system.getMember()
      .saveFeature({"name":"sexualOrientation", "value":a}, r=>{
          if(r && r.error) {
              alert(r.error.msg);
              this.setState({isSubmitting:false});
              return;
          }
          this.props.onSubmitted();
      }, error=>{
        alert("There was a network error; try again in a moment.");
        this.setState({isSubmitting:false});
      })
  }

  render() {
    return(
      <form className="box-brown" id={this.props.id}>
          
      </form>
    )
  }
}