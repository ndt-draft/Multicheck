import './MultiCheck.css'

import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { FC } from 'react'
import lodash from 'lodash'
import Checkbox from './Checkbox'

export type Option = {
  label: string
  value: string
}

export function makeOptionChunks(
  options: Option[],
  columns: number,
  extraOptions: Option[] = []
): Option[][] {
  const chunks: Option[][] = []
  const allOptions = [...extraOptions, ...options]

  // determine chunk size
  allOptions.forEach((opt, index) => {
    const chunkIndex = columns > 0 ? index % columns : 0
    if (!chunks[chunkIndex]) {
      chunks[chunkIndex] = []
    }
    chunks[chunkIndex].push(opt)
  })

  // reorder chunk items follow requirement
  let start: number = 0
  let end: number = chunks?.[0]?.length
  return chunks.map((chunk, chunkIndex) => {
    if (chunkIndex !== 0) {
      start = end
      end += chunk?.length
    }
    return allOptions.slice(start, end)
  })
}

/**
 * Notice:
 * 1. There should be a special `Select All` option with checkbox to control all passing options
 * 2. All the options (including the "Select All") should be split into several columns, and the order is from top to bottom in each column
 */
type Props = {
  // the label text of the whole component
  label?: string
  // Assume no duplicated labels or values
  // It may contain any values, so be careful for you "Select All" option
  options: Option[]
  // Always be non-negative integer.
  // The default value is 1
  // 0 is considered as 1
  // We only check [0, 1, 2, ... 10], but it should work for greater number
  columns?: number
  // Which options should be selected.
  // - If `undefined`, makes the component in uncontrolled mode with no default options checked, but the component is still workable;
  // - if not undefined, it's considered as the default value to render the component. And when it changes, it will be considered as the NEW default value to render the component again
  // - Assume no duplicated values.
  // - It may contain values not in the options.
  values?: string[]
  // if not undefined, when checked options are changed, they should be passed to outside
  // if undefined, the options can still be selected, but won't notify the outside
  onChange?: (options: Option[]) => void
}

export const MultiCheck: FC<Props> = (props: Props) => {
  const { label, options, values, columns, onChange } = props

  // handle it own selected values state
  // caused by requirement **Don't modify the code of the 'Controller'**
  const [selectedValues, setSelectedValues] = useState(values)

  // reset selected values when options/values props is modified by controller
  useEffect(() => {
    const checkedOptions = lodash.filter(options, (opt) =>
      lodash.includes(values, opt.value)
    )
    setSelectedValues(lodash.map(checkedOptions, 'value'))
    if (typeof onChange === 'function') {
      onChange(checkedOptions)
    }
  }, [options, values])

  function handleChange(
    option: Option
  ): (e: React.ChangeEvent<HTMLInputElement>) => void {
    return (e: React.ChangeEvent<HTMLInputElement>): void => {
      if (e.target.value === 'all') {
        handleSelectAll(e)
        return
      }

      let checkedOptions = lodash.filter(options, (opt) =>
        lodash.includes(selectedValues, opt.value)
      )

      if (e.target.checked) {
        checkedOptions = [...checkedOptions, option]
      } else {
        checkedOptions = lodash.filter(
          checkedOptions,
          (opt) => opt.value !== option.value
        )
      }
      setSelectedValues(lodash.map(checkedOptions, 'value'))

      if (typeof onChange === 'function') {
        onChange(checkedOptions)
      }
    }
  }

  const handleSelectAll = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      setSelectedValues(e.target.checked ? lodash.map(options, 'value') : [])
      if (typeof onChange === 'function') {
        onChange(e.target.checked ? options : [])
      }
    },
    [options]
  )

  const allOptions: Option[][] = useMemo(
    () =>
      makeOptionChunks(options, columns || 1, [
        { label: 'Select All', value: 'all' },
      ]),
    [options, columns]
  )

  return (
    <div className="MultiCheck">
      <div className="MultiCheck-heading" role="heading">
        {label}
      </div>
      <div className="MultiCheck-options">
        {allOptions.map((chunk, chunkIndex) => (
          <div key={chunkIndex} role="list" className="MultiCheck-column">
            {chunk.map((option) => (
              <Checkbox
                key={option.value}
                option={option}
                checked={
                  option.value === 'all'
                    ? options.length === selectedValues?.length
                    : lodash.includes(selectedValues, option.value)
                }
                onChange={handleChange(option)}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
