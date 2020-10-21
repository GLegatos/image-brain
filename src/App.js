import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Navigation from './components/Navigation/Navigation';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import SubjectBox from './components/SubjectBox/SubjectBox'
import './App.css';


const particlesOptions = {
      particles: {
        number: {
            value: 65,
            density: {
              enable: true,
              value_area: 1000
            }
        },
        line_linked: {
          enable: true,
          color: {
            value: '#DC9E82'
          }
        },
        size: {
            value: 3
        },
        color: {
          value: '#DC9E82'
        }
    },
}   

const initialState = {
    input: '',
    imageUrl:'',
    box: {},
    route: 'signin',
    isSignedIn: false,
    subject: '',
    user: {
      id:'',
      name: '',
      password:'',
      email: '',
      entries: 0,
      joined: ''
    }
  }

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

loadUser = (data) => {
  this.setState({user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined  
  }})
}
  detectSubject = (data) => {
      const imgsubject = data.outputs[0].data.concepts[0].name
      this.setState({subject: imgsubject});
    };


    onInputChange = (event) => {
      this.setState({input: event.target.value});
    }

    onSubmit = () => {
      this.setState({imageUrl: this.state.input});
      fetch('https://mighty-dusk-13617.herokuapp.com/imageurl', {
            method: 'post',
            headers: {'content-type': 'application/json'},
            body: JSON.stringify({
                input: this.state.input
            })
        })
      .then(response => response.json())
      .then(response => {
        if (response) {
          fetch('https://mighty-dusk-13617.herokuapp.com/image', {
            method: 'put',
            headers: {'content-type': 'application/json'},
            body: JSON.stringify({
                id: this.state.user.id
            })
        })
          .then(response => response.json())
          .then(count => {
            this.setState(Object.assign(this.state.user, {entries: count }))
          })
          .catch(console.log);
        }
        this.detectSubject(response);
        })
        .catch(err => console.log(err));
    }

    onRouteChange = (route) => {
      if (route === 'signout') {
        this.setState(initialState)
      } else if (route === 'home') {
        this.setState({isSignedIn: true})
      }
      this.setState({route: route});
    }

    render () {
      return (
        <div className="App">
                <Particles className='particles'
                  params={particlesOptions}
                />
          <Navigation isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange} />
          { this.state.route === 'home' 
            ? <div>
            <Logo />
            <Rank name={this.state.user.name} entries={this.state.user.entries}/>
            <ImageLinkForm 
            onInputChange={this.onInputChange} 
            onSubmit={this.onSubmit}/>
            <div>
            <SubjectBox subject={this.state.subject}/>
            <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl}
            />
          </div>  
          </div>  
            : (
              this.state.route === 'signin' ?
              <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
              : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
            )
          }
         
        </div> 
      );
    }
  }

export default App;
