export enum FolderManagerSocketEvents {
  get_folders = 'folders:get',
  got_folders = 'folders:got',

  create_folder = 'folder:create',
  created_folder = 'folder:created',

  edit_folder = 'folder:edit',
  edited_folder = 'folder:edited',

  delete_folder = 'folder:delete',
  deleted_folder = 'folder:deleted',

  search_chats = 'chats:search',
  searched_chats = 'chats:searched',
}