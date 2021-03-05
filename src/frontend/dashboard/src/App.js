import React from "react";
import { Container } from "reactstrap";
import TableContainer from "./components/table/tableContainer";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./components/sidebar/Header";
import { Input } from "semantic-ui-react";
import columns from "./model/SampleColumnHeader";
import originalData from "./stubs/data";
import renderRowSubComponent from "./components/table/utils/renderRowSubComponent";

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
        <br />
        <Input
          size="large"
          name="searchInput"
          value={searchInput || ""}
          onChange={this.handleChange}
          label="Search"
        />
        <br />
        <Container style={{ marginTop: 100 }}>
          <TableContainer
            columns={columns}
            data={data}
            renderRowSubComponent={renderRowSubComponent}
          />
        </Container>
      </div>
    );
  }
}
