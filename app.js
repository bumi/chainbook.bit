var App = React.createClass({
  getInitialState: function() {
    return { username: null, profileData: {}, friends: {}};
  },
  componentDidMount: function() {
    this.loadFriendsList();
    var username = document.location.pathname.replace(/^\/|#/, '');
    if(username && username != '') {
      this.loadFriend(username).then(function(data) {
        this.setState({username: username, profileData: data.data.value, name: data.data.name, expiresIn: data.data.expires_in});
      }.bind(this)).catch(function(e) {
        document.location = '/';
      });
    }
  },
  loadFriendsList: function() {
    Repository.getFriends().then(function(friends) {
      this.setState({friends: friends});
    }.bind(this));
  },
  handleLoadFriend: function(e) {
    var username = e.target.dataset['username'];
    this.loadFriend(username).then(function(data) {
      this.setState({username: username, profileData: data.data.value, name: data.data.name, expiresIn: data.data.expires_in});
    }.bind(this));
  },
  loadFriend: function(username) {
    var promise = new Promise(function(resolve, reject) {

      var followNext = function(data, resolve, reject) {
        var next = data.data.value.next
        if(!next) {
          resolve(data);
          return;
        }
        $.ajax({url: (Config.baseUrl + '/' + Config.blockchain + '/key/' + encodeURI(encodeURIComponent(next)))})
          .done(function(nextData) {
            data.data.value = $.extend(data.data.value, nextData.data.value);
            delete data.data.value.next;
            followNext(data, resolve, reject);
          })
          .fail(function(e) { console.log('an error occured getting the next profile chunk. ignoring'); resolve(data) });
      }

      $.ajax({ url: (Config.baseUrl + '/' + Config.blockchain + '/key/' + Config.key + username) })
        .done(function(data) { followNext(data, resolve, reject); })
        .fail(function(e) {  reject(e); });
      }
    );
    return promise;
  },
  handleAddNewFriend: function(e) {
    e.preventDefault();
    var input = $("#new-friend-input");
    var username = input.val();
    this.loadFriend(username).then(function(data) {
      Repository.addFriend(username);
      var friends = this.state.friends;
      friends[username] = {"username": username};
      this.setState({username: username, profileData: data.data.value, name: data.data.name, friends: friends});
      input.val("");
    }.bind(this))
    .catch(function(e) {
      alert("user not found");
    });
  },
  handleDeleteFriend: function(e) {
    e.preventDefault();
    username = e.target.dataset["username"];
    Repository.removeFriend(username);
    var friends = this.state.friends;
    delete friends[username];
    this.setState({friends: friends});
  },
  getProfile: function(data) {
    if(!this.state.username) {
      return null;
    } else if(this.state.profileData.v == "0.2" || this.state.profileData.next) {
      return <V2Profile profile={this.state.profileData} username={this.state.username} />;
    } else {
      return <Unsupported profile={this.state.profileData} username={this.state.username} />;
    }
  },
  render: function() {
    var friends = Object.keys(this.state.friends).map(function(id) {
      var friend = this.state.friends[id];
      return (
        <li key={id}>
          <div className="friend-delete"><a href="#" onClick={this.handleDeleteFriend} data-username={friend.username} className="delete">x</a></div>
          <div className="friend-row">
            <a href="#" onClick={this.handleLoadFriend} data-username={friend.username} className="friend">
              {friend.username}
            </a>
          </div>
        </li>
      );
    }.bind(this));

    var profile = this.getProfile();

    return (
      <div>
        <div id="friends-wrapper">
          <div id="new-friend">
            <form onSubmit={this.handleAddNewFriend}>
              <input id="new-friend-input" />
              <button>Add</button>
            </form>
          </div>
          <ul className="friends-list">
            {friends}
          </ul>
          <div className="about">
            <h3>About</h3>
            <p>your namecoin and remotestorage based addressbook. <a href="https://github.com/bumi/about.bit#readme">Read more about the project on Github</a></p>
          </div>
        </div>
        <div id="profile-wrapper">
          {profile}
        </div>
      </div>
    );
  }
});


var Unsupported = React.createClass({
  render: function() {
    var data = JSON.stringify(this.props.profile);
    return (<code>{data}</code>);
  }
});

