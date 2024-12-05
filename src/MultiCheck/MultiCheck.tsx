import './MultiCheck.css';

import React, { useEffect, useState } from 'react';
import {FC} from 'react';
import lodash from 'lodash'
import Checkbox from './Checkbox';

export type Option = {
  label: string,
  value: string
}

/**
 * Notice:
 * 1. There should be a special `Select All` option with checkbox to control all passing options
 * 2. All the options (including the "Select All") should be split into several columns, and the order is from top to bottom in each column
 */
type Props = {
  // the label text of the whole component
  label?: string,
  // Assume no duplicated labels or values
  // It may contain any values, so be careful for you "Select All" option
  options: Option[],
  // Always be non-negative integer.
  // The default value is 1
  // 0 is considered as 1
  // We only check [0, 1, 2, ... 10], but it should work for greater number
  columns?: number,
  // Which options should be selected.
  // - If `undefined`, makes the component in uncontrolled mode with no default options checked, but the component is still workable;
  // - if not undefined, it's considered as the default value to render the component. And when it changes, it will be considered as the NEW default value to render the component again
  // - Assume no duplicated values.
  // - It may contain values not in the options.
  values?: string[]
  // if not undefined, when checked options are changed, they should be passed to outside
  // if undefined, the options can still be selected, but won't notify the outside
  onChange?: (options: Option[]) => void,
}

export const MultiCheck: FC<Props> = (props: Props) => {
  console.log('props', props)
  const {options, values, onChange} = props

  // handle it own selected values state
  // caused by requirement **Don't modify the code of the 'Controller'**
  const [selectedValues, setSelectedValues] = useState(values)

  // reset selected values when Values count is modified by controller
  useEffect(() => {
    setSelectedValues(values)
    if (typeof onChange === 'function') {
      const checkedOptions = lodash.filter(options, opt => lodash.includes(values, opt.value))
      onChange(checkedOptions)
    }
  }, [values])

  function handleChange(option: Option): (e: React.ChangeEvent<HTMLInputElement>) => void {
    return (e: React.ChangeEvent<HTMLInputElement>): void => {
      if (typeof onChange === 'function') {
        let checkedOptions = lodash.filter(options, opt => lodash.includes(selectedValues, opt.value))

        if (e.target.checked) {
          checkedOptions = [...checkedOptions, option]
        } else {
          checkedOptions = lodash.filter(checkedOptions, opt => opt.value !== option.value)
        }
        setSelectedValues(lodash.map(checkedOptions, 'value'))
        onChange(checkedOptions)
      }
    }
  }

  function handleSelectAll(e: React.ChangeEvent<HTMLInputElement>): void {
    if (typeof onChange === 'function') {
      setSelectedValues(e.target.checked ? lodash.map(options, 'value') : [])
      onChange(e.target.checked ? options: [])
    }
  }

  return <div className='MultiCheck'>
    <Checkbox option={{
        label: 'Select All',
        value: 'all'
      }}
      checked={options.length === selectedValues?.length}
      onChange={handleSelectAll}
    />
    {options.map(option =>
      <Checkbox
        key={option.value}
        option={option}
        checked={lodash.includes(selectedValues, option.value)}
        onChange={handleChange(option)}
      />
    )}
  </div>
}
