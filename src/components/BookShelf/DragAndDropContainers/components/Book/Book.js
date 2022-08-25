import React, { useEffect } from 'react'

// custom components
import BookDisplay from "../../../../BookDisplay";

// style
import classNames from 'classnames'
import styles from '../../../../../assets/styles/Book.module.scss'

// ant design
import { Typography } from "antd"
import "antd/dist/antd.min.css"

const { Text } = Typography

export const Book = React.memo(
  React.forwardRef(
    (
      {
          bookId,
          registeredBooks,
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
              value: bookId,
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
                  <BookDisplay bookId={bookId} registeredBooks={registeredBooks} />
              </div>
          </li>
      );
    }
  )
);
