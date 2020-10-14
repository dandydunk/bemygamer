import React from 'react';
import "../sass/index.scss"
import LoadingIcon from '../com/LoadingIcon';
import ActionButton from '../com/ActionButton';
import LoginForm from "../com/LoginForm"
import RegisterForm from '../com/RegisterForm';

export default class IndexPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            inputRegisterEmail: "",
            inputRegisterEmailError: null,
            inputRegisterPassword: "",
            inputRegisterPasswordError: null,
            inputRegisterName: "",
            inputRegisterNameError: null,
            registerFormSubmitting: false
        }

        console.log("this.props.location = ", this.props.location);
    }

    componentDidMount() {
        if(this.props.system.getMember().hasProfile()) {
            window.location = "/members/dashboard/";
            return;
        }

        window.addEventListener("scroll", this.onScroll.bind(this));

        this.initPictures();
    }

    onScroll() {
        let scrollY = window.scrollY + window.innerHeight;
        console.log("scroll Y", scrollY)

        //pictures
        let picturesBox = document.getElementById("pictures");
        let picturesBoxTop = this.getElementTop(picturesBox);
        console.log("pictures box top = ", picturesBoxTop);

        //show the picture box
        if (scrollY >= (picturesBoxTop+100)) {
            if (!this.pictureBoxVisible) {
                this.pictureBoxVisible = true;
                picturesBox.style.transform = "translateX(1vw)";
                picturesBox.style.opacity = 1;
            }
        }

        if (scrollY < picturesBoxTop) {
            if (this.pictureBoxVisible) {
                this.pictureBoxVisible = false;
                picturesBox.style.transform = "translateX(-130vw)";
                picturesBox.style.opacity = 0;
            }
        }

        let contentBoxes = document.querySelectorAll("#content > div");
        
        if(!this.indexVisibleContent) {
            this.indexVisibleContent = 0;
        }

        let contentBoxIndex = 0;
        for(let contentBox of contentBoxes) {
            let contentBoxTop = this.getElementTop(contentBox);
            let style = getComputedStyle(contentBox);
            let contentBoxHeight = contentBox.offsetHeight + parseInt(style.marginTop) + parseInt(style.marginBottom);
            if(scrollY >= contentBoxTop + (contentBoxTop * 0.15)
                && scrollY <= contentBoxTop + contentBoxHeight) {
                    if(this.indexVisibleContent == contentBoxIndex) {
                        break;
                    }

                    this.showPicture(contentBoxIndex);
                    this.hidePicture(this.indexVisibleContent)
                    this.indexVisibleContent = contentBoxIndex;
                    break;
            }

            ++contentBoxIndex;
        }
    }

    getElementTop(e) {
        let i = 0;
        do {
            i += e.offsetTop;
            e = e.offsetParent;
        } while (e);
        return i;
    }

    componentWillUnmount() {
        window.removeEventListener("scroll", this.onScroll.bind(this));
    }

    initPictures() {
        this.pictures = document.querySelectorAll("#pictures > div");
        this.content = document.querySelectorAll("#content div");
        this.index = 0;

        this.showPicture(0);
    }

    showPicture(index) {
        console.log("showing picture index: ", index)
        let picture = this.pictures[index];
        picture.style.transform = "translateX(1vw)";
        picture.style.opacity = 1;
    }
    hidePicture(index) {
        console.log("hiding picture index: ", index)
        let picture = this.pictures[index];
        picture.style.transform = "translateX(100vw)";
        picture.style.opacity = 0;
    }

    componentDidUpdate() {

    }

    render() {
        return (
            <div id="pageIndex">
                <div className="header">
                    <h2 className="color-FE002D">Join this community to find your romantic gamer match. </h2>
                    <h3 className="color-FF5D7A">Browse profiles and chat with gamers with interests that you will enjoy.</h3>
                </div>

                <div style={{display:"flex", width:"100vw", height:"100vh", flexWrap:"wrap", flexShrink:4, alignSelf:"center", justifyContent:"center"}}>
                    <img style={{width:"40vw"}} src="/images/landing/be_my_gamer.png" alt="Be My Gamer" />

                    <div style={{flex:1}}>
                        <LoginForm style={{marginBottom:"5vw"}} system={this.props.system} />
                        <RegisterForm system={this.props.system} />
                    </div>
                </div>

                <div id="pictures" style={{
                    width: "100vw", height: "100vh",
                    position: "sticky",
                    top: 0,
                    left: 0,
                    zIndex: "-1000"
                }}>
                    <div style={{
                        background: "url('/images/landing/be_my_gamer_couch.png')",
                        backgroundSize: "cover"
                    }}>
                    </div>
                    <div style={{
                        background: "url('/images/backgrounds/pokeone.jpg')",
                        backgroundSize: "cover"
                    }}>
                    </div>
                    <div style={{
                        background: "url('/images/landing/be_my_gamer_couch_two.png')",
                        backgroundSize: "cover"
                    }}>
                    </div>
                </div>

                <div id="content">

                    <div>
                        <div className="textBox" style={{background:"black"}}>
                            Minim sunt labore eu consequat voluptate dolor sint eiusmod proident velit incididunt excepteur et. Consequat sint dolore est officia dolore aliquip amet consequat incididunt. Quis commodo ex culpa esse sit irure. Lorem fugiat dolore occaecat esse consequat fugiat culpa labore pariatur anim esse labore.
                        </div>
                    </div>

                    <div>
                        <div className="textBox" style={{background:"#804650"}}>
                            Minim sunt labore eu consequat voluptate dolor sint eiusmod proident velit incididunt excepteur et. Consequat sint dolore est officia dolore aliquip amet consequat incididunt. Quis commodo ex culpa esse sit irure. Lorem fugiat dolore occaecat esse consequat fugiat culpa labore pariatur anim esse labore.
                        </div>
                    </div>

                    <div>
                        <div className="textBox" style={{background:"black"}}>
                            Minim sunt labore eu consequat voluptate dolor sint eiusmod proident velit incididunt excepteur et. Consequat sint dolore est officia dolore aliquip amet consequat incididunt. Quis commodo ex culpa esse sit irure. Lorem fugiat dolore occaecat esse consequat fugiat culpa labore pariatur anim esse labore.
                        </div>
                    </div>
                </div>

            </div>
        )
    }
}