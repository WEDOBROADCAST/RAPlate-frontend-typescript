import React from "react";
import { Card, CardBody, Col, Container, Row } from "reactstrap";
import { Link } from "react-router-dom";
import illustarator from "../../assets/images/user-illustarator-2.png";
import config from "../../config";


const DashboardEcommerce = () => {
  document.title = "Dashboard ";
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Row>

            <Col>
              <Card>
                <CardBody className="p-0">
                  <Row>
                    <Col xl={12} md={12}>

                      <Row className="align-items-end">
                        <Col sm={10}>
                          <div className="p-3">
                            <div className="d-flex align-items-lg-center flex-lg-row flex-column">
                              <div className="flex-grow-1">
                                <h4 className="fs-16 mb-1">Hello wellcome back to, {config.app.name}</h4>
                              </div>

                            </div>
                            <div className="mt-3">
                              <Link to="/profile" className="btn btn-success">My Profile!</Link>
                            </div>
                          </div>
                        </Col>
                        <Col sm={2}>
                          <div className="px-3">
                            <img src={illustarator} className="img-fluid" alt="" style={{ width: "150px", float: "right" }} />
                          </div>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default DashboardEcommerce;
