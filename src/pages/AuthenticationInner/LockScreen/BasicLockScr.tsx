import React, { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Button, Card, CardBody, Col, Container, FormFeedback, Input, Row } from 'reactstrap';
import ParticlesAuth from "../ParticlesAuth";

//import images
import logoLight from "../../../assets/images/logo-light.png";
import avatar1 from "../../../assets/images/users/avatar-1.jpg";
import { ToastContainer, toast } from 'react-toastify';
import { getUserSession, sign } from '../../../helpers/api';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import { useNavigate } from 'react-router-dom'; // Assuming you're using React Router
import { UserData } from 'models/AppModels';


const BasicLockScreen = () => {

    const navigate = useNavigate();

    const [userData, setUserData] = useState<UserData>({
        name: '',
        email: '',
        password: '',
        id: 0,
    })

    const getUser = async () => {
        const user = await getUserSession();

        setUserData({
            name: user.data.email,
            id: user.data.id,
            email: user.data.email
        });

        sessionStorage.setItem("lockscreen", "1");

    };

    const validation = useFormik({
        enableReinitialize: true,

        initialValues: {
            password: "",
        },
        validationSchema: Yup.object({
            password: Yup.string().required("Please Enter Your Password"),
        }),
        onSubmit: async (values) => {

            const response = await sign({ email: userData.email, password: values.password });

            const res = await response.json();
            if (response.status === 200) {
                toast.success(res.message, { autoClose: 3000 });
                sessionStorage.setItem("lockscreen", "0");

                return navigate('/dashboard')

            } else {
                toast.error(res.message, { autoClose: 3000 });
            }

        }
    });

    useEffect(() => {
        getUser();
    }, [])

    document.title = "Lock Screen | React Dashboard Titlte";
    return (
        <React.Fragment>
            <ToastContainer />
            <div className="auth-page-content">
                <div className="auth-page-wrapper">
                    <ParticlesAuth>
                        <div className="auth-page-content">
                            <Container>
                                <Row>
                                    <Col lg={12}>
                                        <div className="text-center mt-sm-5 mb-4 text-white-50">
                                            <div>
                                                <Link to="/dashboard" className="d-inline-block auth-logo">
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
                                                    <h5 className="text-primary">Lock Screen</h5>
                                                    <p className="text-muted">Enter your password to unlock the screen!</p>
                                                </div>
                                                <div className="user-thumb text-center">
                                                    <img src={avatar1} className="rounded-circle img-thumbnail avatar-lg" alt="thumbnail" />
                                                    <h5 className="font-size-15 mt-3">{userData.name}</h5>
                                                </div>
                                                <div className="p-2 mt-4">
                                                    <form onSubmit={validation.handleSubmit}>
                                                        <div className="mb-3">
                                                            <label className="form-label" htmlFor="userpassword">Password</label>
                                                            <Input
                                                                type="password"
                                                                className="form-control"
                                                                id="password"
                                                                placeholder="Enter Password"
                                                                name="password"
                                                                value={validation.values.password}
                                                                onBlur={validation.handleBlur}
                                                                onChange={validation.handleChange}
                                                                invalid={validation.errors.password && validation.touched.password ? true : false}
                                                            />
                                                            {validation.errors.password && validation.touched.password ? (
                                                                <FormFeedback type="invalid">{validation.errors.password}</FormFeedback>
                                                            ) : null}
                                                        </div>
                                                        <div className="mb-2 mt-4">
                                                            <Button color="success" className="w-100" type="submit">Unlock</Button>
                                                        </div>
                                                    </form>
                                                </div>
                                            </CardBody>
                                        </Card>
                                        <div className="mt-4 text-center">
                                            <p className="mb-0">Not you ? return <Link to="/sign" className="fw-semibold text-primary text-decoration-underline"> Signin </Link> </p>
                                        </div>
                                    </Col>
                                </Row>
                            </Container>
                        </div>
                    </ParticlesAuth>
                </div>
            </div>
        </React.Fragment>
    );
};

export default BasicLockScreen;