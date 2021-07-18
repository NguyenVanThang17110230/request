import React from "react";
import axios from "axios";
// react plugin for creating notifications over the dashboard
import NotificationAlert from "react-notification-alert";
import "react-toastify/dist/ReactToastify.css";
import TableRow from "components/TableRow/TableRowDoc.js";
import { Redirect } from "react-router-dom";
import TableRowSearch from "components/TableRow/TableRowSearch.js";
// reactstrap components
import {
  Card,
  CardBody,
  Row,
  Label,
  Input,
  FormGroup,
  Table,
  Col,
} from "reactstrap";
import CardHeader from "reactstrap/lib/CardHeader";
import Button from "reactstrap/lib/Button";

class Notifications extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      dataRequest: [],
    };
  }

  componentDidMount() {
    this._fetchData();
  }
  _fetchData = async () => {
    await axios
      .get("/request/not-handled",{
        headers: {
          "Content-Type": "application/json",
          Authorization: JSON.parse(localStorage.getItem("authorization")),
        },
      })
      .then((response) => {
        console.log("res", response);
        this.setState({ dataRequest: response.data });
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  //view date
  _viewCreatedDate = date =>{
  //view status
  console.log("Day",date);
  var d = new Date(date)
  console.log("date",d);
  var month = '' + (d.getMonth() + 1)
  var day = '' + d.getDate()
  var year = d.getFullYear()

  if (month.length < 2) 
      month = '0' + month;
  if (day.length < 2) 
      day = '0' + day;

    return [day,month,year].join('-');
  }
  _viewStatus = status =>{
    switch (status) {
      case 'WAIT_MANAGER':
        return "Chờ trưởng phòng duyệt"
      case 'WAIT_DIRECTOR':
        return "Chờ giám đốc duyệt"
      default:
        break;
    }
  }
  _viewDataRequest = () => {
    const { dataRequest } = this.state;
    if (dataRequest && dataRequest.length > 0) {
      return dataRequest.map((data, index) => {
        return (
          <tr key={index}>
            <td>{index+1}</td>
            <td>{data.reason}</td>
            <td>{data.solution}</td>
            <td>{this._viewCreatedDate(data.createdDate)}</td>
            <td>{this._viewStatus(data.status)}</td>
            <td>
              {/* <Button size="sm" onClick={this.delete} color="danger">
                Từ chối
              </Button>
              <Button size="sm" onClick={this.download1} color="success">
                Duyệt
              </Button> */}
            </td>
          </tr>
        );
      });
    }
  };

  render() {
    if (!localStorage.getItem("authorization")) return <Redirect to="/login" />;
    return (
      <div style={{ background: "LightCyan" }} className="content">
        <div className="react-notification-alert-container">
          <NotificationAlert ref="notificationAlert" />
        </div>
        <Row>
          <Col md="10">
            <Card className="abc">
              <CardHeader>
                <FormGroup row>
                  <Label md="4" sm={6} tag="h6">
                    Danh sách yêu cầu chỉnh sửa
                  </Label>
                </FormGroup>
              </CardHeader>
              <CardBody>
                <Table striped>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Lý Do</th>
                      <th>Nội dung đề suất</th>
                      <th>Ngày tạo</th>
                      <th>Tình Trạng</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>{this._viewDataRequest()}</tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Notifications;
