RemoteStorage.defineModule('aboutbit', function(privateClient, publicClient) {
  privateClient.declareType('friend', {
    "description": "openname friend",
    "type": "object",
    "properties": {
      "username": {
        "type": "string",
        "format": "id"
      }
    }
  });

  return {
    exports: {
      addFriend: function (username) {
        return privateClient.storeObject('friend', username, {
          username: username,
        });
      },
      getFriends: function() {
        return privateClient.getAll('');
      },
      removeFriend: function(username) {
        privateClient.remove(username);
      }
    }
  };
});
var Repository = remoteStorage.aboutbit;
