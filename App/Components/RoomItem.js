import React from 'react'
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native'
import dateFns from 'date-fns'

export default class RoomItem extends React.PureComponent {
  getTime = (time) => {
    if (dateFns.isSameDay(time, new Date())) {
      return dateFns.format(time, 'HH:mm')
    }
    return dateFns.format(time, 'DD/MM/YYYY')
  };

  _onClick = (roomId) => {
    this.props.onClick && this.props.onClick(roomId)
  };

  render() {
    const room = this.props.room;
    console.tron.log({
      room: room
    });

    const lastComment = room.last_comment_message.startsWith('[file]')
      ? 'File attachment'
      : room.last_comment_message;
    const unreadCount = Number(room.count_notif);
    return (
      <TouchableOpacity style={styles.container}
      onPress={() => this._onClick(room.id)}>
        <Image style={styles.avatar} source={{ uri: room.avatar }} />
        <View style={styles.dataContainer}>
          <View style={styles.content}>
            <Text style={styles.name}>{room.name}</Text>
            <Text style={styles.lastMessage}>{lastComment}</Text>
          </View>
          <View style={styles.meta}>
            <Text style={styles.time}>
              {this.getTime(room.last_comment_message_created_at)}
            </Text>
            {unreadCount > 0 && <Text style={styles.unreadCount}>{unreadCount}</Text>}
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: 10,
  },
  avatar: {
    flex: 0,
    flexBasis: 40,
    flexShrink: 0,
    height: 40,
    width: 40,
    borderRadius: 50,
  },
  dataContainer: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#e8e8e8',
    marginLeft: 10,
    paddingBottom: 16
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 14,
    color: '#2c2c36'
  },
  lastMessage: {
    fontSize: 11,
    color: '#979797',
    maxWidth: 175,
  },
  meta: {
    flex: 0,
    flexBasis: 55,
    display: 'flex',
    alignItems: 'flex-end',
    flexDirection: 'column',
  },
  time: {
    fontSize: 10,
    textAlign: 'right',
    color: '#979797',
  },
  unreadCount: {
    fontSize: 10,
    color: 'white',
    backgroundColor: '#94ca62',
    borderRadius: 50,
    minWidth: 14,
    textAlign: 'center',
    marginTop: 5,
  }
});
