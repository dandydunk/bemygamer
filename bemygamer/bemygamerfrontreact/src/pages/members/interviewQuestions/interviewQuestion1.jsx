import React from 'react';
import LoadingIcon from '../../../com/LoadingIcon';
import "../../../sass/interview.scss";

export default class InterviewQuestion1 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rangeBirthDay: 1,
      rangeBirthYear: 2002,
      weight: 120,
      rangeHeight: 0,
      isLoaded: false,
      heightFeet: 4,
      heightInches: 0,
      zip: "",
      photos: [],
      isNew: true,
      isSubmittingZipCode: false,
      gameConsoles:[]
    };
    this.questionBlah = [{
      name: "smokeTabacco", label: "Do you smoke tabacco?"
    }, {
      name: "drinkAlcohol", label: "Do you drink alcohol?"
    }, {
      name: "smokeWeed", label: "Do you smoke weed?"
    }, {
      name: "havePiercings", label: "Do you have piercings?"
    }, {
      name: "wantChildren", label: "Do you want children?"
    }, {
      name: "haveChildren", label: "Do you have children?"
    }, {
      name: "haveBodyArt", label: "Do you have body art/tatoos?"
    }, {
      name: "party", label: "Do you party?",
    }, {
      name: "smokeTabaccoDesired", label: "Do you want someone who smokes tabacco?"
    }, {
      name: "drinkAlcoholDesired", label: "Do you want someone who drinks alcohol?"
    }, {
      name: "smokeWeedDesired", label: "Do you want someone who smokes weed?"
    }, {
      name: "havePiercingsDesired", label: "Do you want someone who has piercings?"
    }, {
      name: "wantChildrenDesired", label: "Do you want someone who wants children?"
    }, {
      name: "haveChildrenDesired", label: "Do you want someone who has children?"
    }, {
      name: "haveBodyArtDesired", label: "Do you want someone who has body art/tatoos?"
    }, {
      name: "partyDesired", label: "Do you want someone who likes to party?",
    }, {
      name: "ageOlderDesired", label: "If you want someone who is older than you?",
    },
    {
      name: "weightDesired", label: "Do you want someone who weights more than you?",
    },
    {
      name: "isTallerDesired", label: "Do you want someone who is taller than you?",
    },
    {
      name: "distanceDesired", label: "About how many miles from you, should your match be?",
      options: [{ name: "10", "db": 10 },
      { name: "20", "db": 20 },
      { name: "30", "db": 30 },
      { name: "40", "db": 40 },
      { name: "50", "db": 50 },
      { name: "Don't Care", "db": null }]
    }];

    for (let q of this.questionBlah) {
      if (!q.options) {
        if (q.name.indexOf("Desired") > -1) q.options = [{ name: "Don't Care", "db": null },
        { name: "Yes", "db": 1 },
        { name: "No", "db": 0 }];
        else q.options = [{ name: "Yes", "db": 1 }, { name: "No", "db": 0 }];
      }
    }
  }

  componentDidMount() {
    this.init();
    this.setState({ isLoaded: true });

  }

  componentDidUpdate() {
    if (!this.firstUpdate && this.state.isLoaded) {
      this.showNextQuestion();
      this.firstUpdate = true;
    }
  }

  componentWillUnmount() {
    if (!this.state.photos) {
      return;
    }
    this.state.photos.map(f => { URL.revokeObjectURL(f.url) })
  }

  finished() {
    let data = JSON.stringify(this.state);
    console.log("sending profile data to server ", data);
    this.props.system.getMember().saveProfile(data, e => {
      console.log("finished!!kowq");
      if (e && e.error) {
        alert("There was an error saving the profile..");
        return;
      }
      console.log("redirecvting...");
      window.location = "/members/";
    }, () => {
      alert("There was a network error; try again later.")
    })
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value })
  }

  onChangeHeight(e) {
    let v = e.target.value;
    let feet = 4 + (Math.floor(v / 12));
    let inches = e.target.value % 12;
    this.setState({ [e.target.name]: e.target.value, heightFeet: feet, heightInches: inches })
  }

  init() {
    let sections = document.querySelectorAll("#" + this.props.id + " > div > section");
    this.sections = [];
    for (let s of sections) {
      s.style.opacity = 0;
      s.style.position = "absolute";
      s.style.top = 0;
      s.style.left = 0;
      s.style.transform = "translateX(-100vw)";
      this.sections.push(s);
    }

    this.sectionIndex = 0;
  }

  showNextQuestion() {
    if (!this.sectionIndex) {
      this.sections[this.sectionIndex].style.opacity = 1;
      this.sections[this.sectionIndex].style.transform = "translateX(1vw)";
    }
    else {
      let previous = this.sections[this.sectionIndex - 1];
      let now = this.sections[this.sectionIndex];

      previous.style.transform = "translateX(100vw)";
      previous.style.opacity = 0;

      now.style.opacity = 1;
      now.style.transform = "translateX(1vw)";
    }
    ++this.sectionIndex;
    if (this.sectionIndex >= this.sections.length) {
      this.finished();
      return;
    }
  }

  onClickZipCodeSubmit(e) {
    e.preventDefault();
    if (this.state.isSubmittingZipCode || !this.state.zip.length) {
      return;
    }

    this.setState({ isSubmittingZipCode: true })
    this.props.system.getLocationFromZipCode(this.state.zip, result => {
      if (result.error) {
        if (result.error.msg) {
          alert(result.error.msg);
          this.setState({ isSubmittingZipCode: false })
        }
      }
      else {
        this.setState({ ...result });
        this.showNextQuestion();
      }
    }, error => {
      alert("There was a network error, try again in a moment");
      this.setState({ isSubmittingZipCode: false })
    })
  }

  onClickPhotos(e) {
    e.preventDefault();
  }

  onChangePhotos(e) {
    //console.log("e.target.files = ", e.target.files);
    let f = [];
    for (let file of e.target.files) {
      file.isLoaded = false;
      file.url = URL.createObjectURL(file)
      f.push(file);
    }

    this.setState({ photos: [...this.state.photos, ...f] })
  }

  onSavePhotos(e) {
    e.preventDefault();

    if (this.state.isSavingPhotos) {
      return;
    }

    if (!this.state.photos.length) {
      alert("Choose some photos to save first.");
      return;
    }

    this.setState({isSavingPhotos:true});
    console.log("saving photos...");
    this.props.system.getMember().savePhotos(this.state.photos, e => {
      if (e.error) {
        if (e.error.msg) {
          alert(e.error.msg);
        }
        else {
          alert("Unknown error saving your photos..");
          console.log(e);
        }

        this.setState({isSavingPhotos:false});
        return;
      }

      //this.state.isSavingPhotos = false;
      this.showNextQuestion();
      console.log("photos have been saved.");
    })
  }

  render() {
    return (
      <form className="box-brown" id={this.props.id}>
        <div>
        <section className="transitionAll wrapingBox">
            <label className="title">What game consoles do you play?</label>
            <br />

            <div className="wrapingBox">
              {this.props.system.getDb().gameConsoles
                .map((e, i) => <button style={{ margin: "1vw" }}
                  onClick={(me) => {
                    me.preventDefault();
                    let indexE = this.state.gameConsoles.indexOf(e);
                    let gc = this.state.gameConsoles;
                    if(indexE > -1) {
                      gc.splice(indexE, 1);
                    }
                    else {
                      gc.push(e);
                    }
                    this.setState({ gameConsoles: gc });
                    //this.showNextQuestion();
                  }}
                  className={"button buttonCheckBox " + (this.state.gameConsoles.indexOf(e) > -1 ? "selectedButton" : "")} key={e}>{e}</button>)}
              <button 
                onClick={
                  e=>{
                    e.preventDefault();
                    if(this.state.gameConsoles.length) {
                      this.showNextQuestion();
                    }
                  }
                }
               style={{display:(this.state.gameConsoles.length ? "block":"none")}} className="button buttonSave">SAVE</button>
            </div>
          </section>

          <section className="transitionAll">
            <input type="text" onChange={this.onChange.bind(this)}
              name="zip" className="input" value={this.state.zip} placeholder="What is your zip code?" />
            <br />
            <button style={{ marginLeft: "100%", display: (this.state.zip.length > 0 ? "block" : "none") }} className="button buttonSave"
              onClick={this.onClickZipCodeSubmit.bind(this)}>
              <span style={{ "display": (this.state.isSubmittingZipCode ? "none" : "block") }}>SAVE</span>
              <LoadingIcon width="50px" height="50px" message="saving your location"
                style={{ "display": (this.state.isSubmittingZipCode ? "block" : "none") }} />
            </button>
          </section>

          <section className="transitionAll">
            <label className="title">Upload photos</label>
            <br />
            <input type="file" onChange={this.onChangePhotos.bind(this)} multiple="multiple" accept="image/*" />
            <br />
            <button className="transitionAll button buttonSave"
              style={{ marginLeft: "100%", opacity: (this.state.photos.length > 0 ? 100 : 0) }}
              onClick={this.onSavePhotos.bind(this)}>
              <span style={{ "display": (this.state.isSavingPhotos ? "none" : "block") }}>SAVE</span>
              <LoadingIcon width="50px" height="50px" message="saving your photos"
                style={{ "display": (this.state.isSavingPhotos ? "block" : "none") }} />
            </button>

            <div id="photosBox" className="wrapingBox">
              {
                this.state.photos.map((e, i) => {
                  return (
                    <div key={i} style={{ margin: "1vw" }}>
                      <img style={{ display: (e.isLoaded ? "none" : "block"), width: "20vw", height: "20vw" }}
                        alt="uploading to profile"
                        src={e.url} />
                      <button onClick={s => {
                        s.preventDefault();
                        let f = [...this.state.photos];
                        f.splice(i, 1);
                        this.setState({ photos: f })
                      }} className="button buttonRemove">remove</button>
                    </div>
                  )
                })
              }
            </div>
          </section>

          {this.questionBlah.map((q, ii) => {
            return (
              <section className="transitionAll" key={ii}>
                <label className="title">{q.label}</label>
                <br />
                <div className="wrapingBox">
                  {q.options.map((o, i) => {
                    return (
                      <button style={{ margin: "1vw" }}
                        onClick={(me) => { me.preventDefault(); this.setState({ [q.name]: o.db }); this.showNextQuestion(); }}
                        className={"button buttonCheckBox" + (this.state[q.name] === o.db ? "selectedButton" : "")}
                        key={i}>{o.name}</button>
                    )
                  })}
                </div>
              </section>
            )
          })}

          <section className="transitionAll wrapingBox">
            <label className="title">What education level do you want someone to have?</label>
            <br />

            <div className="wrapingBox">
              {this.props.system.getDb().educationLevels
                .map((e, i) => <button style={{ margin: "1vw" }}
                  onClick={(me) => {
                    me.preventDefault();
                    this.setState({ educationLevelDesired: e });
                    this.showNextQuestion();
                  }}
                  className={"button buttonCheckBox " + (this.state.educationLevel === e ? "selectedButton" : "")} key={e}>{e}</button>)}
              <button style={{ margin: "1vw" }}
                onClick={(me) => {
                  me.preventDefault();
                  this.setState({ educationLevelDesired: null });
                  this.showNextQuestion();
                }} className={"button buttonCheckBox" + (this.state.educationLevel === null ? "selectedButton" : "")}>Don't Care</button>
            </div>
          </section>



          <section className="transitionAll">
            <label className="title">You are a...</label>
            <br />
            <div className="wrapingBox">
              {this.props.system.getDb().genders
                .map((e, i) => <button style={{ margin: "1vw" }}
                  onClick={(me) => { me.preventDefault(); this.setState({ gender: e }); this.showNextQuestion(); }}
                  className={"button buttonCheckBox " + (this.state.gender === e ? "selectedButton" : "")} key={e}>{e}</button>)}
            </div>
          </section>

          <section className="transitionAll">
            <label className="title">You are...</label>
            <br />
            <div className="wrapingBox">
              {this.props.system.getDb().sexualOrientations
                .map((e, i) => <button style={{ margin: "1vw" }}
                  onClick={(me) => { me.preventDefault(); this.setState({ sexualOrientation: e }); this.showNextQuestion(); }}
                  className={"button buttonCheckBox " + (this.state.sexualOrientation === e ? "selectedButton" : "")} key={e}>{e}</button>)}
            </div>
          </section>

          <section className="transitionAll">
            <label className="title">Your education level...</label>
            <br />
            <div className="wrapingBox">
              {this.props.system.getDb().educationLevels
                .map((e, i) => <button style={{ margin: "1vw" }}
                  onClick={(me) => { me.preventDefault(); this.setState({ educationLevel: e }); this.showNextQuestion(); }}
                  className={"button buttonCheckBox " + (this.state.educationLevel === e ? "selectedButton" : "")} key={e}>{e}</button>)}
            </div>
          </section>

          <section className="transitionAll wrapingBox">
            <label className="title">your birth month is...</label>
            <br />
            <div className="wrapingBox">
              {["January", "February", "March", "April", "May", "June", "July",
                "August", "September", "October", "November", "December"]
                .map((e, i) => <button style={{ margin: "1vw" }}
                  onClick={(me) => { me.preventDefault(); this.setState({ birthMonth: i + 1 }); this.showNextQuestion(); }}
                  className={"button buttonCheckBox " + (this.state.birthMonth === e ? "selectedButton" : "")} key={e}>{e}</button>)}
            </div>
          </section>

          <section className="transitionAll wrapingBox">
            <label className="title">your birth day is... {this.state.rangeBirthDay}</label>
            <br />
            <input type="range" className="input" name="rangeBirthDay"
              onChange={this.onChange.bind(this)} value={this.state.rangeBirthDay} min="1" max="31" />
            <br />
            <button className="button buttonSave" style={{ marginLeft: "100%" }}
              onClick={e => { e.preventDefault(); this.showNextQuestion(); }}>NEXT</button>

          </section>

          <section className="transitionAll wrapingBox">
            <label className="title">your birth year is... {this.state.rangeBirthYear}</label>
            <br />
            <input type="range" className="input" name="rangeBirthYear" onChange={this.onChange.bind(this)} value={this.state.rangeBirthYear} min="1920" max="2002" />
            <br />
            <button style={{ marginLeft: "100%" }} className="button buttonSave"
              onClick={e => { e.preventDefault(); this.showNextQuestion(); }}>NEXT</button>

          </section>

          <section className="transitionAll wrapingBox">
            <label className="title">your height is... {this.state.heightFeet}'{this.state.heightInches}</label>
            <br />
            <input type="range" className="input" name="rangeHeight"
              onChange={this.onChangeHeight.bind(this)}
              value={this.state.rangeHeight} min="0" max="44" />
            <br />
            <button style={{ marginLeft: "100%" }} className="button buttonSave"
              onClick={e => { e.preventDefault(); this.showNextQuestion(); }}>NEXT</button>
          </section>

          <section className="transitionAll wrapingBox">
            <label className="title">you weight... {this.state.weight} pounds</label>
            <br />
            <input type="range" name="weight" className="input"
              onChange={this.onChange.bind(this)}
              value={this.state.weight} min="50" max="600" />
            <br />
            <button style={{ marginLeft: "100%" }} className="button buttonSave"
              onClick={e => { e.preventDefault(); this.showNextQuestion(); }}>NEXT</button>

          </section>

          <section>
            <LoadingIcon width="100" height="100" message="Creating your profile..." />
          </section>
        </div>

      </form>
    )
  }
}