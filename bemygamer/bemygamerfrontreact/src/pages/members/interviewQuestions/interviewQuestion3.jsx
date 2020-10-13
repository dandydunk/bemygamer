import React from 'react';
import "../../../sass/interview.scss";

export default class InterviewQuestion1 extends React.Component  {
  constructor(props) {
    super(props);
    this.state = {isSubmitting:false, birthMonth:"", birthYear:"", birthDay:""};

    
    this.days = new Array(31);
    for(let i = 1; i <= 31; i++) {
        this.days[i-1] = <option key={i} value={i}>{i}</option>;
    }

    this.years = []
    for(let i = new Date().getFullYear() - 18; i >= new Date().getFullYear() - 120; i--) {
        this.years.push(<option key={i} value={i}>{i}</option>);
    }
  }

  getBirthDate() {
      if(this.state.birthMonth.length == 0 || this.state.birthDay.length == 0 || this.state.birthYear.length == 0) {
          return null;
      }

      return `${this.state.birthMonth}/${this.state.birthDay}/${this.state.birthYear}`;
  }

    onSubmit(e) {
        e.preventDefault();
        if(this.state.isSubmitting) return;

        this.setState({isSubmitting:true});

        let birthDate = this.getBirthDate();
        if(!birthDate) {
            //alert("Select your birth date before continuing.");
            //return;
        }

        

        this.props.system.getMember()
        .saveFeature({"name":"birthDate", "value":birthDate}, r=>{
            if(r && r.error) {
                alert(r.error.msg);
                this.setState({isSubmitting:false});
                return;
            }
            this.props.onSubmitted();
        }, error=>{
            alert("There was a network error; try again in a moment.");
            this.setState({isSubmitting:false});
        })
    }

  onChangeForm(e) {
      this.setState({[e.target.name]:e.target.value})
  }

  render() {
    return(
      <form className="box-brown" id={this.props.id}>
          <ul>
              <li>
                  <label>What month were you born?</label>
                  <select name="birthMonth" value={this.state.birthMonth} onChange={this.onChangeForm.bind(this)}>
                      <option value=""></option>
                      {this.months}</select>
              </li>
              <li>
                  <label>What day were you born?</label>
                  <select name="birthDay" value={this.state.birthDay} onChange={this.onChangeForm.bind(this)}>
                  <option value=""></option>
                      {this.days}</select>
              </li>
              <li>
                  <label>What year were you born?</label>
                  <select name="birthYear" value={this.state.birthYear} onChange={this.onChangeForm.bind(this)}>
                  <option value=""></option>
                      {this.years}</select>
              </li>
              <li>
                <button onClick={this.onSubmit.bind(this)}>Save</button>
              </li>
          </ul>
      </form>
    )
  }
}