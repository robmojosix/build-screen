var express = require('express');
var app = express();
var fetch = require('isomorphic-fetch');


var getDateFromDaysAgo = function(days) {
  const dayInMillis = 8.64e7;
  const daysAgo = dayInMillis*days;
  const commitDate = new Date(+new Date - daysAgo);

  const year = commitDate.getFullYear();
  const month = ('0' + (commitDate.getMonth() + 1)).slice(-2);
  const day = ('0' + commitDate.getDate()).slice(-2);

  return year + "-" + month + "-" + day;
}

app.use(express.static('public'));

app.get('/', function(req, res) {
    res.sendfile('./index.html');
});

// app.get('/search.js', function(req, res) {
//     res.sendfile('./search.js');
// });

app.get('/commits', function(req, res) {
  var commitDate = getDateFromDaysAgo(14);
  // var TOKEN = process.env.GITHUB_TOKEN;
  var TOKEN = '07896624b758d6061f2a2cfb188d368d81d91673';
  var url = 'https://api.github.com/repos/notonthehighstreet/notonthehighstreet/commits?sha=production_uk&since=' + commitDate + '&access_token=' + TOKEN;
  fetch(url)
  .then((response) => {
      if (response.status >= 400) {
          throw new Error("Bad response from server");
      }
      return response.json();
   })
   .then(function(commits) {
       res.json(commits);
   });
});

app.listen(process.env.PORT || 8080);
