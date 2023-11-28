import React, { useEffect, useState } from 'react';
import { Card, CardBody, Col, Container, Row, Table } from 'reactstrap';
import BreadCrumb from '../../Components/Common/BreadCrumb';
import { useNavigate, useParams } from "react-router-dom";

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { auditDetail } from '../../helpers/api';
import { AuditData } from 'models/AppModels';



const AuditView = () => {

  const navigate = useNavigate();
  const { id } = useParams();

  const [auditData, setAuditData] = useState<AuditData>({
    name: '',
    ip: '',
    event: '',
    auditable: '',
    url: '',
    old_data: [],
    new_data: [],
  })


  const [fields, setFields] = useState<string[]>([]);


  const getAudit = async () => {
    const response = await auditDetail(id);

    if (response.status === 200) {
      const data = await response.json()

      setAuditData(data.audit);

      let fieldsArr = [];

      for (const [key, value] of Object.entries(data.audit.new_data)) {
        fieldsArr.push(key);
      }
      setFields(fieldsArr);

    }
    else {
      navigate('/audit');
      toast("Data not found", { position: "top-center", hideProgressBar: true, className: 'bg-danger text-white' })
    }

  };

  useEffect(() => {
    getAudit();
  }, [id])

  document.title = "";
  return (
    <React.Fragment>

      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Audit View" pageTitle="Audit" />
          <Row>
            <Col ms={6}>
              <Card>
                <CardBody>

                  <h5 className="mb-3 fw-semibold">Auditable</h5>

                  <Table className="audit-table" hover responsive striped>

                    <thead>
                      <tr>
                        <th></th>
                        {fields.map((field) => (
                          <th key={field}>{field}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {auditData.event === 'update' && (
                        <tr>
                          <td>Old Data</td>
                          {fields.map((field) => (
                            <td key={field}>{auditData.old_data[field]}</td>
                          ))}
                        </tr>
                      )}
                      <tr>
                        <td>New Data</td>
                        {fields.map((field) => (
                          <td key={field}>{auditData.new_data[field]}</td>
                        ))}
                      </tr>
                    </tbody>
                  </Table>
                </CardBody>
              </Card>

            </Col>

            <Col lg="6">


              <Card>
                <CardBody className="position-relative">
                  <h5 className="mb-3 fw-semibold">Auditable</h5>
                  <div className="vstack gap-2">
                    <div className="form-check card-radio">
                      <label className="form-check-label" htmlFor="listGroupRadioGrid1">
                        <div className="d-flex align-items-center">
                          <div className="flex-shrink-0">
                            <div className="avatar-xs">
                              <div className="avatar-title bg-soft-success text-success fs-18 rounded">
                                <i className="ri-visa-fill"></i>
                              </div>
                            </div>
                          </div>
                          <div className="flex-grow-1 ms-3">
                            <h6 className="mb-1">Audit Table</h6>
                            <b className="pay-amount">{auditData?.auditable}</b>
                          </div>
                        </div>
                      </label>
                    </div>

                    <div className="form-check card-radio">
                      <label className="form-check-label" htmlFor="listGroupRadioGrid2">
                        <div className="d-flex align-items-center">
                          <div className="flex-shrink-0">
                            <div className="avatar-xs">
                              <div className="avatar-title bg-soft-info text-info fs-18 rounded">
                                <i className="ri-bank-card-2-line"></i>
                              </div>
                            </div>
                          </div>
                          <div className="flex-grow-1 ms-3">
                            <h6 className="mb-1">Event</h6>
                            <b className="pay-amount">{auditData?.event}</b>
                          </div>
                        </div>
                      </label>
                    </div>

                    <div className="form-check card-radio">
                      <label className="form-check-label" htmlFor="listGroupRadioGrid2">
                        <div className="d-flex align-items-center">
                          <div className="flex-shrink-0">
                            <div className="avatar-xs">
                              <div className="avatar-title bg-soft-info text-info fs-18 rounded">
                                <i className=" ri-upload-cloud-2-fill"></i>
                              </div>
                            </div>
                          </div>
                          <div className="flex-grow-1 ms-3">
                            <h6 className="mb-1">IP</h6>
                            <b className="pay-amount">{auditData?.ip}</b>
                          </div>
                        </div>
                      </label>
                    </div>

                    <div className="form-check card-radio">
                      <label className="form-check-label" htmlFor="listGroupRadioGrid2">
                        <div className="d-flex align-items-center">
                          <div className="flex-shrink-0">
                            <div className="avatar-xs">
                              <div className="avatar-title bg-soft-info text-info fs-18 rounded">
                                <i className="ri-links-line"></i>
                              </div>
                            </div>
                          </div>
                          <div className="flex-grow-1 ms-3">
                            <h6 className="mb-1">URL</h6>
                            <b className="pay-amount">{auditData?.url}</b>
                          </div>
                        </div>
                      </label>
                    </div>


                    <div className="form-check card-radio">
                      <label className="form-check-label" htmlFor="listGroupRadioGrid2">
                        <div className="d-flex align-items-center">
                          <div className="flex-shrink-0">
                            <div className="avatar-xs">
                              <div className="avatar-title bg-soft-info text-info fs-18 rounded">
                                <i className="ri-map-pin-user-fill"></i>
                              </div>
                            </div>
                          </div>
                          <div className="flex-grow-1 ms-3">
                            <h6 className="mb-1">Action By</h6>
                            <b className="pay-amount">{auditData?.user?.name}</b>
                          </div>
                        </div>
                      </label>
                    </div>

                  </div>

                </CardBody>
              </Card>
            </Col>
          </Row>

        </Container>
      </div>
    </React.Fragment>
  );
};

export default AuditView;
