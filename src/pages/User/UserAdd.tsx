import React, { useEffect, useState } from 'react';
import { Card, CardBody, CardHeader, Col, Container, Row, Input, Button, FormGroup, Label } from 'reactstrap';
import BreadCrumb from '../../Components/Common/BreadCrumb';
import { useNavigate } from "react-router-dom";

import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createUser, listRole } from '../../helpers/api';

import Select from "react-select";

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

interface UserData {
  name: string,
  email: string,
  password?: string,
  id?: number | string,
}

const UserAdd = () => {

  const navigate = useNavigate();
  const initialValues: UserData = {
    name: '',
    email: '',
    password: '',
  };


  const [roleList, setRole] = useState([
  ]);

  const getRoles = async () => {
    const response = await listRole(1)
    const role = await response.json()

    if (response.status === 200) {
      const mapping = role.data.map((role: any) => {
        return {
          label: role.name,
          value: role.id,
        }
      });
      setRole(mapping)
    }
  }



  const handleSubmit = async (values: any, { setSubmitting, resetForm }: any) => {
    values.role = values.role.value

    const save = await createUser(values);
    if (save.status != 200) {
      toast("Validation failed", { position: "top-center", hideProgressBar: true, className: 'bg-danger text-white' })

    } else {
      toast.success("User Created Successfully", { autoClose: 3000 });

      resetForm();
      setSubmitting(false);
      navigate('/user');
    }

  };


  useEffect(() => {
    getRoles()
  }, []);

  document.title = "";
  return (
    <React.Fragment>
      <ToastContainer />

      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="User Add" pageTitle="User" />
          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader>
                  <h5 className="card-title mb-0">User Add</h5>
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
                          <Label for="email">Email</Label>
                          <Field
                            type="email"
                            name="email"
                            id="email"
                            as={Input}
                            invalid={!!(isSubmitting && <ErrorMessage name="email" />)}
                          />
                          <ErrorMessage name="email">
                            {(msg) => <div className="text-danger">{msg}</div>}
                          </ErrorMessage>
                        </FormGroup>

                        <FormGroup>
                          <Label for="email">Role</Label>
                          <Field
                            name="role"
                            component={({ field, form }: any) => (
                              <Select
                                {...field}
                                options={roleList}
                                onChange={(option: any) => form.setFieldValue(field.name, option)}
                              />
                            )}
                          />
                          <ErrorMessage name="email" component="div" className="text-danger" />
                        </FormGroup>

                        <FormGroup>
                          <Label for="password">Password</Label>
                          <Field
                            type="password"
                            name="password"
                            id="password"
                            as={Input}
                            invalid={!!(isSubmitting && <ErrorMessage name="password" />)}
                          />
                          <ErrorMessage name="password">
                            {(msg) => <div className="text-danger">{msg}</div>}
                          </ErrorMessage>
                        </FormGroup>
                        <Button type="submit" color="primary" disabled={isSubmitting}>
                          {isSubmitting ? 'Creating User...' : 'Create User'}
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

export default UserAdd;
