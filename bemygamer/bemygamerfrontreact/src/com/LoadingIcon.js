import React from 'react';


export default class LoadingIcon extends React.Component  {
  constructor(props) {
    super(props);
  }
  render() {
    return(
      <div {...this.props}>
          <div style={{display:"flex", flexWrap:"nowrap", justifyContent:"center", alignItems:"center"}}>
            <img style={{height:(this.props.imgheight || "50px"), width:(this.props.imgwidth || "50px")}} alt={this.props.message} src="/images/loading/pacman.svg" />
            <span>{this.props.message}</span>
          </div>
      </div>
    )
  }
}