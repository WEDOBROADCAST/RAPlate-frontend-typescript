import React, { useEffect, useState } from 'react';
import { Card, CardBody, CardHeader, Col, Container, Row, Input, Button, FormGroup, Label } from 'reactstrap';
import BreadCrumb from '../../Components/Common/BreadCrumb';
import { useNavigate, useParams } from "react-router-dom";

import { Formik, Form, Field, ErrorMessage, useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { updatePermission, permissionDetail } from '../../helpers/api';
import avatar from "../../assets/images/users/avatar-1.jpg";



const PermissionView = () => {

  const navigate = useNavigate();
  const { id } = useParams();

  const [permissionData, setPermissionData] = useState({
    name: '',
    description: '',
    id: '',
  })

  const getPermission = async () => {
    const response = await permissionDetail(id);

    if (response.status === 200) {
      const data = await response.json()

      setPermissionData({
        name: data.permission.description,
        id: data.permission.id,
        description: data.permission.description
      });
    }
    else {
      navigate('/permission');
      toast("Data not found", { position: "top-center", hideProgressBar: true, className: 'bg-danger text-white' })
    }

  };

  useEffect(() => {
    getPermission();
  }, [id])

  document.title = "";
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Row>
            <Col lg="12">

              <Card>
                <CardBody>
                  <div className="d-flex">

                    <div className="flex-grow-1 align-self-center">
                      <div className="text-muted">
                        <h5>{permissionData.name}</h5>
                        <p className="mb-1">Description : {permissionData.description}</p>
                        <p className="mb-0">Id No : #{permissionData.id}</p>
                      </div>
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

export default PermissionView;
