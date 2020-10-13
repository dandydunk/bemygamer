import React from 'react';

export default class EditProfile1 extends React.Component  {
  constructor(props) {
    super(props);
    this.state = {name:this.props.system.getMember().profile.name,
              isSubmitting:false}
  }

  onChange(e) {
    this.setState({[e.target.name]:e.target.value})
  }

  onSubmit(e) {
    e.preventDefault();
    if(this.state.isSubmitting) {
      return;
    }

    this.setState({isSubmitting:true})

    this.props.system.getMember().saveProfile(JSON.stringify(this.state), ()=>{
      this.setState({isSubmitting:false})
    })
  }

  render() {
    return(
      <form className="box-brown">
          <div>
              <label>Name</label>
              <input type="text" name="name" onChange={this.onChange.bind(this)} value={this.state.name} />
          </div>

          <button onClick={this.onSubmit.bind(this)} className="button buttonSave">SAVE</button>
      </form>
    )
  }
}