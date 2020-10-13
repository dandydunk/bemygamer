import React from 'react';
import LoadingIcon from './LoadingIcon';


export default class ActionButton extends React.Component  {
  render() {
    return(
      <button {...this.props}>
          <span style={{display:(this.props.isExecuting ? "none":"block")}}>{this.props.content}</span>
          <img style={{display:(this.props.isExecuting ? "block":"none")}} width="50%" alt="loading" src="/images/loading/pacman.svg" />
      </button>
    )
  }
}