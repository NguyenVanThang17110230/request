import React, { Component } from "react";
import axios from "axios";
import {
  CardTitle,
  CardText,
  Row,
  CardHeader,
  CardBody,
  Col,
  Card,
} from "reactstrap";
import Form from "views/form.js";
import history from "history.js";
class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: "",
      token: "",
      datauserload: [],
      redirect: localStorage.getItem("authorization") ? true : false,
    };

    this.onSubmitHandler = this.onSubmitHandler.bind(this);
    this.emailInputChangeHandler = this.emailInputChangeHandler.bind(this);
    this.passwordInputChangeHandler =
      this.passwordInputChangeHandler.bind(this);
  }

  onSubmitHandler() {
    if (!(this.state.email === "" || this.state.password === "")) {
      axios
        .post("/login", {
          username: this.state.username,
          password: this.state.password,
        })
        .then((res) => {
          console.log("res", res);
          if (res.status === 200) {
            console.log(res.data);
            localStorage.setItem(
              "authorization",
              JSON.stringify(res.headers.authorization)
            );
            localStorage.setItem("user",JSON.stringify(res.data.account.roles))
            localStorage.setItem("code",JSON.stringify(res.data.accountCode))
            this.setState({
              redirect: true,
              datauserload: res.data.account,
            });
            if (res.data.account.roles === "EMPLOYEE") {
              history.push("/user/suchua");
            } else if (res.data.account.roles === "MANAGER") {
              history.push("/manager");
            } else if (res.data.account.roles === "TCHC") {
              history.push("/tchc");
            } else if (res.data.account.roles === "DIRECTOR") {
              history.push("/director");
            }
          } else {
            alert("sai pass rồi hoac tài khoản rồi !!!");
          }
        })
        .catch((err) => {
          console.log("lỗi", err.response);
        });
    } else {
      alert("Hãy nhâp đầy đủ tài khoản và mật khẩu!!");
    }
    // history.push("/user/test");
  }

  emailInputChangeHandler(event) {
    this.setState({
      username: event.target.value,
    });
  }

  passwordInputChangeHandler(event) {
    this.setState({
      password: event.target.value,
    });
  }

  render() {
    return (
      <div className="content">
        <Row className="center-box re">
          <Col md="4">
            <Card className="card-user">
              <CardHeader>
                <Col className="ml-auto mr-auto text-center" md="6">
                  <CardTitle tag="h3">Hello Everyone!</CardTitle>
                </Col>
              </CardHeader>
              <CardBody>
                <Form onSubmit={this.onSubmitHandler.bind(this)}>
                  <div className="form-group">
                    <label htmlFor="email" className="text-info">
                      Email:
                    </label>
                    <br />
                    <input
                      id=""
                      className="form-control"
                      type="text"
                      name="username"
                      placeholder="example@domain.com"
                      onChange={this.emailInputChangeHandler}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="password" className="text-info">
                      Password:
                    </label>
                    <br />
                    <input
                      id=""
                      className="form-control"
                      type="password"
                      name="password"
                      placeholder="********"
                      onChange={this.passwordInputChangeHandler}
                      required
                    />
                  </div>
                  <div className="d-flex justify-content-between align-items-end">
                    <button
                      onClick={this.onSubmitHandler}
                      className="btn btn-info btn-md"
                      type="button"
                    >
                      Login
                    </button>
                  </div>
                </Form>
              </CardBody>
            </Card>
            <Card></Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Login;
