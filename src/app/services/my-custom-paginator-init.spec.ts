import { MyCustomPaginatorIntl } from './my-custom-paginator-init';
describe('MyCustomPaginatorIntl', () => {
  let myCustomPaginatorIntl: MyCustomPaginatorIntl;
  beforeEach(() => {
    myCustomPaginatorIntl = new MyCustomPaginatorIntl();
  });
  it('should create', () => {
    expect(myCustomPaginatorIntl).toBeTruthy();
  });
  it('should return "Page 1 of 1" if length <= 0 ', () => {
    const resutl: string = myCustomPaginatorIntl.getRangeLabel(0, 0, 0);
    expect(resutl).toBe($localize`Page 1 of 1`);
  });
  it('should return page number of lenght/pagesize result when they are devidable', () => {
    const result = myCustomPaginatorIntl.getRangeLabel(4, 10, 20);
    expect(result).toBe($localize`Page 2 of 2`);
  });
  it('should return page number of lenght/pagesize ceiling result when they are not devidable', () => {
    const result = myCustomPaginatorIntl.getRangeLabel(1, 2, 11);
    expect(result).toBe($localize`Page 2 of 6`);
  });
});
