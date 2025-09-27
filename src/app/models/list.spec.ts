import { List } from './list';

describe('List', () => {
  it('should create an instance', () => {
    expect(new List('1', 'test', 'owner')).toBeTruthy();
  });
});
