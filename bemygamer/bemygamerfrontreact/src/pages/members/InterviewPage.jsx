import React from 'react';
import "../../sass/interview.scss";
import InterviewQuestion1 from "./interviewQuestions/interviewQuestion1"
import InterviewQuestion2 from "./interviewQuestions/interviewQuestion2"
import InterviewQuestion3 from "./interviewQuestions/interviewQuestion3"
import InterviewQuestion4 from "./interviewQuestions/interviewQuestion4"

export default class InterviewPage extends React.Component  {
  constructor(props) {
    super(props);
    this.state = {};
  }

  resizeQuestions(inEvent) {
    let z = 1000;
    let t = 20;
    let pw = window.innerWidth - (this.liList.length*20);
    
    for(let li of this.liList) {
      li.style.width = pw+"px";
      pw += 20;
      if(!inEvent) {
        let liTop = li.getBoundingClientRect().top;
        li.style.transform = "translateY("+(-liTop+t)+"px)";
        li.style.zIndex = z;
        li.style.opacity = "1";
        t += 30;
        z -= 1;
      }
    }
  }

  componentDidMount() {
    this.props.system.restrict();
    if(this.props.system.getMember().hasProfile()) {
      window.location = "/";
    }
  }

  finished() {
      alert("finished");
  }

  render() {
    return(
      <div id="pageInterview">
        <InterviewQuestion1 
                            id="question1" 
                            system={this.props.system} />
          
      </div>
    )
  }
}