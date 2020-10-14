import React from 'react';
import MainTemplate from "../MainTemplate"
import MemberView from '../../com/MemberView';
import "../../sass/inbox.scss"
import LoadingPage from '../LoadingPage';

export default class InboxPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      boxHeight: "10vh",
      isLoaded: false,
      otherMember: { name: "", photos: [] },
      inputChatMessage: "",
      chatMessages:[]
    }
  }

  keyPress(e) {
    if (e.keyCode == 13) {
      this.props.system.publishChatMessage(this.state.otherMember.memberId, ()=>{
        if(this.webWorker) {
          this.webWorker.postMessage();
        }
      })
      this.setState({ inputChatMessage: "" });
      
      
    }
  }

  componentDidMount() {
    document.title = "Inbox"
    if (this.props.match.params.memberId) {
      window.onresize = () => {
        this.setInboxChatHeight();
      };
      this.setInboxChatHeight();
      this.props.system.getMemberProfileById(this.props.match.params.memberId, mp => {
        this.setState({ otherMember: mp, isLoaded: true });
        this.webWorker = new Worker("/inboxWebWorker.js");
        this.webWorker.postMessage({memberId:this.props.match.params.memberId,
                                      lastIndex:0, loop:true, apiServer:this.props.system.apiUrl})
        this.webWorker.onmessage = e => {
          this.setState({chatMessages:[...this.state.chatMessages, ...e.data]});
        }
      })
    }
  }

  getMessages(cb) {
    if(!this.indexMessageStartId) {
      this.indexMessageStartId = 0;
    }

    this.props.system.getChatMessages(this.props.match.params.memberId, this.indexMessageStartId, messages => {
      if (messages.length) {
        this.indexMessageStartId = messages[messages.length-1].id;
        let m = [...this.state.chatMessages, ...messages];
        
        this.setState({chatMessages:m});
      }
      if(cb)cb();
    })
  }

  componentDidUpdate() {
    this.setInboxChatHeight();
    this.refBottomBox.scrollIntoView({behavior:"smooth"});
  }

  componentWillUnmount() {
    window.onresize = null;
    if (this.webWorker) {
      this.webWorker.terminate();
    }
  }

  setInboxChatHeight() {
    let pi = document.getElementById("boxChat");
    if (!pi) {
      console.log("pi not found!");
      return;
    }
    let { top } = pi.getBoundingClientRect();
    let windowHeight = document.documentElement.clientHeight;
    if(this.lastWindowHeight == windowHeight) {
      return;
    }

    this.lastWindowHeight = windowHeight;

    let diff = windowHeight - top;

    this.setState({ boxHeight: diff + "px" });
    console.log("diff = ", diff);
    console.log("top = ", top);
    console.log("windowHeight = ", windowHeight);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value })
    if (e.target.value.length == 0) {
      return;
    }
    this.props.system.saveChatMessage(e.target.value, this.state.otherMember.memberId);
  }

  formatDateTime(ft) {
    ft = new Date(ft);
    return (ft.getMonth()+1)+"/"+ft.getDate()+"/"+ft.getFullYear()+" "+ft.getHours()+" "+ft.getMinutes()+":"+ft.getSeconds();
  }

  renderChat() {
    return (
      <div id="pageInboxChat">
        <LoadingPage message="Loading your chat..." show={(!this.state.isLoaded).toString()} />
        <div className="center">
          <h1>Chatting With, {this.state.otherMember.name}</h1>
          <img src={this.state.otherMember.photos[0]} width="100px" height="100px" />
        </div>
        <div id="boxChat" style={{ height: this.state.boxHeight }}>
          <div className="boxChatMessages" style={{overflowX:"scroll"}}>
            {
              this.state.chatMessages.map(message => {
                return (
                  <div key={message.id}>
                      <div style={{textDecoration:"underline", fontWeight:"bold"}}>{message.fromMemberName}</div>
                      <div>{this.formatDateTime(message.dateTimeSent)}</div>
                      <div>
                  {message.message}
                        </div>
                  </div>
                )
              })
            }
            <div ref={r=>{this.refBottomBox = r;}}></div>
          </div>
          <input autoComplete="off" value={this.state.inputChatMessage} onKeyDown={this.keyPress.bind(this)} onChange={this.onChange.bind(this)}
            name="inputChatMessage" className="inputChatMessage" type="text" />
        </div>

      </div>
    )
  }

  renderInbox() {
    return (
      <div id="pageInbox">

      </div>
    )
  }

  render() {
    let match = this.props.match.params.memberId;
    if (match) {
      return this.renderChat();
    }

    return this.renderInbox();
  }
}