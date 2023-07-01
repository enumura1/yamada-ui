import {
  ui,
  forwardRef,
  useMultiComponentStyle,
  omitThemeProps,
  CSSUIObject,
  HTMLUIProps,
  ThemeProps,
  Token,
} from '@yamada-ui/core'
import { useValue } from '@yamada-ui/use-value'
import { cx, omitObject, dataAttr, handlerAll } from '@yamada-ui/utils'
import { ComponentPropsWithoutRef, FC, useMemo } from 'react'
import { PaginationItem, PaginationItemProps } from './pagination-item'
import { PaginationProvider, usePagination, UsePaginationProps } from './use-pagination'

type PaginationOptions = {
  /**
   * The pagination button component to use.
   */
  component?: FC<PaginationItemProps>
  /**
   * Props for button element.
   */
  itemProps?: HTMLUIProps<'button'>
  /**
   * If `true`, display the control buttons.
   *
   * @default true
   */
  withControls?: Token<boolean>
  /**
   * Props for control button element.
   */
  controlProps?: HTMLUIProps<'button'>
  /**
   * Props for previous of the control button element.
   */
  controlPrevProps?: HTMLUIProps<'button'>
  /**
   * Props for next of the control button element.
   */
  controlNextProps?: HTMLUIProps<'button'>
  /**
   * If `true`, display the edge buttons.
   *
   * @default false
   */
  withEdges?: Token<boolean>
  /**
   * Props for edge button element.
   */
  edgeProps?: HTMLUIProps<'button'>
  /**
   * Props for first of the edge button element.
   */
  edgeFirstProps?: HTMLUIProps<'button'>
  /**
   * Props for last of the edge button element.
   */
  edgeLastProps?: HTMLUIProps<'button'>
}

export type PaginationProps = Omit<HTMLUIProps<'div'>, 'onChange' | 'children'> &
  ThemeProps<'Pagination'> &
  UsePaginationProps &
  PaginationOptions

export const Pagination = forwardRef<PaginationProps, 'div'>((props, ref) => {
  const [styles, mergedProps] = useMultiComponentStyle('Pagination', props)
  const {
    className,
    component: Component = PaginationItem,
    itemProps,
    withControls = true,
    withEdges = false,
    controlProps,
    controlPrevProps,
    controlNextProps,
    edgeProps,
    edgeFirstProps,
    edgeLastProps,
    ...rest
  } = omitThemeProps(mergedProps)

  const computedWithControls = useValue(withControls)
  const computedWithEdges = useValue(withEdges)

  const { currentPage, total, isDisabled, onFirst, onLast, onPrev, onNext, onChange, range } =
    usePagination(rest)

  const children = useMemo(
    () =>
      range.map((page, key) => (
        <Component
          key={key}
          page={page}
          isActive={currentPage === page}
          isDisabled={isDisabled}
          {...(itemProps as ComponentPropsWithoutRef<'button'>)}
          onClick={handlerAll(
            itemProps?.onClick,
            page !== 'dots' ? () => onChange(page) : undefined,
          )}
        />
      )),
    [Component, currentPage, isDisabled, onChange, range, itemProps],
  )

  const css: CSSUIObject = { display: 'flex', alignItems: 'center', ...styles.container }

  return (
    <PaginationProvider value={styles}>
      <ui.div
        ref={ref}
        className={cx('ui-pagination', className)}
        role='navigation'
        __css={css}
        {...omitObject(rest, ['onChange'])}
        data-disabled={dataAttr(isDisabled)}
      >
        {computedWithEdges ? (
          <Component
            page='first'
            className='ui-pagination-item-first'
            isDisabled={isDisabled || currentPage === 1}
            {...(edgeProps as ComponentPropsWithoutRef<'button'>)}
            {...(edgeFirstProps as ComponentPropsWithoutRef<'button'>)}
            onClick={handlerAll(edgeProps?.onClick, edgeFirstProps?.onClick, onFirst)}
          />
        ) : null}

        {computedWithControls ? (
          <Component
            page='prev'
            className='ui-pagination-item-prev'
            isDisabled={isDisabled || currentPage === 1}
            {...(controlProps as ComponentPropsWithoutRef<'button'>)}
            {...(controlPrevProps as ComponentPropsWithoutRef<'button'>)}
            onClick={handlerAll(controlProps?.onClick, controlPrevProps?.onClick, onPrev)}
          />
        ) : null}

        {children}

        {computedWithControls ? (
          <Component
            page='next'
            className='ui-pagination-item-next'
            isDisabled={isDisabled || currentPage === total}
            {...(controlProps as ComponentPropsWithoutRef<'button'>)}
            {...(controlNextProps as ComponentPropsWithoutRef<'button'>)}
            onClick={handlerAll(controlProps?.onClick, controlNextProps?.onClick, onNext)}
          />
        ) : null}

        {computedWithEdges ? (
          <Component
            page='last'
            className='ui-pagination-item-last'
            isDisabled={isDisabled || currentPage === total}
            {...(edgeProps as ComponentPropsWithoutRef<'button'>)}
            {...(edgeLastProps as ComponentPropsWithoutRef<'button'>)}
            onClick={handlerAll(edgeProps?.onClick, edgeLastProps?.onClick, onLast)}
          />
        ) : null}
      </ui.div>
    </PaginationProvider>
  )
})
