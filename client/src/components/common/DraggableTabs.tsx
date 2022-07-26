import React, { useState, useRef } from 'react'
import { Tabs } from 'antd'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

const DraggableTabNode  = (props: any) => {
  const { index, children, moveNode } = props

  const ref = useRef(null as any)

  const [{ isOver, dropClassName }, drop] = useDrop({
    accept: 'DraggableTabNode',
    collect: monitor => {
      const { index: dragIndex } = monitor.getItem() || {}

      if (dragIndex === index) {
        return {}
      }

      return {
        isOver: monitor.isOver(),
        dropClassName: 'dropping'
      }
    },
    drop: (item: any) => {
      moveNode(item.index, index)
    }
  })

  const [, drag] = useDrag({
    type: 'DraggableTabNode',
    item: { index },
    collect: monitor => ({
      isDragging: monitor.isDragging()
    })
  })

  drop(drag(ref))

  return (
    <div ref={ref} className={`dragnode ${isOver ? dropClassName : ''}`}>
      {children}
    </div>
  )
}

const DraggableTabs = (props: any) => {
  const { children, onDragEnd } = props

  const [order, setOrder] = useState<any[]>([])

  const moveTabNode = (dragKey: any, hoverKey: any) => {
    const newOrder = order.slice()

    React.Children.forEach(children, (c: any) => {
      if (newOrder.indexOf(c.key) === -1) {
        newOrder.push(c.key)
      }
    })

    const dragIndex = newOrder.indexOf(dragKey)
    const hoverIndex = newOrder.indexOf(hoverKey)

    newOrder.splice(dragIndex, 1)
    newOrder.splice(hoverIndex, 0, dragKey)

    onDragEnd(dragIndex, hoverIndex)

    setOrder(newOrder)
  }

  const renderTabBar = (props: any, DefaultTabBar: any) => (
    <DefaultTabBar {...props}>
      {(node: any)=> (
        <DraggableTabNode key={node.key} index={node.key} moveNode={moveTabNode}>
          {node}
        </DraggableTabNode>
      )}
    </DefaultTabBar>
  )

  const tabs: any = []

  React.Children.forEach(children, c => {
    tabs.push(c)
  })

  const orderTabs = tabs.slice().sort((a: any, b: any) => {
    const orderA = order.indexOf(a.key)
    const orderB = order.indexOf(b.key)

    if (orderA !== -1 && orderB !== -1) {
      return orderA - orderB
    }
    if (orderA !== -1) {
      return -1
    }
    if (orderB !== -1) {
      return 1
    }

    const ia = tabs.indexOf(a)
    const ib = tabs.indexOf(b)

    return ia - ib
  })

  return (
    <DndProvider backend={HTML5Backend}>
      <Tabs renderTabBar={renderTabBar} {...props}>
        {orderTabs}
      </Tabs>
    </DndProvider>
  )
}

export default DraggableTabs