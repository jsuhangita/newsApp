import React from 'react';
import {
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ImagePicker from 'react-native-image-picker';

import Toolbar from '../../Components/Toolbar';
import MessageList from '../../Components/MessageList';
import ChatInput from '../../Components/ChatInput';
import EmptyChat from '../../Components/EmptyChat';
import { Images } from '../../Themes';

import QiscusActions from '../../Redux/QiscusRedux';
import { connect } from 'react-redux';
import QiscusStrings from '../../Qiscus/QiscusStrings';
import OnlineStatusContainer from '../../Components/OnlineStatusContainer';

class ChatScreen extends React.Component {
  itemPerPage = 20;

  constructor(props) {
    super(props);
    let targetUser = undefined;
    const room = props.navigation.getParam('room');
    props.setActiveRoomRequest({ roomId: room.id });

    if (room.room_type === QiscusStrings.room_type.single) {
      const targetUserIndex = room.participants.findIndex(
        u => u.id !== props.qiscusUser.id,
      );
      if (targetUserIndex >= 0) {
        targetUser = room.participants[targetUserIndex];
      }
    }

    this.state = {
      room,
      targetUser,
      isOnline: false,
      isTyping: false,
      lastOnline: undefined,
      typingUsername: undefined,
    };
  }

  componentDidMount() {
    const { room } = this.state;
    this.props.getMessagesRequest({
      roomId: room.id,
      options: {
        // last_comment_id: room.last_comment_id,
        limit: this.itemPerPage,
      },
    });

    this.props.readMessageRequest({
      roomId: room.id,
      lastReadMessageId: room.last_comment_id,
    });
  }

  componentWillUnmount() {
    this.props.exitActiveRoomRequest();
  }

  render() {
    const { room, targetUser } = this.state;
    const messages = this.messages;
    const roomName = room ? room.name : 'Chat';
    const avatarURL = room ? room.avatar : null;

    const { roomTypingStatus } = this.props;

    return (
      <View
        style={styles.container}
        keyboardVerticalOffset={StatusBar.currentHeight}
        behavior="padding"
        enabled
      >
        <Toolbar
          title={roomName}
          renderIcon={() => (
            <Image
              source={{ uri: avatarURL }}
              style={{
                width: 32,
                height: 32,
                resizeMode: 'cover',
                borderRadius: 50,
                marginRight: 5,
              }}
            />
          )}
          renderLeftButton={() => (
            <TouchableOpacity
              onPress={() => this.props.navigation.goBack()}
              style={{ justifyContent: 'center' }}
            >
              <Image
                source={Images.qiscusBack}
                style={{
                  width: 20,
                  height: 20,
                  resizeMode: 'contain',
                }}
              />
            </TouchableOpacity>
          )}
          renderMeta={() => (
            <View style={styles.onlineStatus}>
              <OnlineStatusContainer targetUser={targetUser} />
              {roomTypingStatus && (
                <Text style={styles.typingText}>
                  {roomTypingStatus.username} is typing...
                </Text>
              )}
            </View>
          )}
        />

        {messages.length === 0 && <EmptyChat />}
        {messages.length > 0 && (
          <MessageList
            isLoadMoreable={messages[0].comment_before_id !== 0}
            messages={messages}
            scroll={this.state.scroll}
          />
        )}

        <ChatInput
          room={room}
          onSubmit={this.submitMessage}
          onSelectFile={() => this.openCamera()}
        />
      </View>
    );
  }

  prepareMessage = message => {
    const date = new Date();
    return {
      id: date.getTime(),
      timestamp: date.getTime(),
      type: 'text',
      status: 'sending',
      message: message,
      email: this.props.qiscusUser.email,
    };
  };

  prepareFileMessage = (message, fileURI) => {
    return {
      ...this.prepareMessage(message),
      type: 'upload',
      fileURI,
    };
  };

  submitMessage = async text => {
    const message = this.prepareMessage(text);
    await this.addMessage(message, true);

    this.props.sendMessageRequest({
      roomId: this.state.room.id,
      text: text,
      type: message.type,
    });
  };

  onSelectFile = () => {
    ImagePicker.showImagePicker(
      {
        title: 'Select image',
        storageOptions: {
          skipBackup: true,
          // path: 'images',
        },
      },
      resp => {
        if (resp.didCancel) console.tron.error('user cancel');
        if (resp.error)
          console.tron.error('error when getting file', resp.error);

        const message = this.prepareFileMessage('File attachment', resp.uri);

        this.props.sendMessageRequest({
          roomId: this.state.room.id,
          text: message.message,
          uniqueId: message.uniqueId,
          type: QiscusStrings.message_type.custom, // message type
          needToUpload: true,
          toUpload: {
            uri: resp.uri,
            type: resp.type,
            name: resp.fileName,
          },
        });
      },
    );
  };

  async openCamera() {
    try {
      this.onSelectFile();
    } catch (err) {
      console.tron.error(err);
    }
  }

  addMessage = (message, scroll = false) =>
    new Promise(resolve => {
      this.setState(
        {
          scroll,
        },
        () => {
          if (scroll === false) return;
          const timeoutId = setTimeout(() => {
            this.setState({ scroll: false }, () => {
              clearTimeout(timeoutId);
              resolve();
            });
          }, 400);
        },
      );
    });

  sortMessage = messages =>
    messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  get isGroup() {
    if (this.state.room == null || this.state.room.room_type == null)
      return false;
    return this.state.room.room_type === 'group';
  }

  get participants() {
    const room = this.state.room;
    if (room == null || room.participants == null) return;
    const limit = 3;
    const overflowCount = room.participants.length - limit;
    const participants = room.participants
      .slice(0, limit)
      .map(it => it.username.split(' ')[0]);
    if (room.participants.length <= limit) return participants.join(', ');
    return participants.concat(`and ${overflowCount} others.`).join(', ');
  }

  get messages() {
    return this.sortMessage(
      Object.values(this.props.messages[this.state.room.id] || []),
    );
  }
}

const mapStateToProps = state => {
  return {
    qiscusUser: state.qiscus.currentUser,
    messages: state.qiscus.messages,
    roomTypingStatus: state.qiscus.roomTypingStatus,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setActiveRoomRequest: params =>
      dispatch(QiscusActions.setActiveRoomRequest(params)),
    exitActiveRoomRequest: () =>
      dispatch(QiscusActions.exitActiveRoomRequest()),
    getMessagesRequest: params =>
      dispatch(QiscusActions.getMessagesRequest(params)),
    sendMessageRequest: params =>
      dispatch(QiscusActions.sendMessageRequest(params)),
    readMessageRequest: params =>
      dispatch(QiscusActions.readMessageRequest(params)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ChatScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  typingText: {
    fontSize: 12,
    color: '#979797',
  },
  titleText: {
    fontSize: 16,
  },
});
