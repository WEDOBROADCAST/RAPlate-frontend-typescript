import React, { useEffect, useState } from 'react';
import { Card, CardBody, CardHeader, Col, Container, Row, Input, Button, FormGroup, Label } from 'reactstrap';
import BreadCrumb from '../../Components/Common/BreadCrumb';
import { useNavigate } from "react-router-dom";

import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createPermission } from '../../helpers/api';


const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  description: Yup.string().required('Description is required'),
});

const PermissionAdd = () => {

  const navigate = useNavigate();
  const initialValues = {
    name: '',
    description: '',
  };

  const handleSubmit = async (values: any, { setSubmitting, resetForm }: any) => {
    const save = await createPermission(values);
    if (save.status != 200) {
      toast.error("Validation failed", { autoClose: 3000 })
    } else {
      toast.success("Permission Created Successfully", { autoClose: 3000 });

      resetForm();
      setSubmitting(false);
      navigate('/permission');
    }

  };

  document.title = "";
  return (
    <React.Fragment>
      <ToastContainer />

      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Permission Add" pageTitle="Permission" />
          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader>
                  <h5 className="card-title mb-0">Permission Add</h5>
                </CardHeader>
                <CardBody>
                  <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                  >
                    {({ isSubmitting }) => (
                      <Form>
                        <FormGroup>
                          <Label for="name">Name</Label>
                          <Field
                            type="text"
                            name="name"
                            id="name"
                            as={Input}
                            invalid={!!(isSubmitting && <ErrorMessage name="name" />)}
                          />
                          <ErrorMessage name="name">
                            {(msg) => <div className="text-danger">{msg}</div>}
                          </ErrorMessage>
                        </FormGroup>
                        <FormGroup>
                          <Label for="description">Description</Label>
                          <Field
                            type="input"
                            name="description"
                            id="description"
                            as={Input}
                            invalid={!!(isSubmitting && <ErrorMessage name="description" />)}
                          />
                          <ErrorMessage name="description">
                            {(msg) => <div className="text-danger">{msg}</div>}
                          </ErrorMessage>
                        </FormGroup>
                        <Button type="submit" color="primary" disabled={isSubmitting}>
                          {isSubmitting ? 'Creating Permission...' : 'Create Permission'}
                        </Button>
                      </Form>
                    )}
                  </Formik>

                </CardBody>
              </Card>
            </Col>
          </Row>

        </Container>
      </div>
    </React.Fragment>
  );
};

export default PermissionAdd;
