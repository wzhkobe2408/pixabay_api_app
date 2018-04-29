import React, { Component } from 'react';
import './App.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import TextField from 'material-ui/TextField';
import {GridList, GridTile} from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import Subheader from 'material-ui/Subheader';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import {Tabs, Tab} from 'material-ui/Tabs';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      baseUrl: 'https://pixabay.com/api/?key=8769981-1bf5255e1a6deb19f58f119f9',
      searchItem:'',
      data: [],
      page: 1,
      open: false,
      currentImg: '',
      imageTypeArr: ["all", "photo", "illustration", "vector" ],
      imageType: 'all'
    }
  }

  style={
    container: {
      width: '90%',
      margin: '0 auto',
      minWidth: '600px'
    },
    navBar: {
      backgroundColor: '#212121'
    },
    bigImg: { 
      backgroundColor:'#ffffff', 
      boxShadow: '0 0 6px 1px rgba(0,0,0,0.1)',
      padding: '10px',
      position:'fixed',
      top: '50%', 
      left: '50%', 
      transform: 'translate(-50%,-50%)',
      zIndex: 20,
      width: '800px',
      height: '460px',
      borderRadius: '4px'
    }
  }

  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
  };

  searchRequest = () => {
    this.setState({
      data: []
    })
    fetch(`${this.state.baseUrl}&q=${this.state.searchItem}&page=${this.state.page}&image_type=${this.state.imageType}`)
      .then(res => res.json())
      .then(data => {
        this.setState({
          data: data.hits
        })
      })
      .catch(e => {
        console.log('Error happened')
      })
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleKeyPress = callback => event => {
    if (event.key === 'Enter') {
      this.setState({
        data:[],
        page: 1
      },callback)
    }
  }

  updatePage(payload) {
    this.setState({
      page: this.state.page + payload
    }, this.searchRequest)
  }

  openBigImg(largeImageURL) {
    this.setState({
      currentImg: largeImageURL
    },this.handleOpen)
  }

  changeFilterType(imageType) {
    console.log(imageType)
    this.setState({
      imageType: imageType
    },this.searchRequest)
  }

  render() {
    let result;
    let subHeader;
    let tagList = this.state.imageTypeArr.map((imageType,index) => (
        <Tab onActive={() => { this.changeFilterType(imageType) } } key={index} label={imageType}>
        </Tab>)
      )
    if (this.state.data.length > 0) {
       subHeader = <Subheader style={{padding: '0'}}>Search Result for {this.state.searchItem}</Subheader>
       result = this.state.data.map((item,index) => 
        (
          <GridTile
          onClick={this.openBigImg.bind(this,item.webformatURL)}
          key={index}
          title={item.tags}
          subtitle={<span>by <b>{item.user}</b></span>}
          actionIcon={<IconButton><StarBorder color="white" /></IconButton>}
        >
          <img src={item.webformatURL} alt="" />
        </GridTile>
        )
      )
    } else {
      result = <div></div>
      subHeader = <span></span>
    }

    const actions = [
      <FlatButton
        label="Close"
        primary={true}
        onClick={this.handleClose}
      />
    ];
    
    return (
      <div className="App">
        <MuiThemeProvider>
          <div style={{ marginBottom: '20px' }}>
          <AppBar
            className="navBar"
            title="Imager"
            iconClassNameRight="muidocs-icon-navigation-expand-more"
          />
          <div style={this.style.container}>
           <TextField
            floatingLabelText="Images from pixabay"
            hintText="Search for images"
            value={this.state.searchItem}
            onKeyPress={this.handleKeyPress(this.searchRequest)}
            onChange={this.handleChange}
            name="searchItem"
            fullWidth={true}
          />
          <Tabs className="tabs">
            { tagList }
          </Tabs>
          {subHeader}
          <GridList
            cellHeight={180}
            cols={5}
          >
          { result }
          </GridList>
          {
            this.state.data.length > 0? 
            <div className="pagination" style={{ marginTop: '10px' }}>
            <RaisedButton style={{ float:'right' }} onClick={
                  this.updatePage.bind(this,1)
                } 
                label="Next" />
              <RaisedButton  style={{ float:'right',borderRight: '1px solid #d6d6d6' }} onClick={ 
                  this.updatePage.bind(this,-1)
                } 
               label="Pre" />
            </div> : 
            <div></div>
          }
          </div>
          <Dialog
            style={{ position: 'fixed', top: '0px' }}
            actions={actions}
            modal={true}
            open={this.state.open}
            autoScrollBodyContent={true}
            onRequestClose={this.handleClose}
          >
            <img src={this.state.currentImg} alt="" style={ {width:'100%', height: '100%'} }/>
          </Dialog>
          </div>
        </MuiThemeProvider>  
      </div>
    );
  }
}

export default App;
