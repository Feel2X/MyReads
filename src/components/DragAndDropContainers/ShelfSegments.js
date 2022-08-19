import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal, unstable_batchedUpdates } from 'react-dom';

// dnd kit
import {
    closestCenter,
    pointerWithin,
    rectIntersection,
    DndContext,
    DragOverlay,
    getFirstCollision,
    KeyboardSensor,
    MouseSensor,
    TouchSensor,
    useDroppable,
    useSensors,
    useSensor,
    MeasuringStrategy,
    defaultDropAnimationSideEffects,
} from '@dnd-kit/core';
import {
    SortableContext,
    useSortable,
    arrayMove,
    defaultAnimateLayoutChanges,
    verticalListSortingStrategy,
    horizontalListSortingStrategy,
} from '@dnd-kit/sortable';

// custom components
import { Book, Container } from "./components";

// ant design
import { DeleteOutlined } from "@ant-design/icons";

const containerNames = {
    currentlyReading: "Currently Reading",
    wantToRead: "Want to Read",
    read: "Read"
}

const animateLayoutChanges = (args) =>
    defaultAnimateLayoutChanges({...args, wasDragging: true});

function DroppableContainer({
                                children,
                                columns = 1,
                                disabled,
                                id,
                                items,
                                style,
                                ...props
                            }) {
    const {
        active,
        over,
        setNodeRef,
    } = useSortable({
        id,
        data: {
            type: 'container',
            children: items,
        },
        animateLayoutChanges,
    });
    const isOverContainer = over
        ? (id === over.id && active?.data.current?.type !== 'container') ||
        items.includes(over.id)
        : false;

    return (
        <Container
            ref={disabled ? undefined : setNodeRef}
            hover={isOverContainer}
            columns={columns}
            {...props}
        >
            {children}
        </Container>
    );
}

const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
        styles: {
            active: {
                opacity: '0.5',
            },
        },
    }),
};

export const TRASH_ID = 'void';

export function ShelfSegments({
                                  registeredBooks,
                                  updateBookCategory,
                                  adjustScale = false,
                                  itemCount = 3,
                                  cancelDrop,
                                  columns,
                                  handle = false,
                                  items: initialItems,
                                  containerStyle,
                                  coordinateGetter = null,
                                  getItemStyles = () => ({}),
                                  wrapperStyle = () => ({}),
                                  minimal = false,
                                  modifiers,
                                  renderItem,
                                  strategy = horizontalListSortingStrategy,
                                  trashable = false,
                                  vertical = false,
                                  scrollable,
                              }) {
    const [bookIds, setBookIds] = useState(() => initialItems);
    const [containers, setContainers] = useState(Object.keys(bookIds));
    const [activeId, setActiveId] = useState(null);
    const startContainer = useRef(0)
    const lastOverId = useRef(null);
    const recentlyMovedToNewContainer = useRef(false);
    const isSortingContainer = activeId ? containers.includes(activeId) : false;

    const collisionDetectionStrategy = useCallback(
        (args) => {
            if (activeId && activeId in bookIds) {
                return closestCenter({
                    ...args,
                    droppableContainers: args.droppableContainers.filter(
                        (container) => container.id in bookIds
                    ),
                });
            }

            // Start by finding any intersecting droppable
            const pointerIntersections = pointerWithin(args);
            const intersections =
                pointerIntersections.length > 0
                    ? // If there are droppables intersecting with the pointer, return those
                    pointerIntersections
                    : rectIntersection(args);
            let overId = getFirstCollision(intersections, 'id');

            if (overId != null) {
                if (overId === TRASH_ID) {
                    // If the intersecting droppable is the trash, return early
                    // Remove this if you're not using trashable functionality in your app
                    return intersections;
                }

                if (overId in bookIds) {
                    const containerItems = bookIds[overId];

                    // If a container is matched and it contains items (columns 'A', 'B', 'C')
                    if (containerItems.length > 0) {
                        // Return the closest droppable within that container
                        overId = closestCenter({
                            ...args,
                            droppableContainers: args.droppableContainers.filter(
                                (container) =>
                                    container.id !== overId &&
                                    containerItems.includes(container.id)
                            ),
                        })[0]?.id;
                    }
                }

                lastOverId.current = overId;

                return [{id: overId}];
            }

            if (recentlyMovedToNewContainer.current) {
                lastOverId.current = activeId;
            }

            // If no droppable is matched, return the last match
            return lastOverId.current ? [{id: lastOverId.current}] : [];
        },
        [activeId, bookIds]
    );
    const [clonedItems, setClonedItems] = useState(null);
    const sensors = useSensors(
        useSensor(MouseSensor),
        useSensor(TouchSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter,
        })
    );
    const findContainer = (id) => {
        if (id in bookIds) {
            return id;
        }

        return Object.keys(bookIds).find((key) => bookIds[key].includes(id));
    };

    const getIndex = (id) => {
        const container = findContainer(id);

        if (!container) {
            return -1;
        }

        const index = bookIds[container].indexOf(id);

        return index;
    };

    const onDragCancel = () => {
        if (clonedItems) {
            // Reset items to their original state in case items have been
            // Dragged across containers
            setBookIds(clonedItems);
        }

        setActiveId(null);
        setClonedItems(null);
    };

    useEffect(() => {
        requestAnimationFrame(() => {
            recentlyMovedToNewContainer.current = false;
        });
    }, [bookIds]);

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={collisionDetectionStrategy}
            measuring={{
                droppable: {
                    strategy: MeasuringStrategy.Always,
                },
            }}
            onDragStart={({active}) => {
                setActiveId(active.id);
                setClonedItems(bookIds);
                startContainer.current = findContainer(active.id);
            }}
            onDragOver={({active, over}) => {
                const overId = over?.id;

                if (overId == null || overId === TRASH_ID || active.id in bookIds) {
                    return;
                }

                const overContainer = findContainer(overId);
                const activeContainer = findContainer(active.id);

                if (!overContainer || !activeContainer) {
                    return;
                }

                if (activeContainer !== overContainer) {
                    setBookIds((items) => {
                        const activeItems = items[activeContainer];
                        const overItems = items[overContainer];
                        const overIndex = overItems.indexOf(overId);
                        const activeIndex = activeItems.indexOf(active.id);

                        let newIndex;

                        if (overId in items) {
                            newIndex = overItems.length + 1;
                        } else {
                            const isBelowOverItem =
                                over &&
                                active.rect.current.translated &&
                                active.rect.current.translated.top >
                                over.rect.top + over.rect.height;

                            const modifier = isBelowOverItem ? 1 : 0;

                            newIndex =
                                overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
                        }

                        recentlyMovedToNewContainer.current = true;

                        return {
                            ...items,
                            [activeContainer]: items[activeContainer].filter(
                                (item) => item !== active.id
                            ),
                            [overContainer]: [
                                ...items[overContainer].slice(0, newIndex),
                                items[activeContainer][activeIndex],
                                ...items[overContainer].slice(
                                    newIndex,
                                    items[overContainer].length
                                ),
                            ],
                        };
                    });
                }
            }}
            onDragEnd={({active, over}) => {
                if (active.id in bookIds && over?.id) {
                    setContainers((containers) => {
                        const activeIndex = containers.indexOf(active.id);
                        const overIndex = containers.indexOf(over.id);

                        return arrayMove(containers, activeIndex, overIndex);
                    });
                }

                const activeContainer = findContainer(active.id);

                if (!activeContainer) {
                    setActiveId(null);
                    return;
                }

                const overId = over?.id;

                if (overId == null) {
                    setActiveId(null);
                    return;
                }

                if (overId === TRASH_ID) {
                    setBookIds((items) => ({
                        ...items,
                        [activeContainer]: items[activeContainer].filter(
                            (id) => id !== activeId
                        ),
                    }));

                    // send api call to update books if user wants to remove it from the shelves
                    updateBookCategory(active.id, "None").then(console.log)

                    setActiveId(null);
                    return;
                }

                const overContainer = findContainer(overId);

                if (overContainer) {
                    const activeIndex = bookIds[activeContainer].indexOf(active.id);
                    const overIndex = bookIds[overContainer].indexOf(overId);

                    // send api call to update books if category has been changed
                    if (startContainer.current !== overContainer) {
                        updateBookCategory(active.id, overContainer)
                    }

                    if (activeIndex !== overIndex) {
                        setBookIds((items) => ({
                            ...items,
                            [overContainer]: arrayMove(
                                items[overContainer],
                                activeIndex,
                                overIndex
                            ),
                        }));
                    }
                }

                setActiveId(null);
                startContainer.current = null
            }}
            cancelDrop={cancelDrop}
            onDragCancel={onDragCancel}
            modifiers={modifiers}
        >
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
                <div
                    style={{
                        display: 'inline-grid',
                        width: "clamp(250px, 75%, 825px)", // CUSTOM
                        boxSizing: 'border-box',
                        padding: 20,
                        gridAutoFlow: vertical ? 'row' : 'column',
                    }}
                >
                    <SortableContext
                        items={[...containers]}
                        strategy={
                            vertical
                                ? verticalListSortingStrategy
                                : horizontalListSortingStrategy
                        }
                    >
                        {containers.map((containerId) => (
                            <DroppableContainer
                                key={containerId}
                                id={containerId}
                                label={minimal ? undefined : containerNames[containerId]}
                                columns={columns}
                                items={bookIds[containerId]}
                                scrollable={scrollable}
                                style={containerStyle}
                                unstyled={minimal}
                                onRemove={() => handleRemove(containerId)}
                            >
                                <SortableContext items={bookIds[containerId]} strategy={strategy}>
                                    {bookIds[containerId].map((value, index) => {
                                        return (
                                            <SortableItem
                                                registeredBooks={registeredBooks}
                                                disabled={isSortingContainer}
                                                key={value}
                                                id={value}
                                                index={index}
                                                handle={handle}
                                                style={getItemStyles}
                                                wrapperStyle={wrapperStyle}
                                                renderItem={renderItem}
                                                containerId={containerId}
                                                getIndex={getIndex}
                                            />
                                        );
                                    })}
                                </SortableContext>
                            </DroppableContainer>
                        ))}
                    </SortableContext>
                </div>
            </div>
            {createPortal(
                <DragOverlay adjustScale={adjustScale} dropAnimation={dropAnimation}>
                    {activeId
                        ? containers.includes(activeId)
                            ? renderContainerDragOverlay(activeId)
                            : renderSortableItemDragOverlay(activeId)
                        : null}
                </DragOverlay>,
                document.body
            )}
            {trashable && activeId && !containers.includes(activeId) ? (
                <Trash id={TRASH_ID} />
            ) : null}
        </DndContext>
    );

    function renderSortableItemDragOverlay(bookId) {
        return (
            <Book
                value={bookId}
                bookInfo={registeredBooks[bookId]}
                handle={handle}
                style={getItemStyles({
                    containerId: findContainer(bookId),
                    overIndex: -1,
                    index: getIndex(bookId),
                    value: bookId,
                    isSorting: true,
                    isDragging: true,
                    isDragOverlay: true,
                })}
                wrapperStyle={wrapperStyle({index: 0})}
                renderItem={renderItem}
                dragOverlay
            />
        );
    }

    function renderContainerDragOverlay(containerId) {
        return (
            <Container
                label={`Column ${containerId}`}
                columns={columns}
                style={{
                    height: '100%',
                }}
                shadow
                unstyled={false}
            >
                {bookIds[containerId].map((bookId, index) => (
                    <Book
                        key={bookId}
                        value={bookId}
                        bookInfo={registeredBooks[bookId]}
                        handle={handle}
                        style={getItemStyles({
                            containerId,
                            overIndex: -1,
                            index: getIndex(bookId),
                            value: bookId,
                            isDragging: false,
                            isSorting: false,
                            isDragOverlay: false,
                        })}
                        wrapperStyle={wrapperStyle({index})}
                        renderItem={renderItem}
                    />
                ))}
            </Container>
        );
    }

    function handleRemove(containerID) {
        setContainers((containers) =>
            containers.filter((id) => id !== containerID)
        );
    }

    function getNextContainerId() {
        const containerIds = Object.keys(bookIds);
        const lastContainerId = containerIds[containerIds.length - 1];

        return String.fromCharCode(lastContainerId.charCodeAt(0) + 1);
    }
}

function Trash({id}) {
    const {setNodeRef, isOver} = useDroppable({
        id,
    });

    return (
        <div
            ref={setNodeRef}
/*            style={{
                backgroundColor: "white",
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'fixed',
                left: '50%',
                marginLeft: -150,
                bottom: 20,
                width: 300,
                height: 60,
                borderRadius: 5,
                border: '1px solid',
                borderColor: isOver ? 'red' : '#DDD',
            }}*/
            style={{
                backgroundColor: "white",
                color: isOver ? 'red' : '#001529',
                display: 'flex',
                flexDirection: "column",
                alignItems: 'center',
                justifyContent: 'center',
                position: 'fixed',
                left: '25px',
                bottom: "45px",
                // transform: "translate(0, -50%)",
                width: "clamp(75px, 7vw, 175px)",
                height: "clamp(75px, 7vw, 175px)",
                borderRadius: 5,
                border: '2px dashed',
                borderColor: isOver ? 'red' : '#001529',
            }}
        >
            <DeleteOutlined style={{ fontSize: "clamp(32px, 4vw, 45px)" }} />
        </div>
    );
}

function SortableItem({
                          registeredBooks,
                          disabled,
                          id: bookId,
                          index,
                          handle,
                          renderItem,
                          style,
                          containerId,
                          getIndex,
                          wrapperStyle,
                      }) {
    const {
        setNodeRef,
        setActivatorNodeRef,
        listeners,
        isDragging,
        isSorting,
        over,
        overIndex,
        transform,
        transition,
    } = useSortable({
        id: bookId,
    });
    const mounted = useMountStatus();
    const mountedWhileDragging = isDragging && !mounted;

    return (
        <Book
            ref={disabled ? undefined : setNodeRef}
            value={bookId}
            bookInfo={registeredBooks[bookId]}
            dragging={isDragging}
            sorting={isSorting}
            handle={handle}
            handleProps={handle ? {ref: setActivatorNodeRef} : undefined}
            index={index}
            wrapperStyle={wrapperStyle({index})}
            style={style({
                index,
                value: bookId,
                isDragging,
                isSorting,
                overIndex: over ? getIndex(over.id) : overIndex,
                containerId,
            })}
            transition={transition}
            transform={transform}
            fadeIn={mountedWhileDragging}
            listeners={listeners}
            renderItem={renderItem}
        />
    );
}

function useMountStatus() {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => setIsMounted(true), 500);

        return () => clearTimeout(timeout);
    }, []);

    return isMounted;
}