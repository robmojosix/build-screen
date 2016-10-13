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
      allCommits: false,
      commits: false
    };
  },

  componentDidMount: function() {
    this.dateTwoWeeksAgo();
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
       this.setState({allCommits: commits});
     });
  },

  allCommits: function() {
    var commits = this.state.allCommits;
    this.setState({commits: commits});
  },

  searchTicketByName: function(){
   var commits = this.state.allCommits;
   var input = document.getElementById("search");
   var filter = input.value.toUpperCase();
   var tempCommits = [];
   var returnedCommits = [];
     for (var i = 0; i < commits.length; i++) {
       tempCommits.push(commits[i])
     }
     for (var i = 0; i < commits.length; i++) {
       var commitMessageString = commits[i].commit.message;
       if (commitMessageString.toUpperCase().indexOf(filter) != -1){
         returnedCommits.push(commits[i])
       }
     }
   this.setState({commits: returnedCommits});
  },


  getTodaysCommits: function(){
    var commits = this.state.allCommits;
     var todaysCommits = [];
     for (var i = 0; i < commits.length; i++) {
       var today = new Date().toDateString();
       var stringToDate = new Date(commits[i].commit.author.date).toDateString();
       if (today == stringToDate){
         todaysCommits.push(commits[i])
       }
     }
     this.setState({commits: todaysCommits});
  },

  getProductAndContentCommits: function() {
    var commits = this.state.allCommits;
     let filteredCommits = this.filterCommits(commits)
     this.setState({commits: filteredCommits});
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

  getDateFromDaysAgo: function(days){
    const dayInMillis = 8.64e7;
    const daysAgo = dayInMillis*days;
    const commitDate = new Date(+new Date - daysAgo);

    const year = commitDate.getFullYear();
    const month = ('0' + (commitDate.getMonth() + 1)).slice(-2);
    const day = ('0' + commitDate.getDate()).slice(-2);

    return day + "-" + month + "-" + year;

  },

  dateTwoWeeksAgo: function(){
    var twoWeeksAgo = this.getDateFromDaysAgo(14);
    this.setState({twoWeeksAgo: twoWeeksAgo});
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
    else if(!commits){
      return <div> Loading... </div>;
    }

    return (
      <div>
        <h1 className="headings" id="heading"> Commits </h1>
        <h2 className="headings" id="commitTotal"> Commits since {this.state.twoWeeksAgo} : {this.state.commits.length} </h2>
        <input type="submit" className="buttons" id="allBtn" value="All Commits" onClick={this.allCommits}/>
        <input type="submit" className="buttons" id="productAndContentTeamBtn" value="Product & Content Team" onClick={this.getProductAndContentCommits}/>
        <input type="submit" className="buttons" id="todayBtn" value="Today's Commits" onClick={this.getTodaysCommits}/>
        <input type="text" className="search" id="search" name="lname" placeholder="search" autoComplete="off" />
        <input type="submit" className="search" id="go" autoComplete="off" onClick={this.searchTicketByName} />
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
