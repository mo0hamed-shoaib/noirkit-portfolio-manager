"use client"

import type React from "react"
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd"

interface SortableListProps<T> {
  items: T[]
  onReorder: (items: T[]) => void
  renderItem: (item: T, index: number, isDragging: boolean) => React.ReactNode
  keyExtractor: (item: T) => string
  className?: string
}

export function SortableList<T>({ items, onReorder, renderItem, keyExtractor, className = "" }: SortableListProps<T>) {
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const reorderedItems = Array.from(items)
    const [reorderedItem] = reorderedItems.splice(result.source.index, 1)
    reorderedItems.splice(result.destination.index, 0, reorderedItem)

    onReorder(reorderedItems)
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="sortable-list">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef} className={className}>
            {items.map((item, index) => (
              <Draggable key={keyExtractor(item)} draggableId={keyExtractor(item)} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={snapshot.isDragging ? "opacity-75" : ""}
                  >
                    {renderItem(item, index, snapshot.isDragging)}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}
