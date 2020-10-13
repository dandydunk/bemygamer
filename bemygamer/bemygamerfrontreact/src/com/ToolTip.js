import React from 'react';
//import Tippy from '@tippyjs/react';
//import {roundArrow} from 'tippy.js';
import Tippy,{roundArrow} from '@tippyjs/react/headless';
import 'tippy.js/dist/svg-arrow.css';

export default class ToolTip extends React.Component  {
  render() {
    return(
      <Tippy arrow={roundArrow} placement="top-start" {...this.props} 
      render={attrs => (
        <div style={{backgroundColor:"black",color:"red"}}>
          {this.props.content}
          <div data-popper-arrow=""></div>
        </div>
      )}>
          {this.props.children}
      </Tippy>
    )
  }
}