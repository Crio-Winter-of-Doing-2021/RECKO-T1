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
    accessor: "type",
    Filter: SelectColumnFilter,
    filter: "equals",
    disableSortBy: true,
  },
  // {
  //   Header: "Hemisphere",
  //   accessor: (values) => {
  //     const { latitude, longitude } = values.location.coordinates;
  //     const first = Number(latitude) > 0 ? "N" : "S";
  //     const second = Number(longitude) > 0 ? "E" : "W";
  //     return first + "/" + second;
  //   },
  //   disableSortBy: true,
  //   Filter: SelectColumnFilter,
  //   filter: "equals",
  //   Cell: ({ cell }) => {
  //     const { value } = cell;

  //     const pickEmoji = (value) => {
  //       let first = value[0]; // N or S
  //       let second = value[2]; // E or W
  //       const options = ["⇖", "⇗", "⇙", "⇘"];
  //       let num = first === "N" ? 0 : 2;
  //       num = second === "E" ? num + 1 : num;
  //       return options[num];
  //     };

  //     return (
  //       <div style={{ textAlign: "center", fontSize: 18 }}>
  //         {pickEmoji(value)}
  //       </div>
  //     );
  //   },
  // },
];

export default columns;
