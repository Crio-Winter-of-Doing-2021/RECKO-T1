import React from "react";
import { Container } from "reactstrap";
import TableContainer from "./components/table/tableContainer";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./components/sidebar/Header";
import { Input } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import columns from "./model/SampleColumnHeader";
import originalData from "./stubs/data";
// import renderRowSubComponent from "./components/table/utils/renderRowSubComponent";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: originalData,
      columns: [],
      searchInput: "",
    };
  }
  componentDidMount() {
    this.setState({ columns });
  }
  handleChange = (event) => {
    this.setState({ searchInput: event.target.value }, () => {
      this.globalSearch();
    });
  };

  //TODO : move to every column header
  globalSearch = () => {
    let { searchInput } = this.state;
    let filteredData = originalData.filter((value) => {
      return (
        value.name.title.toLowerCase().includes(searchInput.toLowerCase()) ||
        value.name.first.toLowerCase().includes(searchInput.toLowerCase()) ||
        value.name.last
          .toString()
          .toLowerCase()
          .includes(searchInput.toLowerCase())
      );
    });
    this.setState({ data: filteredData });
  };

  render() {
    let { data, columns, searchInput } = this.state;

    return (
      <div className="App">
        <Header />
        <Container style={{ marginTop: 50 }}>
          <Input
            fluid
            icon="search"
            placeholder="Search..."
            size="massive"
            name="searchInput"
            value={searchInput || ""}
            onChange={this.handleChange}
          />
          <br />
          <br />
          <TableContainer
            columns={columns}
            data={data}
            // renderRowSubComponent={renderRowSubComponent}
          />
        </Container>
      </div>
    );
  }
}
