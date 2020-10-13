import React from 'react';


export default class MemberView extends React.Component  {
  render() {
    return(
        <button style={{width:this.props.width || "200px", 
        height:this.props.height || "200px"}} className="buttonMemberView" data-member-id={this.props.id} onClick={this.props.onClick}>
            <img alt="profile" src={this.props.pic} 
              style={{width:this.props.width || "150px", 
                  height:this.props.height || "150px"}} />
            <div>{this.props.name}</div>
        </button>
    )
  }
}