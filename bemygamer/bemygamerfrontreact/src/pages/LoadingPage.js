import React from 'react';
import "../sass/loadingPage.scss"

export default class LoadingPage extends React.Component  {
  render() {
    return(
      <div style={{display:(this.props.show=="true" ? "block":"none")}} id="pageLoading" {...this.props}>
          <h1>{this.props.message || "Loading the community...Stand by..."}</h1>
          <div style={{display:"flex", flexWrap:"0", flexShrink:"1"}}>
            <img alt="loading the system..." width="200px" height="200px" src="/images/loading/pacman.svg" />
            <img alt="loading the system..." width="200px" height="200px" src="/images/loading/c1.svg" />
          </div>
      </div>
    )
  }
}