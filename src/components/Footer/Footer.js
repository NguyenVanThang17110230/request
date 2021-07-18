
import React from "react";
// used for making the prop types of this component
//import PropTypes from "prop-types";

// reactstrap components
import { Container,Nav, NavItem, NavLink } from "reactstrap";

class Footer extends React.Component {
  render() {
    return (
      <footer style={{background: 'Gainsboro'}} className="footer">
        <Container fluid>
          <Nav style={{color: 'Black'}}>
            <NavItem>
              <NavLink style={{color: 'Black'}} href="#">copy by admin page</NavLink>
            </NavItem>
           
          </Nav>
          <div  style={{color: 'Black'}} className="copyright">
            COMPANY
          </div>
        </Container>
      </footer>
    );
  }
}

export default Footer;
