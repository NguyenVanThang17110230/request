import React, { Component } from 'react';
import axios from "axios";
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Table,
  Row,
  Col,
  Input,
  FormGroup,
  Button,
  Label,
} from "reactstrap";
// reactstrap components
//import { Card, CardHeader, CardBody, Row, Col } from "reactstrap";
import TableDepartment from "components/TableRow/TableDepartment.js";
import { ToastContainer, toast } from "react-toastify";
import { Redirect } from "react-router-dom";
class Department extends Component {
    constructor(props) {
        super(props);
        this.onChangeValue = this.onChangeValue.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onSubmitEdit = this.onSubmitEdit.bind(this);
        // this.onSelectValue = this.onSelectValue.bind(this);
        // this.onSubmitEdit = this.onSubmitEdit.bind(this);
        // this.onChangeNewName= this.onChangeNewName.bind(this);
        // this.onSubmitEditUser=this.onSubmitEditUser.bind(this);
        this.state = {
          code:'',
          name:'',
          newcode:'',
          newname:'',
          data: [],
          dataedituser: [],
          trangthai: false,
          trangthaiedit: false,
          trangthailist: true,
        };
      }
    render() {
        return (
            <div style={{background: 'LightCyan'}} className="content">
                <Row>
                    
                    {this._hienThiForm()}
                    {this._hienThiList()}
                    {this._hienThiFormEdit()}
                </Row>
                <ToastContainer />
            </div>
        );
    }

    // check nut
    checkNut() {
        if (this.state.trangthai === false) {
          return (
            <Button onClick={() => this.thayTrangThai()} size="sm" md="2">
              +
            </Button>
          );
        } else {
          return (
            <Button onClick={() => this.thayTrangThai()} size="sm" md="2">
              -
            </Button>
          );
        }
    }
    thayTrangThai = () => {
        this.setState({
          trangthai: !this.state.trangthai,
          trangthailist: !this.state.trangthailist
        });
    }
    thayTrangThaiEdit() {
        this.setState({
            trangthailist:!this.state.trangthailist,
            trangthaiedit:!this.state.trangthaiedit
        })
    }
    thayDoiTrangThaiEdit(){
        this.setState({
          trangthaiedit: !this.state.trangthaiedit,
          trangthailist: !this.state.trangthailist
        });
    }
    //view form add
    _hienThiForm() {
        if (this.state.trangthai === true) {
          return (
            <Col md={4}>
                <Card className="abc">
                    <CardHeader>
                        <CardTitle>
                            <Label tag="h4">Create Department</Label>
                        </CardTitle>
                    </CardHeader>
                    <CardBody>
                        <FormGroup row>
                            <Label sm={3}>Code</Label>
                            <Col sm={9}>
                            <Input
                                onChange={this.onChangeValue}
                                type="text"
                                name="code"
                                id=""
                                placeholder="Input firstname"
                            />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label sm={3}>Name</Label>
                            <Col sm={9}>
                            <Input
                                onChange={this.onChangeValue}
                                type="text"
                                name="name"
                                id=""
                                placeholder="Input firstname"
                            />
                            </Col>
                        </FormGroup>
                        <Button onClick={this.onSubmit} color="primary">
                            Add Department
                        </Button>
                        <Button onClick={() => this.thayTrangThai()}>Cancel</Button>
                    </CardBody>
                </Card>
            </Col>
              
        );
    }
   
    }
    _hienThiList() {
        if(this.state.trangthailist === true){
            return(
                <Col md={6}>
                    <Card className="abc">
                      <CardHeader>
                        <FormGroup row>
                          <Label md="10" tag="h6">
                            List Department
                          </Label>
                          {this.checkNut()}
                        </FormGroup>
                      </CardHeader>
                      <CardBody>
                        <Table className="tablesorter" striped>
                          <thead className="text-primary">
                            <tr>
                              <th>Code</th>
                              <th>Name</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>{this.tabUser()}</tbody>
                        </Table>
                      </CardBody>
                    </Card>
                </Col>
            );
        }
    }
    _hienThiFormEdit(){
        if(this.state.trangthaiedit === true){
            return(
                <Col md={4}>
                <Card className="abc">
                    <CardHeader>
                        <CardTitle>
                            <Label tag="h4">Edit Department</Label>
                        </CardTitle>
                    </CardHeader>
                    <CardBody>
                        <FormGroup row>
                            <Label sm={3}>Code</Label>
                            <Col sm={9}>
                            <Input
                                onChange={this.onChangeValue}
                                defaultValue={this.state.dataedituser.code}
                                type="text"
                                name="newcode"
                                id=""
                                placeholder="Input code"
                                disabled
                            />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label sm={3}>Name</Label>
                            <Col sm={9}>
                            <Input
                                onChange={this.onChangeValue}
                                defaultValue={this.state.dataedituser.name}
                                type="text"
                                name="newname"
                                id=""
                                placeholder="Input name"
                            />
                            </Col>
                        </FormGroup>
                        <Button onClick={this.onSubmitEdit} color="primary">
                            Save
                        </Button>
                        <Button onClick={() => this.thayTrangThaiEdit()}>Cancel</Button>
                    </CardBody>
                </Card>
            </Col>
            );
        }
    }    // change
    onChangeValue(event) {
        var name = event.target.name;
        var value = event.target.value;
        this.setState({
          [name]: value,
        });
    }
    onClickEdit = (department) => {
        console.log("ket noi ok");
        console.log(department);
        this.setState({
          dataedituser: department,
        });
      };
    //load data
    tabUser = () =>
    this.state.data.map((object, i) => (
      <TableDepartment
        onView={() => this.onClickEdit(object)}
        obj={object}
        key={i}
        // onChangeTT={() => this.thayDoiTrangThaiEdit()}
        onCHangeEdit={() => this.thayDoiTrangThaiEdit()}
      />
    ));
    //onSubmit
    onSubmit(event) {
        event.preventDefault();
        if(
          this.state.code!==''&&
          this.state.name!==''
        )
        {
          const formData = {
            code:this.state.code,
            name:this.state.name
          };
      
          console.log(formData);
          axios
            .post("/department", formData)
            .then((res) => {
              console.log(res);
              if (res.status === 200) {
                toast.success("Add department success");
                this.setState({
                    data:[...this.state.data,formData]
                })
              }
              else
              {
                toast.error(`${res.statusText}`);
              }
              
            })
            .catch((err) => {
              toast.error(`${err.statusText}`);
            });
        }
        else
        {
          alert('please fill out all information');
        }
        
    }
    componentDidMount() {
        axios
        .get("/department")
        .then((response) => {
            this.setState({ data: response.data});
        })
        .catch(function (error) {
            console.log(error);
        });
    }
    onSubmitEdit(event){
        console.log(this.state.dataedituser.code);
        event.preventDefault();
        const data ={
            name:''
        }
        if(this.state.newname!==null){
            data.name = this.state.newname
        }
        else{
            data.name = this.state.dataedituser.name
        }
        axios
        .put("/department/"+this.state.dataedituser.code,data)
        .then((response) => {
            if(response.status===200)
            {
                toast.success('Edit department success')
                this.componentDidMount();
            }
            else{
                toast.error(`${response.statusText}`)
            }
        })
        
    }
}

export default Department;