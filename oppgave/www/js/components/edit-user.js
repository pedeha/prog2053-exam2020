import { LitElement, html, css } from "../../node_modules/lit-element/lit-element.js";

class EditUser extends LitElement {
  static get properties() {
    return {
      user: { type: Object }
    };
  }

  constructor() {
    super();
    this.newUserInfo = {
        uname: '',
        firstName: '',
        lastName: '',
        oldpwd: '', // this is called oldPwd in `users-list.js`, 
                    //but it seems to be lower-case in /api/updateUser.php
        pwd: ''
    };
  }

  _sendForm(e) {
    // assign username & uid to the new information
    this.newUserInfo.uname = this.user.uname
    this.newUserInfo.uid = this.user.uid
    let form = JSON.stringify(this.newUserInfo)

    // Send POST request with new info    
    fetch("api/updateUser.php", {
      method: "POST",
      body: form,
      headers: {
        "content-type": "application/json",
      },
    }).then( (res) => {
      res.text().then(text => {console.log(text)})
    }).finally( () => {
      window.location.reload()
    });
  }

  _handleChange(e) {
    this.newUserInfo[e.target.id] = e.target.value
  }

  render() {
    // Don't render anything if a user hasn't been assigned to this.user
    if (Object.keys(this.user).every(k => {return this.user[k] == ""})) {
      return html``
    }

    // This became a little bit more clumsy than intended, because I thought the data should be sent as JSON, not form-data,
    // because the server always responds with JSON.
    // This was actually originally a <form> with action="/api/updateUser.php" and method="POST", but I don't have time to change it back now.
    return html`
      <h5>Editing ${this.user.uname}</h5>
      <div id="editForm">
        <!-- First name -->
        <label for="firstName">First name:</label><br>
        <input type="text" id="firstName" name="firstName" value=${this.user.firstName} @change="${this._handleChange}"><br>
        
        <!-- Last name -->
        <label for="lastName">Last name:</label><br>
        <input type="text" id="lastName" name="lastName" value=${this.user.lastName} @change="${this._handleChange}"><br>
        
        <!-- Old password -->
        <label for="oldpwd">Old password:</label><br>
        <input type="text" id="oldpwd" name="oldpwd" @change="${this._handleChange}"><br>

        <!-- New password -->
        <label for="pwd">New Password:</label><br>
        <input type="text" id="pwd" name="pwd" @change="${this._handleChange}"><br>

        <!-- Submit button -->
        <button @click="${this._sendForm}">Submit</button>
      </div>
    `;
  }

}
customElements.define('edit-user', EditUser);
