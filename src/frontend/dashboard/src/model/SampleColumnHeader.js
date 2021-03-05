import Header from "../components/sidebar/Header";
import { SelectColumnFilter } from "../components/table/utils/filters";

const columns = [
  {
    Header: () => null,
    id: "expander", // 'id' is required
    Cell: ({ row }) => (
      <span {...row.getToggleRowExpandedProps()}>
        {row.isExpanded ? "👇" : "👉"}
      </span>
    ),
  },
  {
    Header: "Title",
    accessor: "name.title",
    disableSortBy: true,
    Filter: SelectColumnFilter,
    filter: "equals",
  },
  {
    Header: "First Name",
    accessor: "name.first",
  },
  {
    Header: "Last Name",
    accessor: "name.last",
  },
  {
    Header: "Email",
    accessor: "email",
  },
  {
    Header: "City",
    accessor: "location.city",
  },
  {
    Header: "Hemisphere",
    accessor: (values) => {
      const { latitude, longitude } = values.location.coordinates;
      const first = Number(latitude) > 0 ? "N" : "S";
      const second = Number(longitude) > 0 ? "E" : "W";
      return first + "/" + second;
    },
    disableSortBy: true,
    Filter: SelectColumnFilter,
    filter: "equals",
    Cell: ({ cell }) => {
      const { value } = cell;

      const pickEmoji = (value) => {
        let first = value[0]; // N or S
        let second = value[2]; // E or W
        const options = ["⇖", "⇗", "⇙", "⇘"];
        let num = first === "N" ? 0 : 2;
        num = second === "E" ? num + 1 : num;
        return options[num];
      };

      return (
        <div style={{ textAlign: "center", fontSize: 18 }}>
          {pickEmoji(value)}
        </div>
      );
    },
  },
];
// const columns = [
//   {
//     Header: "First Name",
//     accessor: "firstName",
//     sortable: false,
//     show: true,
//     displayValue: " First Name",
//   },
//   {
//     Header: "Status",
//     accessor: "status",
//     sortable: false,
//     show: true,
//     displayValue: "Status ",
//   },
//   {
//     Header: "Visits",
//     accessor: "visits",
//     sortable: false,
//     show: true,
//     displayValue: " Visits ",
//   },
// ];

export default columns;
