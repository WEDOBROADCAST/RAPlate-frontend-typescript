import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Alert, Card, CardBody, Col, Container, Row, Form, Label, Input, FormFeedback } from 'reactstrap';
import logoLight from "../../assets/images/logo-light.png";

//formik
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import { verify2fa } from '../../helpers/api';
import ParticlesAuth from '../AuthenticationInner/ParticlesAuth';

const Twofa = () => {
    document.title = "Authentication";

    const navigate = useNavigate()

    const validation = useFormik({
        enableReinitialize: true,

        initialValues: {
            code: "",
        },
        validationSchema: Yup.object({
            code: Yup.string().required("Please Enter Your Code"),
        }),
        onSubmit: async (values) => {
            const save = await verify2fa(values);

            if (save.status !== 200) {
                toast.error("Top is not valid", { autoClose: 3000 });
            } else {
                sessionStorage.setItem('twofa', '0')
                toast.success("Verification complete", { autoClose: 3000 });
                navigate('/dashboard')
            }

        }
    });

    return (
        <ParticlesAuth>
            <ToastContainer />
            <div className="auth-page-content">
                <Container>
                    <Row>
                        <Col lg={12}>
                            <div className="text-center mt-sm-5 mb-4 text-white-50">
                                <div>
                                    <Link to="/#" className="d-inline-block auth-logo">
                                        <img src={logoLight} alt="" height="20" />
                                    </Link>
                                </div>
                            </div>
                        </Col>
                    </Row>

                    <Row className="justify-content-center">
                        <Col md={8} lg={6} xl={5}>
                            <Card className="mt-4">
                                <CardBody className="p-4">
                                    <div className="text-center mt-2">
                                        <h5 className="text-primary">Enter six digits code from the application </h5>
                                        <p className="text-muted"> open your authenticator app and fill the code bellow</p>
                                        {/* 
                                        <lord-icon
                                            src="https://cdn.lordicon.com/avcjklpr.json"
                                            trigger="loop"
                                            colors="primary:#0ab39c"
                                            className="avatar-xl"
                                            style={{ width: "120px", height: "120px" }}>
                                        </lord-icon> */}
                                    </div>

                                    <div className="p-2">
                                        <Form onSubmit={validation.handleSubmit}>
                                            <div className="mb-4">
                                                <Label className="form-label">Code</Label>
                                                <Input
                                                    type="text"
                                                    className="form-control"
                                                    id="code"
                                                    placeholder="Enter Code"
                                                    name="code"
                                                    value={validation.values.code}
                                                    onBlur={validation.handleBlur}
                                                    onChange={validation.handleChange}
                                                    invalid={validation.errors.code && validation.touched.code ? true : false}
                                                />
                                                {validation.errors.code && validation.touched.code ? (
                                                    <FormFeedback type="invalid">{validation.errors.code}</FormFeedback>
                                                ) : null}
                                            </div>

                                            <div className="text-center mt-4">
                                                <button className="btn btn-success w-100" type="submit">Verify</button>
                                            </div>
                                        </Form>
                                    </div>
                                </CardBody>
                            </Card>

                        </Col>
                    </Row>
                </Container>
            </div>
        </ParticlesAuth>
    );
};

export default Twofa;