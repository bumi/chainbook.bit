RemoteStorage.defineModule('opennameFriendList', function(privateClient, publicClient) {
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

$(function() {
  remoteStorage.access.claim('opennameFriendList', 'rw');
  remoteStorage.displayWidget();
});
