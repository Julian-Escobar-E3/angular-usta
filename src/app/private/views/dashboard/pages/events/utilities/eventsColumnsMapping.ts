import {
  ITableData,
  TableColumns,
} from '../pages/events-list/events-list.component';

export const EventsTableColumnMappings: Record<TableColumns, keyof ITableData> =
  {
    [TableColumns.age]: 'age',
    [TableColumns.name]: 'name',
    [TableColumns.occupation]: 'occupation',
    [TableColumns.country]: 'country',
  } as const;
