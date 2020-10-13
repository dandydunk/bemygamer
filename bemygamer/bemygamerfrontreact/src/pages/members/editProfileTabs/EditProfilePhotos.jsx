import React from 'react';
import MainTemplate from '../MainTemplate';


export default class EditProfilePhotos extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.system.getMember().getPhotos(result => {
            this.setState({ photos: result.photos });
        });
    }

    componentWillUnmount() {
        this.state.photos.map(f=>{URL.revokeObjectURL(f.url)})
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

        this.state.isSavingPhotos = true;
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

                this.state.isSavingPhotos = false;
                return;
            }

            //this.state.isSavingPhotos = false;
            this.showNextQuestion();
            console.log("photos have been saved.");
        })
    }


    render() {
        if (!this.state.isLoaded) {
            return <h1>Loading...</h1>
        }
        return (
            <section className="transitionAll">
                <label className="title">Upload photos</label>
                <br />
                <input type="file" onChange={this.onChangePhotos.bind(this)} multiple="multiple" accept="image/*" />
                <br />
                <button className="transitionAll button buttonSave"
                    style={{ marginLeft: "100%", opacity: (this.state.photos.length > 0 ? 100 : 50) }}
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
        )
    }
}