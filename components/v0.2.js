var V2Profile = React.createClass({
  displayElement: function(key, tag) {
    if(!tag) { var tag = 'p' }
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

  getStyle: function() {
    var style = {};
    if(this.props.profile.cover) {
      style.backgroundImage = 'url(' + this.props.profile.cover + ')';
    }
  },

  render: function() {
    return (
      <div className="profile" style={this.getStyle()} >
        {this.avatar()}
        {this.displayElement('name', 'h1')}
        {this.displayElement('bio', 'h2')}
        {this.displayElement('location')}
        {this.website()}
        {this.pgp()}
      </div>
    );
  }
});

