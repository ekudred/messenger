export enum ChatManagerSocketEvents {
  get_chats = 'chats:get',
  got_chats = 'chats:got',

  get_dialogs = 'dialogs:get',
  got_dialogs = 'dialogs:got',

  search_chats = 'chats:search',
  searched_chats = 'chats:searched',

  search_dialogs = 'dialogs:search',
  searched_dialogs = 'dialogs:searched',

  create_group = 'group:create',
  created_group = 'group:created',

  new_message = 'chats:new_message',

  read_messages = 'messages:read'
}