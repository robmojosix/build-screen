import React from 'react';
import ReactDOM from 'react-dom';
require('es6-promise').polyfill();
require('isomorphic-fetch');

const Commit = (props) => {
  return (
    <a className="commit" href={props.url} target="_blank">
      <div>
        <div className="message">{props.message}</div>
        <div className="author">{props.author}</div>
        <div className="date">{props.date}</div>
        <div className="time">{props.time}</div>
      </div>
   </a>
  )
}

var BuildScreen = React.createClass({
  getInitialState: function() {
    return {
      commits: false
    };
  },

  // searchTicketByName: function(){
  //   var input = document.getElementById("search");
  //   var filter = input.value.toUPPERCASE();
  //   console.log(this.props.author);
  // },

  componentDidMount: function() {
    this.getCommits();
    setInterval(()=> {
      this.getCommits();
    }, 300000); // 5 minutes
  },

  getCommits: function() {
    fetch('/commits').then((response) => {
        if (response.status >= 400) {
            throw new Error("Bad response from server");
        }
        return response.json();
     })
     .then((commits) => {
       this.setState({commits: commits});
     });
  },

  render: function() {
    let commits;
    if(this.state.commits) {
      commits = this.state.commits.map((commit, i) => {
        return <Commit  key={i}
                        author={commit.commit.author.name}
                        date={new Date(commit.commit.author.date).toDateString()}
                        time={new Date(commit.commit.author.date).toLocaleTimeString()}
                        message={commit.commit.message}
                        url={commit.html_url} />
      })
    }

    return (
      <div>
        {commits}
      </div>
    );
  }
});

ReactDOM.render(
  <BuildScreen source="a" />,
  document.getElementById('content')
);
