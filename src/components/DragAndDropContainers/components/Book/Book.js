import React, {useEffect} from 'react'

// style
import classNames from 'classnames'
import styles from './Book.module.scss'

// ant design
import { Typography } from "antd"
import "antd/dist/antd.min.css"

const { Text } = Typography

export const Book = React.memo(
  React.forwardRef(
    (
      {
          color,
          dragOverlay,
          dragging,
          disabled,
          fadeIn,
          handle,
          handleProps,
          height,
          index,
          listeners,
          onRemove,
          renderItem,
          sorting,
          style,
          transition,
          transform,
          value,
          bookInfo,
          wrapperStyle,
          ...props
      },
      ref
    ) => {
      useEffect(() => {
        if (!dragOverlay) {
          return;
        }

        document.body.style.cursor = 'grabbing';

        return () => {
          document.body.style.cursor = '';
        };
      }, [dragOverlay]);

      return renderItem ? (
          renderItem({
              dragOverlay: Boolean(dragOverlay),
              dragging: Boolean(dragging),
              sorting: Boolean(sorting),
              index,
              fadeIn: Boolean(fadeIn),
              listeners,
              ref,
              style,
              transform,
              transition,
              value,
            })
      ) : (
          <li
              className={classNames(
                  styles.Wrapper,
                  fadeIn && styles.fadeIn,
                  sorting && styles.sorting,
                  dragOverlay && styles.dragOverlay
              )}
              style={
                  {
                      ...wrapperStyle,
                      transition: [transition, wrapperStyle?.transition]
                          .filter(Boolean)
                          .join(', '),
                      '--translate-x': transform
                          ? `${Math.round(transform.x)}px`
                          : undefined,
                      '--translate-y': transform
                          ? `${Math.round(transform.y)}px`
                          : undefined,
                      '--scale-x': transform?.scaleX
                          ? `${transform.scaleX}`
                          : undefined,
                      '--scale-y': transform?.scaleY
                          ? `${transform.scaleY}`
                          : undefined,
                      '--index': index,
                      '--color': color,
                  }
              }
              ref={ref}
          >
              <div
                  className={classNames(
                      styles.Item,
                      dragging && styles.dragging,
                      handle && styles.withHandle,
                      dragOverlay && styles.dragOverlay,
                      disabled && styles.disabled,
                      color && styles.color
                  )}
                  style={style}
                  data-cypress="draggable-item"
                  {...(!handle ? listeners : undefined)}
                  {...props}
                  tabIndex={!handle ? 0 : undefined}
              >
                  <BookDisplay bookInfo={ bookInfo } />
              </div>
          </li>
      );
    }
  )
);

const BookDisplay = ({ bookInfo }) => {
    return (
        <div className={styles.BookDisplay}>
            <div className={styles.BookCoverContainer}>
                <img src={bookInfo['imageLinks']['thumbnail']} className={styles.BookCover} />
            </div>
            <div className={styles.BookInfo}>
                <Text>{ bookInfo["title"] }</Text>
                <br />
                <div className={styles.BookAuthor}>
                    <Text type={"secondary"}>{ bookInfo["authors"][0] }</Text>
                </div>
            </div>
        </div>
    )
}