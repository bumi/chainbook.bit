var App = React.createClass({
  getInitialState: function() {
    return { username: null, profileData: {}, friends: {}};
  },
  componentDidMount: function() {
    this.loadFriendsList();
  },

  loadFriendsList: function() {
    Repository.getFriends().then(function(friends) {
      this.setState({friends: friends});
    }.bind(this));
  },
  handleLoadFriend: function(e) {
    var username = e.target.dataset['username'];
    this.loadFriend(username).done(function(data) {
      this.setState({username: username, profileData: data.data.value, name: data.data.name, expiresIn: data.data.expires_in});
    }.bind(this));
  },
  loadFriend: function(username) {
    return $.ajax({
      url: (Config.baseUrl + '/' + Config.blockchain + '/key/' + Config.key + username)
    });
  },
  handleAddNewFriend: function(e) {
    e.preventDefault();
    var input = $("#new-friend-input");
    var username = input.val();
    this.loadFriend(username).done(function(data) {
      Repository.addFriend(username);
      var friends = this.state.friends;
      friends[username] = {"username": username};
      this.setState({username: username, profileData: data, friends: friends});
      input.val("");
    }.bind(this))
    .fail(function(e) {
      alert("user not found")
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
    } else if(this.state.profileData.v == "0.2") {
      return <V2Profile profile={this.state.profileData} username={this.state.username} />;
    } else {
      return <Unsupported profile={this.state.profileData} username={this.state.username} />;
    }
  },
  render: function() {
    var friends = Object.keys(this.state.friends).map(function(id) {
      var friend = this.state.friends[id];
      return <li key={id}><a href="#" onClick={this.handleLoadFriend} data-username={friend.username} className="friend">{friend.username}</a> (<a href="#" onClick={this.handleDeleteFriend} data-username={friend.username} className="delete">x</a>)</li>
    }.bind(this));

    var profile = this.getProfile();

    return (
      <div>
        <div id="friends-wrapper">
          <ul>
            {friends}
            <li>
              <form onSubmit={this.handleAddNewFriend}>
                <input id="new-friend-input" />
                <button>Add friend</button>
              </form>
            </li>
          </ul>
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

