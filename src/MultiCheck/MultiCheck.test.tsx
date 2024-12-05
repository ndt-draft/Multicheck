// TODO more tests
import { makeOptionChunks, Option } from "./MultiCheck";

describe('MultiCheck', () => {
  describe('initialize', () => {
    it('renders the label if label provided', () => {
      // TODO
    });
  });

  describe('makeOptionChunks()', () => {
    const sixOptions: Option[] = [
      {label: 'aaa', value: '111',},
      {label: 'bbb', value: '222',},
      {label: 'ccc', value: '333',},
      {label: 'ddd', value: '444',},
      {label: 'eee', value: '555',},
      {label: 'fff', value: '666',},
    ]

    const sevenOptions: Option[] = [
      ...sixOptions,
      {label: 'ggg', value: '777',},
    ]

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
