import { SelectColumnFilter } from "../table/utils/filters";

const columns = [
  // {
  //   Header: () => null,
  //   id: "expander", // 'id' is required
  //   Cell: ({ row }) => (
  //     <span {...row.getToggleRowExpandedProps()}>
  //       {row.isExpanded ? "👇" : "👉"}
  //     </span>
  //   ),
  // },
  {
    Header: "Account Id",
    accessor: "id",
    // disableSortBy: true,
    // Filter: SelectColumnFilter,
    // filter: "equals",
  },
  {
    Header: "Service name",
    accessor: (values) => {
      const head = values.integration_name == "xero" ? "Xero" : "QuickBooks";
      return head;
    },
    Filter: SelectColumnFilter,
    filter: "equals",
  },
  {
    Header: "Account name",
    accessor: "account_name",
  },

  {
    Header: "Amount",
    accessor: "amount",
  },
  {
    Header: "Date",
    accessor: "date",
    Filter: SelectColumnFilter,
    filter: "equals",
  },
  {
    Header: "Type",
    //accessor: "type",
    accessor: (values) => {
      const head = values.type == "DE" ? "Debit" : "Credit";
      return head;
    },
    Filter: SelectColumnFilter,
    filter: "equals",
    disableSortBy: true,
  },
];

export default columns;
