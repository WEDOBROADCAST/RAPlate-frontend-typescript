import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { Button, Card, CardBody, CardHeader, Col, Container, FormGroup, Input, Label, Row } from 'reactstrap';
import BreadCrumb from '../../Components/Common/BreadCrumb';

import { ErrorMessage, Field, Formik, Form } from 'formik';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as Yup from 'yup';
import { updatePermission, permissionDetail } from '../../helpers/api';

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  description: Yup.string().required('Description is required'),
});

declare const window: any


const PermissionEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [permissionData, setPermissionData] = useState({
    name: '',
    description: '',
  });

  const getPermission = async () => {
    const response = await permissionDetail(id);

    if (response.status === 200) {
      const data = await response.json();

      window.formik.setValues({
        name: data.permission.name,
        description: data.permission.description,
      });
    } else {
      navigate('/permission');
      toast("Data not found", { position: "top-center", hideProgressBar: true, className: 'bg-danger text-white' });
    }
  };

  useEffect(() => {
    getPermission();
  }, [id]);

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    const save = await updatePermission(id, values);

    if (save.status !== 200) {
      toast.error("Permission Validation failed", { autoClose: 3000 });
    } else {
      toast.success("Permission Updated Successfully", { autoClose: 3000 });
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
                    initialValues={permissionData}
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
                          <Label for="description">Description</Label>
                          <Field
                            type="description"
                            name="description"
                            id="description"
                            as={Input}
                          />
                          <ErrorMessage name="description" component="div" className="text-danger" />
                        </FormGroup>
                        <Button type="submit" color="primary" disabled={isSubmitting}>
                          {isSubmitting ? 'Update Permission...' : 'Update Permission'}
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

export default PermissionEdit;
