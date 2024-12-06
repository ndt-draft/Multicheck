// TODO more tests
import React from 'react'
import { render, fireEvent, screen, within } from '@testing-library/react'
import { Controller } from '../Controller'
import { makeOptionChunks, Option, MultiCheck } from './MultiCheck'

describe('MultiCheck', () => {
  const allOptions: Option[] = [
    { label: 'aaa', value: '111' },
    { label: 'bbb', value: '222' },
    { label: 'ccc', value: '333' },
    { label: 'ddd', value: '444' },
    { label: 'eee', value: '555' },
    { label: 'fff', value: '666' },
    { label: 'ggg', value: '777' },
    { label: 'hhh', value: '888' },
    { label: 'iii', value: '999' },
  ]
  const sixOptions: Option[] = allOptions.slice(0, 6)
  const sevenOptions: Option[] = allOptions.slice(0, 7)

  const allValues = allOptions.map((it) => it.value)

  describe('initialize', () => {
    it('renders the label if label provided', () => {
      render(<MultiCheck label="Status" options={[]} />)

      expect(screen.getByText('Status')).toBeVisible()
    })

    it('renders no label if label undefined', () => {
      render(<MultiCheck options={[]} />)

      expect(screen.queryByText('Status')).toBeNull()
    })

    it('renders correct all selected values', () => {
      render(
        <MultiCheck label="Status" options={allOptions} values={allValues} />
      )

      screen.getAllByRole('checkbox').forEach((checkbox) => {
        expect(checkbox).toBeChecked()
      })
    })

    it('renders correct selected values', () => {
      render(
        <MultiCheck
          label="Status"
          options={allOptions}
          values={['111', '222', '666']}
        />
      )

      screen.getAllByRole('checkbox').forEach((checkbox, checkboxIndex) => {
        if ([1, 2, 6].includes(checkboxIndex)) {
          expect(checkbox).toBeChecked()
        } else {
          expect(checkbox).not.toBeChecked()
        }
      })
    })

    it('renders no checkboxes if empty options', () => {
      render(<MultiCheck label="Status" options={[]} />)

      expect(screen.queryByText('Select All')).toBeNull()
      expect(screen.queryByText('aaa')).toBeNull()
    })

    it('renders options correctly if undefined values', () => {
      render(
        <MultiCheck
          label="Status"
          options={allOptions.slice(0, 2)}
          columns={2}
        />
      )

      expect(screen.getByText('Select All')).toBeInTheDocument()
      expect(screen.getByText('aaa')).toBeInTheDocument()
      expect(screen.getByText('bbb')).toBeInTheDocument()
    })

    it('renders options correctly if undefined columns', () => {
      render(
        <MultiCheck
          label="Status"
          options={allOptions.slice(0, 2)}
          values={['111', '222']}
        />
      )

      expect(screen.getByText('Select All')).toBeInTheDocument()
      expect(screen.getByText('aaa')).toBeInTheDocument()
      expect(screen.getByText('bbb')).toBeInTheDocument()
    })

    it('renders options correctly if values contains non-existent options', () => {
      render(
        <MultiCheck
          label="Status"
          options={allOptions.slice(0, 2)}
          values={['111', '222', '333', '444']}
        />
      )

      expect(screen.getByText('Select All')).toBeInTheDocument()
      expect(screen.getByText('aaa')).toBeInTheDocument()
      expect(screen.getByText('bbb')).toBeInTheDocument()
      expect(screen.queryByText('ccc')).toBeNull()
      expect(screen.queryByText('ddd')).toBeNull()
    })

    it('calls onChange after click checkbox', () => {
      const onChange = jest.fn()

      render(
        <MultiCheck
          label="Status"
          options={allOptions}
          values={[]}
          onChange={onChange}
        />
      )

      const firstOption = screen.getAllByRole('checkbox')[1]
      fireEvent.click(firstOption)
      expect(onChange).toBeCalled()
    })
  })

  describe('uncontrolled mode', () => {
    it('handles click option correctly if undefined values and onChange', () => {
      render(<MultiCheck label="Status" options={allOptions} />)
      const firstOption = screen.getAllByRole('checkbox')[1]
      fireEvent.click(firstOption)
      expect(firstOption).toBeChecked()
    })

    it('handles click select all correctly if undefined values and onChange', () => {
      render(<MultiCheck label="Status" options={allOptions} />)
      const selectAll = screen.getAllByRole('checkbox')[0]
      fireEvent.click(selectAll)
      screen.getAllByRole('checkbox').forEach((checkbox) => {
        expect(checkbox).toBeChecked()
      })
    })
  })

  describe('columns', () => {
    it('handles columns is 0 as 1', () => {
      render(<MultiCheck label="Status" options={allOptions} columns={0} />)
      expect(screen.getAllByRole('list')).toHaveLength(1)
    })

    it('handles columns is 1', () => {
      render(<MultiCheck label="Status" options={allOptions} columns={1} />)
      expect(screen.getAllByRole('list')).toHaveLength(1)
    })

    it('handles changing columns dynamically', () => {
      const { rerender } = render(
        <MultiCheck label="Status" options={allOptions} columns={2} />
      )
      expect(screen.getAllByRole('list')).toHaveLength(2)

      rerender(<MultiCheck label="Status" options={allOptions} columns={3} />)
      expect(screen.getAllByRole('list')).toHaveLength(3)
    })

    it('distributes 6 options even in 3 columns', () => {
      render(<MultiCheck label="Status" options={sixOptions} columns={3} />)

      const columns = screen.getAllByRole('list')
      expect(within(columns[0]).getByText('Select All')).toBeInTheDocument()
      expect(within(columns[0]).getByText('aaa')).toBeInTheDocument()
      expect(within(columns[0]).getByText('bbb')).toBeInTheDocument()

      expect(within(columns[1]).getByText('ccc')).toBeInTheDocument()
      expect(within(columns[1]).getByText('ddd')).toBeInTheDocument()

      expect(within(columns[2]).getByText('eee')).toBeInTheDocument()
      expect(within(columns[2]).getByText('fff')).toBeInTheDocument()
    })

    it('distributes 7 options even in 3 columns', () => {
      render(<MultiCheck label="Status" options={sevenOptions} columns={3} />)

      const columns = screen.getAllByRole('list')
      expect(within(columns[0]).getByText('Select All')).toBeInTheDocument()
      expect(within(columns[0]).getByText('aaa')).toBeInTheDocument()
      expect(within(columns[0]).getByText('bbb')).toBeInTheDocument()
      expect(within(columns[0]).getByText('ccc')).toBeInTheDocument()

      expect(within(columns[1]).getByText('ddd')).toBeInTheDocument()
      expect(within(columns[1]).getByText('eee')).toBeInTheDocument()

      expect(within(columns[2]).getByText('fff')).toBeInTheDocument()
      expect(within(columns[2]).getByText('ggg')).toBeInTheDocument()
    })
  })

  describe('with Controller', () => {
    it('unselect/select all and click some checkboxes', () => {
      render(
        <Controller
          render={(options, values, columns, onChange) => (
            <MultiCheck
              label="MultiCheck"
              options={options}
              onChange={onChange}
              values={values}
              columns={columns}
            />
          )}
        />
      )

      const allCheckboxes = screen.getAllByRole('checkbox')
      const selectAll = allCheckboxes[0]
      fireEvent.click(selectAll)
      allCheckboxes.forEach((checkbox) => {
        expect(checkbox).not.toBeChecked()
      })

      fireEvent.click(allCheckboxes[1])
      fireEvent.click(allCheckboxes[3])
      expect(screen.getByText('111,333')).toBeVisible()

      fireEvent.click(selectAll)
      fireEvent.click(allCheckboxes[1])
      expect(selectAll).not.toBeChecked()
      fireEvent.click(allCheckboxes[1])
      expect(selectAll).toBeChecked()
    })
  })

  describe('makeOptionChunks()', () => {
    it('should return empty array if empty options', () => {
      expect(makeOptionChunks([], 3)).toStrictEqual([])
      expect(makeOptionChunks([], 0)).toStrictEqual([])
    })

    it('should return all options in a single chunk when columns is 0', () => {
      expect(makeOptionChunks(allOptions, 0)).toStrictEqual([allOptions])
    })

    it('should return all options in a single chunk when columns is 1', () => {
      expect(makeOptionChunks(allOptions, 1)).toStrictEqual([allOptions])
    })

    it('should return each option as a separate chunk when columns exceed the number of options', () => {
      expect(makeOptionChunks(sixOptions, 10)).toStrictEqual([
        [{ label: 'aaa', value: '111' }],
        [{ label: 'bbb', value: '222' }],
        [{ label: 'ccc', value: '333' }],
        [{ label: 'ddd', value: '444' }],
        [{ label: 'eee', value: '555' }],
        [{ label: 'fff', value: '666' }],
      ])
    })

    it('should distribute options evenly across columns when possible', () => {
      expect(makeOptionChunks(sixOptions, 3)).toStrictEqual([
        [
          { label: 'aaa', value: '111' },
          { label: 'bbb', value: '222' },
        ],
        [
          { label: 'ccc', value: '333' },
          { label: 'ddd', value: '444' },
        ],
        [
          { label: 'eee', value: '555' },
          { label: 'fff', value: '666' },
        ],
      ])
      expect(makeOptionChunks(sevenOptions, 3)).toStrictEqual([
        [
          { label: 'aaa', value: '111' },
          { label: 'bbb', value: '222' },
          { label: 'ccc', value: '333' },
        ],
        [
          { label: 'ddd', value: '444' },
          { label: 'eee', value: '555' },
        ],
        [
          { label: 'fff', value: '666' },
          { label: 'ggg', value: '777' },
        ],
      ])
    })
  })
})
