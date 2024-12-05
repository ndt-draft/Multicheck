// TODO more tests
import React from 'react'
import { render, fireEvent, screen, within } from '@testing-library/react';
import { Controller } from '../Controller';
import { makeOptionChunks, Option, MultiCheck } from "./MultiCheck";

describe('MultiCheck', () => {
  const allOptions: Option[] = [
    {label: 'aaa', value: '111',},
    {label: 'bbb', value: '222',},
    {label: 'ccc', value: '333',},
    {label: 'ddd', value: '444',},
    {label: 'eee', value: '555',},
    {label: 'fff', value: '666',},
    {label: 'ggg', value: '777',},
    {label: 'hhh', value: '888',},
    {label: 'iii', value: '999',},
  ]
  const sixOptions: Option[] = allOptions.slice(0, 6)
  const sevenOptions: Option[] = allOptions.slice(0, 7)

  const allValues = allOptions.map(it => it.value)

  describe('initialize', () => {
    it('renders the label if label provided', () => {
      render(<MultiCheck label="Status" options={[]} />)

      expect(screen.getByText('Status')).toBeVisible()
    });

    it('renders correct all selected values', () => {
      render(<MultiCheck label="Status" options={allOptions} values={allValues} />)

      screen.getAllByRole('checkbox').map(checkbox => {
        expect(checkbox).toBeChecked()
      })
    })

    it('renders correct selected values', () => {
      render(<MultiCheck label="Status" options={allOptions} values={["111", "222", "666"]} />)

      screen.getAllByRole('checkbox').map((checkbox, checkboxIndex) => {
        if ([1, 2, 6].includes(checkboxIndex)) {
          expect(checkbox).toBeChecked()
        } else {
          expect(checkbox).not.toBeChecked()
        }
      })
    })

    it('calls onChange after click checkbox', () => {
      const onChange = jest.fn()

      render(<MultiCheck label="Status" options={allOptions} values={[]} onChange={onChange} />)

      const firstOption = screen.getAllByRole('checkbox')[1]
      fireEvent.click(firstOption)
      expect(onChange).toBeCalled()
    })
  });

  describe('columns', () => {
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
      render(<Controller render={(options, values, columns, onChange) =>
        <MultiCheck label="MultiCheck" options={options}
          onChange={onChange}
          values={values}
          columns={columns}
        />
      }/>)

      const allCheckboxes = screen.getAllByRole('checkbox')
      const selectAll = allCheckboxes[0]
      fireEvent.click(selectAll)
      allCheckboxes.map(checkbox => {
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
    it('should return even chunks as columns', () => {
      expect(makeOptionChunks(sixOptions, 3)).toStrictEqual([
        [{label: 'aaa', value: '111',}, {label: 'bbb', value: '222',}],
        [{label: 'ccc', value: '333',}, {label: 'ddd', value: '444',}],
        [{label: 'eee', value: '555',}, {label: 'fff', value: '666',}],
      ])
      expect(makeOptionChunks(sevenOptions, 3)).toStrictEqual([
        [{label: 'aaa', value: '111',}, {label: 'bbb', value: '222',}, {label: 'ccc', value: '333',}],
        [{label: 'ddd', value: '444',}, {label: 'eee', value: '555',}],
        [{label: 'fff', value: '666',}, {label: 'ggg', value: '777',},],
      ])
    })
  })
});
