import React from 'react';
import LoadingPage from '../LoadingPage';
import "../../sass/profilePage.scss"

export default class ProfilePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            otherMember: {},
            memberMatchFeatures: []
        }
    }

    componentDidMount() {
        console.log("this.props.match.params.memberId = ", this.props.match.params.memberId);
        this.props.system.getMemberProfileById(this.props.match.params.memberId, mp => {
            console.log("mp - ", mp)
            this.setState({ otherMember: mp});
            this.getFeatures();
            console.log("herenow")
            this.loadCubeGallery();
            console.log("hewfijwoiej")
            this.setState({ isLoaded: true });
            console.log("INIT done")
        })
    }

    loadCubeGallery() {
        if(!this.state.otherMember || !this.state.otherMember.photos) {
            return;
        }
        let sideList = [".front", ".back", ".right", ".left", ".top", ".bottom"]
        for (let i = 0; i < sideList.length; i++) {
            if (i >= this.state.otherMember.photos.length) {
                break;
            }
            let imgPath = this.state.otherMember.photos[i];
            console.log("this.state.otherMember.photos[i] = ", this.state.otherMember.photos[i]);
            let c = document.querySelector("#cubeGallery > " + sideList[i]);
            //console.log("cubeGalery = ", c);
            c.style.backgroundImage = "url('" + imgPath + "')";
            c.style.backgroundSize = "150px 150px";
        }
    }

    getFeatures() {
        let exclude = ["photos", "memberId", "name", "zip", "age", "distance", "matchPercentage"]
        let memberMatchFeatures = [];
        for (let feature in this.state.otherMember) {
            if (exclude.indexOf(feature) > -1) {
                continue;
            }
            if (this.state.otherMember[feature].length == 0) {
                continue;
            }
            memberMatchFeatures.push(this.state.otherMember[feature]);
            console.log(feature);
        }

        this.setState({ memberMatchFeatures: memberMatchFeatures });
    }

    render() {
        return (
            <div id="pageProfile" style={{background:"black", 
                                            opacity:".9", borderRadius:"10vw", 
                                            borderBottomLeftRadius:"0", 
                                            borderBottomRightRadius:"0",
                                            minHeight:"100vh", width:"80vw", margin:"0 auto"}}>
                <LoadingPage style={{ display: (this.state.isLoaded ? "none" : "block") }} />
                <h1 style={{textAlign:"center", marginBottom:"2vw"}}>
                "{this.state.otherMember.name}", {this.state.otherMember.age}
                <br />
                <i style={{fontSize:".7em"}}>{this.state.otherMember.distance}</i><br />
                <span style={{fontSize:".6em"}}>{this.state.otherMember.matchPercentage}</span>
                </h1>
                <div style={{ width: "200px", margin:"0 auto", marginBottom:"3vw" }}>
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
                </div>

                <div style={{textAlign:"center", marginBottom:"2vw"}}>
                    <button style={{ }}
                        className="button buttonSave"
                        onClick={e => { e.preventDefault(); 
                                        this.props.history.push(`/members/inbox/${this.state.otherMember.memberId}/`) 
                                        }}>chat</button>
                </div>

                <div className="wrapingBox">
                    {
                        this.state.memberMatchFeatures.map((e, i) => {
                            return (
                                <span className="memberAttribute" key={i}>{e}</span>
                            )
                        })
                    }
                </div>
            </div>
        )
    }
}