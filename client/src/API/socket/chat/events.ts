export enum ChatSocketEvents {
  join_chat = 'chat:join',
  joined_chat = 'chat:joined',

  leave_chat = 'chat:leave',
  left_chat = 'chat:left',

  send_message = 'message:send',
  sent_message = 'message:sent',

  view_messages = 'messages:view',
  read_messages = 'messages:read',
}
