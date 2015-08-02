var Name = React.createClass({
  getDefaultProps: function() {
    return { name: {} }
  },
  render: function() {
    return <p>{this.props.name.formatted}</p>;
  }
});
var Location = React.createClass({
  getDefaultProps: function() {
    return { location: {} }
  },
  render: function() {
    return (
      <p className="location">{this.props.location.formatted}</p>
      );
  }
});
var Summary = React.createClass({
  render: function() {
    return (<p className="summary">{this.props.summary}</p>);
  }
});
var Websites = React.createClass({
  getDefaultProps: function() {
    return { websites: [] }
  },
  render: function() {
    var websites = this.props.websites.map(function(website, i) {
      return (
        <li key={i} className="website"><a href={website.url}>{website.url}</a></li>
      );
    });
    return (<ul>{websites}</ul>);
  }
});

var Profile = React.createClass({
  render: function() {
    return (
      <div>
        <Name name={this.props.profile.name} />
        <Summary summary={this.props.profile.summary} />
        <Location location={this.props.profile.location} />
        <Websites websites={this.props.profile.websites} />
      </div>
      );
  }
});

var App = React.createClass({
  loadFriends: function() {
    remoteStorage.opennameFriendList.getFriends().then(function(friends) {
      this.setState({friends: friends});
    }.bind(this));
  },
  getInitialState: function() {
    return { username: null, profileData: {}, friends: []};
  },
  componentDidMount: function() {
    this.loadFriends();
  },
  handleLoadFriend: function(e) {
    var username = e.target.dataset['username'];
    this.loadFriend(username).done(function(data) {
      this.setState({username: username, profileData: data});
    }.bind(this));
  },
  loadFriend: function(username) {
    return $.ajax({
      url: '/'+ username + '.json',
      xhrFields: {
          withCredentials: true
       }
    });
  },
  handleAddNewFriend: function(e) {
    e.preventDefault();
    var input = $("#new-friend-input");
    var username = input.val();
    this.loadFriend(username).done(function(data) {
        remoteStorage.opennameFriendList.addFriend(username);
        var friends = this.state.friends;
        friends[username] = {"username": username};
        this.setState({username: username, profileData: data, friends: friends});
        input.val("");
      }.bind(this))
      .fail(function(e) {
        console.log(e);
        alert("user not found")
      });
  },
  render: function() {
    var friends = [];
    $.each(this.state.friends, function(id, friend) {
      friends.push((
        <li onClick={this.handleLoadFriend} key={id} data-username={friend.username} className="friend">{friend.username}</li>
      ));
    }.bind(this));
    return (
      <div>
        <div id="friends">
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
        <div id="profile">
          <Profile profile={this.state.profileData} />
        </div>
      </div>
    );
  }
});

$(function() {
  React.render(<App />, document.getElementById('container'));
});
