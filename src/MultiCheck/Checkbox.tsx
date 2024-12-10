import './Checkbox.css'

import React from 'react'
import { FC } from 'react'

type Props = {
  option: {
    label: string
    value: string
  }
  checked: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const Checkbox: FC<Props> = (props: Props) => {
  const { option, checked, onChange } = props
  return (
    <div className="checkbox-wrapper-21">
      <label className="control control--checkbox">
        {option.label}
        <input
          type="checkbox"
          role="checkbox"
          value={option.value}
          checked={checked}
          onChange={onChange}
        />
        <div className="control__indicator"></div>
      </label>
    </div>
  )
}

export default Checkbox
