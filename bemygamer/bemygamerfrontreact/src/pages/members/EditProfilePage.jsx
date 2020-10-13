import React from 'react';
import MainTemplate from '../MainTemplate';
import EditProfile1 from "./editProfileTabs/EditProfile1"
import "../../sass/editProfilePage.scss"

export default class EditProfilePage extends React.Component {
  constructor(props) {
    super(props);
  }



  render() {
    console.log("rendering edit profile")
    return (
      <div id="pageEditProfile">
        <h1>Edit Your Profile</h1>

        <EditProfile1 {...this.props} />
      </div>
    )
  }
}