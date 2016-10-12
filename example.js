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
        <div className="coauthor">{props.coauthor}</div>
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

  searchTicketByName: function(){
    // var input = document.getElementById("search");
    // var filter = input.value.toUPPERCASE();
    console.log("I work");
  },

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

  getProductAndContentCommits: function() {
    fetch('/commits').then((response) => {
        if (response.status >= 400) {
            throw new Error("Bad response from server");
        }
        return response.json();
     })
     .then((commits) => {
       let filteredCommits = this.filterCommits(commits)
       this.setState({commits: filteredCommits});
     });
  },

  filterCommits: function(commits) {
    let productAndContentCommits = [];
    let productAndContentTeam = ['Jamie Brown', 'Robert Jones', 'Edward Kerry', 'Chris Temple', 'Chris Mckenzie', 'Rich Matthews'];
    for (var i = 0; i < commits.length; i++) {
      if (productAndContentTeam.indexOf(commits[i].commit.author.name) != -1) {
        productAndContentCommits.push(commits[i]);
      }
    }
    return productAndContentCommits;
  },

  render: function() {
    let commits;
    if(this.state.commits) {
      commits = this.state.commits.map((commit, i) => {
        return <Commit  key={i}
                        author={commit.commit.author.name}
                        coauthor={commit.commit.committer.name}
                        date={new Date(commit.commit.author.date).toDateString()}
                        time={new Date(commit.commit.author.date).toLocaleTimeString()}
                        message={commit.commit.message}
                        url={commit.html_url} />
      })
    }
    /*<input id="search" onKeyUp={this.searchTicketByName} type="text" name="lname" placeholder="search" autoComplete="off" />*/

    return (
      <div>
        <h1 id="heading"> Commits </h1>
        <input type="submit" className="buttons" id="productAndContentTeamBtn" value="Product & Content Team" onClick={this.getProductAndContentCommits}/>
        <input type="submit" className="buttons" id="allBtn" value="All Commits" onClick={this.getCommits}/>
        <br />
        {commits}
      </div>
    );
  }
});

ReactDOM.render(
  <BuildScreen source="https://api.github.com/users/octocat/gists" />,
  document.getElementById('content')
);
