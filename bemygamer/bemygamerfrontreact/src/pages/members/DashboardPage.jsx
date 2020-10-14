import React from 'react';
import MemberView from '../../com/MemberView';
import MainTemplate from "../MainTemplate"
import "../../sass/dashboard.scss"
import LoadingPage from '../LoadingPage';

export default class DashboardPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nextMatchLoading: false,
      isLoaded: false,
      unmounted:true,
      memberMatch: {name:""},
      memberMatchFeatures: [],
      latestInboxMessages:[],
      latestLikedMembers:[],
      latestMembersWhoLikedYou:[]
    }
  }

  componentDidMount() {
    this.props.system.checkAuth();

    document.title = "dashboard";
    console.log("mounting the dashboard...");
    this.setState({ unmounted: false });

    this.loadNextMatch(() => {
      this.setState({ isLoaded: true });
      this.getFeatures();
      this.loadCubeGallery();
      this.setState({ isLoaded: true, nextMatchLoading: false });
    });

    this.getLatestInboxMessages();
    this.getLatestLikedMembers();
  }

  componentWillUnmount() {
    console.log("unmounting the dashboard...");
    this.setState({ unmounted: true });
  }

  componentDidUpdate() {
    console.log("dashboard is updating...");
  }

  getLatestInboxMessages() {
    if(!this.state.unmounted) {
      return;
    }
    console.log("checking for inbox messages...");
    this.props.system.getMember().getLatestInboxMessages(result=>{
      this.setState({latestInboxMessages:result})
      setTimeout(()=>{this.getLatestInboxMessages();}, 10000);
    })
  }

  getLatestLikedMembers() {
    this.props.system.getMember().getLatestLikedMembers(result=>{
      this.setState({latestLikedMembers:result})
    })
  }

  onClickInboxMessage(e) {
    e.preventDefault();
    e.currentTarget.setAttribute("disabled", "disabled");
    let memberId = e.currentTarget.getAttribute("data-member-id");
    this.props.history.push(`/members/inbox/${memberId}/`);
  }

  loadCubeGallery() {
    let sideList = [".front", ".back", ".right", ".left", ".top", ".bottom"]
    for (let i = 0; i < sideList.length; i++) {
      if (i >= this.state.memberMatch.photos.length) {
        break;
      }
      let imgPath = this.state.memberMatch.photos[i];
      let c = document.querySelector("#cubeGallery > " + sideList[i]);
      //console.log("cubeGalery = ", c);
      c.style.backgroundImage = "url('" + imgPath + "')";
      c.style.backgroundSize = "150px 150px";
    }
  }

  loadNextMatch(cb) {
    if (this.state.nextMatchLoading) {
      return;
    }

    this.setState({ nextMatchLoading: true });

    this.props.system.getMember().getNextMatch(result => {
      if (!result.memberId) {
        this.state.setState({ memberMatch: null, nextMatchLoading: false });
        return;
      }

      this.setState({ memberMatch: result })
      this.memberMatchPhotosLoaded = 0;
      for (let i = 0; i < result.photos.length; i++) {
        let img = new Image();
        img.onload = () => {
          if (++this.memberMatchPhotosLoaded == result.photos.length) {
            //console.log("all photos are loaded");
            if (cb) cb();
          }
        }
        img.src = result.photos[i];
      }
    })
  }

  getFeatures() {
    let exclude = ["photos", "memberId", "name", "zip", "distance", "matchPercentage"]
    let memberMatchFeatures = [];
    for (let feature in this.state.memberMatch) {
      if (exclude.indexOf(feature) > -1) {
        continue;
      }
      if (this.state.memberMatch[feature].length == 0) {
        continue;
      }
      memberMatchFeatures.push(this.state.memberMatch[feature]);
      //console.log(feature);
    }

    this.setState({ memberMatchFeatures: memberMatchFeatures });
  }

  skipMemberAndGetNextMatch(memberId) {
    if (this.state.likingMember) {
      return;
    }

    this.setState({ likingMember: true, nextMatchLoading: true });
    this.props.system.getMember().skipMemberAndGetNextMatch(memberId, result => {
      if (result.error) {
        if (result.error.msg) {
          alert(result.error.msg);
        }

        else {
          alert("there was an error trying to skip the member.")
        }

        this.setState({ likingMember: false, nextMatchLoading: false });
        return;
      }

      else {
        this.setState({ memberMatch: result });
        this.getFeatures();
        this.loadCubeGallery();
        this.setState({ likingMember: false, nextMatchLoading: false });
      }
    })
  }

  likeMemberAndGetNextMatch(memberId) {
    if (this.state.likingMember) {
      return;
    }

    this.setState({ likingMember: true, nextMatchLoading: true });
    this.props.system.getMember().likeMemberAndGetNextMatch(memberId, result => {
      if (result.error) {
        if (result.error.msg) {
          alert(result.error.msg);
        }

        else {
          alert("there was an error trying to like the member.")
        }

        
        this.setState({ likingMember: false, nextMatchLoading: false });
        return;
      }

      else {
        this.setState({ memberMatch: result });
        this.getLatestLikedMembers();
        this.getFeatures();
        this.loadCubeGallery();
        this.setState({ likingMember: false, nextMatchLoading: false });
      }
    })
  }

  render() {
    return (
      <div id="pageDashboard">
        <LoadingPage style={{display:(this.state.isLoaded ? "none":"block")}} />
        <div className="panel" style={{ display: (this.state.memberMatch ? "block" : "none") }}>
          <div style={{ display: (this.state.nextMatchLoading ? "block" : "none") }}>Loading your next match...</div>
          <div style={{ display: (this.state.nextMatchLoading ? "none" : "block") }}>
            <h2 className="title">
              :::You may like "{this.state.memberMatch.name}", {this.state.memberMatch.age}
              <br />
              :::{this.state.memberMatch.distance}
              <br />
              :::{this.state.memberMatch.matchPercentage}
            </h2>
            <div style={{ display: "flex" }}>
              <div style={{ width: "200px", marginRight: "4vw" }}>
                <div className="qube-perspective">
                  <ul className="qube" id="cubeGallery">
                    <li className="front"></li>
                    <li className="left"></li>
                    <li className="back"></li>
                    <li className="right"></li>
                    <li className="top"></li>
                    <li className="bottom"></li>
                  </ul>
                </div>
                <button style={{ display: "block" }}
                  className="buttonNextImage"
                  onClick={e => { e.preventDefault(); this.likeMemberAndGetNextMatch(this.state.memberMatch.memberId) }}>like</button>
                <button style={{ display: "block" }}
                  className="buttonNextImage"
                  onClick={e => { e.preventDefault(); console.log("pushing to chat"); this.props.history.push(`/members/inbox/${this.state.memberMatch.memberId}/`) }}>chat</button>
                <button style={{ display: "block" }} className="buttonNextImage" 
                onClick={e => { e.preventDefault(); this.skipMemberAndGetNextMatch(this.state.memberMatch.memberId) }}>skip</button>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                {
                  this.state.memberMatchFeatures.map((e, i) => {
                    return (
                      <span className="memberAttribute" key={i}>{e}</span>
                    )
                  })
                }
              </div>
            </div>
          </div>

        </div>

        <div className="panel" style={{display:(this.state.latestInboxMessages ? "block":"none")}}>
          <h2 className="title">:::Your Inbox</h2>
          <ul className="memberList">
            {
              this.state.latestInboxMessages.map((message,i) => {
                return (<MemberView key={i}
                  onClick={e => { e.preventDefault(); this.props.history.push(`/members/inbox/${message.fromMemberId}/`) }}
                  name={message.fromMemberName} pic={message.profilePhoto} />)
              })
            }
          </ul>
        </div>

        <div className="panel" style={{display:(this.state.latestLikedMembers ? "block":"none")}}>
          <h2 className="title">:::Members You Liked</h2>
          <div className="memberList">
            {
              this.state.latestLikedMembers.map((result,i) => {
                return <MemberView
                  key={i}
                  onClick={e => { e.preventDefault(); this.props.history.push(`/members/profile/${result.memberId}/`) }}
                  name={result.name} pic={result.memberProfilePhoto} />
              })
            }
          </div>
        </div>
      </div>
    )
  }
}