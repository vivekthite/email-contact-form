import React, {Component} from 'react';
import './App.css';
import config from './config-dev';

class App extends Component {
  render(){
    return (
      <div className="App">
        <ContactForm></ContactForm>
      </div>
    );
  } 
}

class ContactForm extends Component {
  constructor(props){
    super(props);
    this.state = {
      message:""
    };
  }
  sendContactForm = (event) => {
    event.preventDefault();

    console.log("clicked on button");

    const messageData = {
      name: this.refs.name.value,
      email:this.refs.email.value,
      message:this.refs.message.value
    };

    console.log("Data",messageData);
    fetch(config.submitContactFormUrl,{
      method: "POST",
      mode: "cors",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify(messageData)
    })
    .then(response => response.json())
    .then(response => {
      console.log("Success : ",response);
      this.setState({message:response.message});
    })
    .catch(error => console.log("Error : ",error))

    this.refs.contactForm.reset();
  }
  render(){
    return (

        <form ref="contactForm">
          <h1>Contact Us</h1>
          <label htmlFor="name">Enter name:</label>
          <input ref="name" type="text" required></input>
          <br/>
          <label htmlFor="email">Enter email:</label>
          <input ref="email" type="email" required></input>
          <br/>
          <label htmlFor="message">Enter Message:</label>
          <textarea ref="message" rows="6" cols="40"></textarea>
          <hr/>
          <button onClick={this.sendContactForm}>Send Message</button>
          <div>{this.state.message}</div>
        </form>
     
    );
  } 
}

export default App;
