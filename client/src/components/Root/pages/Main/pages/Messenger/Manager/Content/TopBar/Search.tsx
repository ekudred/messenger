import { FC, useEffect, useMemo } from 'react'
import { Input } from 'antd'
import { SearchOutlined, LoadingOutlined } from '@ant-design/icons'
import debounce from 'lodash/debounce'

import { useAppDispatch, useAppSelector } from 'hooks/store'
import { ChatManagerActions, FolderManagerActions } from 'store/actions/messenger'
import { selectTab } from 'store/selectors/messenger'

interface MessengerManagerContentTopBarSearchProps {
  id: string
}

const MessengerManagerContentTopBarSearch: FC<MessengerManagerContentTopBarSearchProps> = props => {
  const { id } = props

  const { auth } = useAppSelector(store => store)
  const { userID } = auth.info

  const tab = useAppSelector(selectTab(id))!
  const isChatsTab = tab.key === 'chats'
  const isPersonalTab = tab.key === 'personalChats'
  const isFolderTab = tab.key === 'folder'
  const searchChatsAction = tab.actions.searchChats

  const dispatch = useAppDispatch()

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value

    if (isChatsTab) {
      dispatch({ type: ChatManagerActions.SEARCH_CHATS, payload: { value, userID } })
    }
    if (isPersonalTab) {
      dispatch({ type: ChatManagerActions.SEARCH_DIALOGS, payload: { value, userID } })
    }
    if (isFolderTab) {
      dispatch({ type: FolderManagerActions.SEARCH_FOLDER_CHATS, payload: { userID, folderID: id, value } })
    }
  }
  const debouncedSearch = useMemo(() => debounce(handleSearch, 500), [])

  useEffect(() => () => debouncedSearch.cancel(), [])

  return (
    <Input
      placeholder="Search chats"
      prefix={<SearchOutlined style={{ fontSize: '16px', color: '#d9d9d9', margin: '0 4px 0 0' }} />}
      suffix={
        searchChatsAction!.status === 'loading' && <LoadingOutlined style={{ color: '#1890ff', margin: '0 0 0 4px' }} />
      }
      style={{ border: 'none' }}
      onChange={debouncedSearch}
    />
  )
}

export default MessengerManagerContentTopBarSearch
