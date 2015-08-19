var V2Profile = React.createClass({
  avatar: function() {
    if(this.props.profile.avatar) {
      return (<div className="avatar"><img src={this.props.profile.avatar.url} alt={this.props.profile.name} /></div>)
    }
  },

  profiles: function() {
    var profiles = [];
    if(this.props.profile.twitter) {
      var url = 'https://twitter.com/' + this.props.profile.twitter.username;
      profiles.push(<div className="twitter">twitter: <a href={url}>@{this.props.profile.twitter.username}</a></div>);
    }
    if(this.props.profile.github) {
      var url = 'https://github.com/' + this.props.profile.github.username;
      profiles.push(<div className="github">github: <a href={url}>{this.props.profile.github.username}</a></div>);
    }
    return profiles;
  },

  getStyle: function() {
    var style = {};
    if(this.props.profile.cover) {
      style.background = 'url(' + this.props.profile.cover.url + ') no-repeat fixed';
    }
    return style;
  },

  render: function() {
    var profile = this.props.profile;
    return (
      <div className="profile" style={this.getStyle()} >
        {profile.avatar &&
          <div className="avatar">
            <img src={profile.avatar.url} alt={profile.name} />
          </div>}
        <div className="profile-info">
          {profile.name &&
            <h1>{profile.name}</h1>}
          {profile.name &&
            <h2>{profile.name}</h2>}
          {profile.location &&
            <p>{profile.location}</p>}
          {profile.website &&
            <p className="website"><a href={profile.website}>{profile.website}</a></p>}
          {this.profiles()}
          {profile.pgp &&
            <p className="pgp-fingerprint"><a href={profile.pgp.url}>{profile.pgp.fingerprint}</a></p>}
        </div>
      </div>
    );
  }
});

