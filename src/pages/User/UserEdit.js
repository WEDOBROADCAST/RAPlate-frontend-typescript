import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { Button, Card, CardBody, CardHeader, Col, Container, FormGroup, Input, Label, Row } from 'reactstrap';
import BreadCrumb from '../../Components/Common/BreadCrumb';

import { ErrorMessage, Field, Formik, Form } from 'formik';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as Yup from 'yup';
import { listRole, updateUser, userDetail } from '../../helpers/api';
import Select from "react-select";


const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string(),
});


const UserEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const userData = {
    name: '',
    email: '',
    password: '',
    role: '',
  };


  const [roleList, setRole] = useState([
  ]);

  const getRoles = async () => {
    const response = await listRole(1)
    const role = await response.json()

    if (response.status === 200) {

      console.log(role.data)
      const mapping = role.data.map((role) => {
        return {
          label: role.name,
          value: role.id,
        }
      });
      console.log(mapping)
      setRole(mapping)
    }
  }


  const getUser = async () => {
    const response = await userDetail(id);

    if (response.status === 200) {
      const data = await response.json();

      const currentRole = data.user.roles[0] ?? false

      window.formik.setValues({
        name: data.user.name,
        email: data.user.email,
        password: '',
        role: currentRole ? { label: currentRole.name, value: currentRole.id } : ''
      });
    } else {
      navigate('/user');
      toast("Data not found", { position: "top-center", hideProgressBar: true, className: 'bg-danger text-white' });
    }
  };

  useEffect(() => {
    getUser();
    getRoles()
  }, [id]);

  const handleSubmit = async (values, { setSubmitting }) => {
    values.role = values.role.value
    const save = await updateUser(id, values);

    if (save.status !== 200) {
      toast.error("User Validation failed", { autoClose: 3000 });
    } else {
      toast.success("User Updated Successfully", { autoClose: 3000 });
      setSubmitting(false);
      navigate('/user');
    }
  };

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
                    initialValues={userData}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                    innerRef={(formik) => (window.formik = formik)}
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
                          />
                          <ErrorMessage name="name" component="div" className="text-danger" />
                        </FormGroup>
                        <FormGroup>
                          <Label for="email">Email</Label>
                          <Field
                            type="email"
                            name="email"
                            id="email"
                            as={Input}
                          />
                          <ErrorMessage name="email" component="div" className="text-danger" />
                        </FormGroup>

                        <FormGroup>
                          <Label for="email">Role</Label>
                          <Field
                            name="role"
                            component={({ field, form }) => (
                              <Select
                                {...field}
                                options={roleList}
                                onChange={option => form.setFieldValue(field.name, option)}
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
                          />
                          <ErrorMessage name="password" component="div" className="text-danger" />
                        </FormGroup>
                        <Button type="submit" color="primary" disabled={isSubmitting}>
                          {isSubmitting ? 'Update User...' : 'Update User'}
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

export default UserEdit;
