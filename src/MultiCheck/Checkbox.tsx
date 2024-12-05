import React from 'react'
import { FC } from "react"

type Props = {
  option: {
    label: string,
    value: string,
  },
  checked: boolean,
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const Checkbox: FC<Props> = (props: Props) => {
  const {option, checked, onChange} = props
  return (
    <label>
      <input type="checkbox" value={option.value} checked={checked} onChange={onChange} />{option.label}
    </label>
  )
}

export default Checkbox
