var V2Profile = React.createClass({
  displayElement: function(key, tag) {
    if(tag === undefined) { tag = 'p' }
    if(this.props.profile[key]) {
      return React.createElement(tag, {className:key}, this.props.profile[key])
    }
  },
  avatar: function() {
    if(this.props.profile.avatar) {
      return (<div className="avatar"><img src={this.props.profile.avatar.url} alt={this.props.profile.name} /></div>)
    }
  },
  website: function() {
    if(this.props.profile.website) {
      return (<p className="website"><a href={this.props.profile.website}>{this.props.profile.website}</a></p>);
    }
  },
  pgp: function() {
    if(this.props.profile.pgp) {
      var pgp = this.props.profile.pgp;
      return (<p className="pgp-fingerprint"><a href={pgp.url}>{pgp.fingerprint}</a></p>);
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
    return (
      <div className="profile" style={this.getStyle()} >
        {this.avatar()}
        <div className="profile-info">
          {this.displayElement('name', 'h1')}
          {this.displayElement('bio', 'h2')}
          {this.displayElement('location')}
          {this.website()}
          {this.profiles()}
          {this.pgp()}
        </div>
      </div>
    );
  }
});

