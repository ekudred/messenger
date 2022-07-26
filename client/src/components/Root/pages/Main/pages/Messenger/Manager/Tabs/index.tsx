import React, { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { Tabs } from 'antd'
import cs from 'classnames'

import { useAppDispatch, useAppSelector } from 'hooks/store'
import MessengerManagerTab from './Tab'
import MessengerManagerContent from '../Content'
import DraggableTabs from 'components/common/DraggableTabs'
import { Paths } from 'utils/paths'
import useQuery from 'hooks/useQuery'

import styles from './Tabs.module.less'

interface MessengerManagerTabsProps {
  frontier?: boolean
}

const MessengerManagerTabs: FC<MessengerManagerTabsProps> = props => {
  const { frontier } = props
  const tabPosition = frontier ? 'horizontal' : 'vertical'

  const { messenger } = useAppSelector(store => store)
  const query = useQuery()
  const chatQuery = (query.has('user') && query.get('user')) || (query.has('group') && query.get('group')) || false
  const tabKey = (query.has('folder') && query.get('folder')) || (query.has('personal') && '1') || false

  const navigate = useNavigate()
  // const dispatch = useAppDispatch()

  const onTabClick = (key: string) => {
    if (chatQuery || key === '0') {
      navigate(Paths.MESSENGER)

      return
    }

    if (key === '1') {
      navigate(`${Paths.MESSENGER}?personal`)

      return
    }

    navigate(`${Paths.MESSENGER}?folder=${key}`)
  }

  const onDragEnd = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0) return

    const folders = [...Object.keys(messenger.manager.tabs.folders)]
    const folder = folders.splice(fromIndex, 1)[0]
    folders.splice(toIndex, 0, folder)
    // dispatch(messengerSliceActions.setFolders(folders))
  }

  return (
    <DraggableTabs
      tabPosition={tabPosition === 'vertical' ? 'right' : 'top'}
      tabBarGutter={frontier ? 8 : 4}
      className={cs({
        [styles.MessengerManagerTabs]: true,
        [styles.vertical]: !frontier,
        [styles.horizontal]: frontier,
      })}
      activeKey={!chatQuery ? (tabKey ? tabKey : '0') : undefined}
      onTabClick={onTabClick}
      onDragEnd={onDragEnd}
    >
      {Object.values(messenger.manager.tabs.default).map(tab => (
        <Tabs.TabPane
          key={tab.id}
          style={{ padding: 0 }}
          tab={<MessengerManagerTab name={tab.name} id={tab.id} position={tabPosition} />}
        >
          <MessengerManagerContent id={tab.id} frontier={frontier} />
        </Tabs.TabPane>
      ))}
      {Object.values(messenger.manager.tabs.folders).map(tab => (
        <Tabs.TabPane
          key={tab.id}
          style={{ padding: 0 }}
          tab={<MessengerManagerTab id={tab.id} name={tab.name} position={tabPosition} />}
        >
          <MessengerManagerContent id={tab.id} frontier={frontier} />
        </Tabs.TabPane>
      ))}
    </DraggableTabs>
  )
}

export default MessengerManagerTabs
