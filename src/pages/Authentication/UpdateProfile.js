import React, { useEffect, useState } from 'react';
import { Button, Card, CardBody, CardHeader, Col, Container, Input, Label, Modal, ModalBody, ModalHeader, Nav, NavItem, NavLink, Row, TabContent, TabPane } from 'reactstrap';

import BreadCrumb from '../../Components/Common/BreadCrumb';
import { Link, useNavigate, useParams } from "react-router-dom";

import { Formik, Field, ErrorMessage, useFormik, Form } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { changeProfilePhoto, disable2fa, enable2fa, getProfilePhoto, getUserSession, updateUser, updateUserPassword, userDetail, verify2fa } from '../../helpers/api';
import avatar from "../../assets/images/users/avatar-1.jpg";
import classnames from "classnames";
import Flatpickr from "react-flatpickr";
import progileBg from '../../assets/images/profile-bg.jpg';
import avatar1 from '../../assets/images/users/avatar-1.jpg';

const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
});


const validationSchemaPass = Yup.object().shape({
    old_password: Yup.string().required('Old Password is required'),
    new_password: Yup.string().required('New Password is required'),
    confirm_password: Yup.string()
        .required('Confirm Password is required')
        .oneOf([Yup.ref('new_password'), null], 'Confirm Password must match the New Password'),
});


const validationSchemaCode = Yup.object().shape({
    code: Yup.string().required('Code is required'),
});


const UpdateProfile = () => {

    const navigate = useNavigate();
    const { id } = useParams();

    const [userData, setUserData] = useState({
        name: '',
        email: '',
        secret: '',
        code: '',
        enable2fa: '',
        profile_photo: '',
        password: '',
        id: '',
    })

    const [twoFa, setTwoFa] = useState({
        code: '',
    })

    const [qrLink, setQrLink] = useState('')
    const [qrLinkIsLoaded, setQrLinkLoaded] = useState(false)


    const [userPass, setUserPass] = useState({
        old_password: '',
        new_password: '',
        confirm_password: '',
        id: '',
    })

    const [modalShowQr, setModalShowQr] = useState(false);

    function toggleShowQr() {
        setModalShowQr(!modalShowQr);
    }

    const handleEnable2fa = async () => {

        setQrLinkLoaded(false)
        setModalShowQr(true)
        const generates = await enable2fa();


        if (generates.status !== 200) {
            toast.error("Server error", { autoClose: 3000 });
        } else {
            const data = await generates.json()
            setQrLink(data.qr)
            setQrLinkLoaded(true)
        }
    }

    const handleDisable2fa = async () => {

        const disable = await disable2fa();

        if (disable.status !== 200) {
            toast.error("Server error", { autoClose: 3000 });
        }

        await getUser()
    }

    const handleSubmitCode = async (values, { setSubmitting }) => {

        const save = await verify2fa(values);

        if (save.status !== 200) {
            toast.error("Top is not valid", { autoClose: 3000 });
        } else {
            toast.success("Successfully enable  two-factor authentication", { autoClose: 3000 });
            setSubmitting(false);
            setModalShowQr(false)
            getUser()

        }
    };

    const [activeTab, setActiveTab] = useState("1");

    const tabChange = (tab) => {
        if (activeTab !== tab) setActiveTab(tab);
    };


    const getUser = async () => {
        const user = await getUserSession();

        const response = await userDetail(user.data.id);

        if (response.status === 200) {
            const data = await response.json()

            window.formik.setValues({
                name: data.user.name,
                email: data.user.email,
            });

            setUserData({
                name: data.user.email,
                id: data.user.id,
                secret: data.user.secret,
                code: data.user.code,
                enable2fa: data.user.enable2fa,
                email: data.user.email,
                profile_photo: data.user.profile_photo
            });
        }
        else {
            toast("Data not found", { position: "top-center", hideProgressBar: true, className: 'bg-danger text-white' })
        }

    };


    const handleSubmit = async (values, { setSubmitting }) => {


        const user = await getUserSession();

        const save = await updateUser(user.data.id, values);

        if (save.status !== 200) {
            toast.error("User Validation failed", { autoClose: 3000 });
        } else {
            toast.success("User Updated Successfully", { autoClose: 3000 });
            setSubmitting(false);
        }
    };


    const handleFileChange = async (event) => {
        const file = event.target.files[0];

        await changeProfilePhoto(file)
        await getUser()
    };

    const handleSubmitResetPass = async (values, { setSubmitting }) => {

        const user = await getUserSession();

        const save = await updateUserPassword(user.data.id, values);

        if (save.status !== 200) {
            toast.error("User Validation failed", { autoClose: 3000 });
        } else {
            toast.success("User Updated Successfully", { autoClose: 3000 });
            setSubmitting(false);
        }
    };

    useEffect(() => {
        getUser();
    }, [id])

    document.title = "";
    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <div className="position-relative mx-n4 mt-n4">
                        <div className="profile-wid-bg profile-setting-img">
                            <img src={progileBg} className="profile-wid-img" alt="" />
                            <div className="overlay-content">
                                <div className="text-end p-3">
                                    <div className="p-0 ms-auto rounded-circle profile-photo-edit">
                                        <Input id="profile-foreground-img-file-input" type="file"
                                            className="profile-foreground-img-file-input" />

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Row>
                        <Col xxl={3}>
                            <Card className="mt-n5">
                                <CardBody className="p-4">
                                    <div className="text-center">
                                        <div className="profile-user position-relative d-inline-block mx-auto  mb-4">
                                            <img src={getProfilePhoto(userData.profile_photo)}
                                                className="rounded-circle avatar-xl img-thumbnail user-profile-image"
                                                alt="user-profile" />
                                            <div className="avatar-xs p-0 rounded-circle profile-photo-edit">
                                                <Input onChange={handleFileChange} id="profile-img-file-input" type="file"
                                                    className="profile-img-file-input" />
                                                <Label htmlFor="profile-img-file-input"
                                                    className="profile-photo-edit avatar-xs">
                                                    <span className="avatar-title rounded-circle bg-light text-body">
                                                        <i className="ri-camera-fill"></i>
                                                    </span>
                                                </Label>
                                            </div>
                                        </div>
                                        <h5 className="fs-16 mb-1">{userData.name}</h5>
                                        <p className="text-muted mb-0">{userData.email}</p>
                                    </div>
                                </CardBody>
                            </Card>


                        </Col>

                        <Col xxl={9}>
                            <Card className="mt-xxl-n5">
                                <CardHeader>
                                    <Nav className="nav-tabs-custom rounded card-header-tabs border-bottom-0"
                                        role="tablist">
                                        <NavItem>
                                            <NavLink
                                                className={classnames({ active: activeTab === "1" })}
                                                onClick={() => {
                                                    tabChange("1");
                                                }}>
                                                <i className="fas fa-home"></i>
                                                Personal Details
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink to="#"
                                                className={classnames({ active: activeTab === "2" })}
                                                onClick={() => {
                                                    tabChange("2");
                                                }}
                                                type="button">
                                                <i className="far fa-user"></i>
                                                Change Password
                                            </NavLink>
                                        </NavItem>

                                        <NavItem>
                                            <NavLink to="#"
                                                className={classnames({ active: activeTab === "4" })}
                                                onClick={() => {
                                                    tabChange("4");
                                                }}
                                                type="button">
                                                <i className="far fa-envelope"></i>
                                                Security
                                            </NavLink>
                                        </NavItem>
                                    </Nav>
                                </CardHeader>
                                <CardBody className="p-4">
                                    <TabContent activeTab={activeTab}>
                                        <TabPane tabId="1">
                                            <Formik
                                                initialValues={userData}
                                                validationSchema={validationSchema}
                                                onSubmit={handleSubmit}
                                                innerRef={(formik) => (window.formik = formik)}
                                            >
                                                {({ isSubmitting }) => (
                                                    <Form>
                                                        <Row>
                                                            <Col lg={6}>
                                                                <div className="mb-3">
                                                                    <Label htmlFor="firstnameInput" className="form-label">First
                                                                        Name</Label>
                                                                    <Field
                                                                        type="text"
                                                                        name="name"
                                                                        id="name"
                                                                        as={Input}
                                                                    />
                                                                    <ErrorMessage name="name" component="div" className="text-danger" />
                                                                </div>
                                                            </Col>
                                                            <Col lg={6}>
                                                                <div className="mb-3">
                                                                    <Label htmlFor="lastnameInput" className="form-label">Email</Label>
                                                                    <Field
                                                                        type="email"
                                                                        name="email"
                                                                        id="email"
                                                                        as={Input}
                                                                    />
                                                                    <ErrorMessage name="email" component="div" className="text-danger" />
                                                                </div>
                                                            </Col>
                                                            <Col lg={12}>
                                                                <Button type="submit" color="primary" disabled={isSubmitting}>
                                                                    {isSubmitting ? 'Update Profile...' : 'Update Profile '}
                                                                </Button>
                                                            </Col>

                                                        </Row>
                                                    </Form>
                                                )}
                                            </Formik>
                                        </TabPane>

                                        <TabPane tabId="2">
                                            <Formik
                                                initialValues={userPass}
                                                validationSchema={validationSchemaPass}
                                                onSubmit={handleSubmitResetPass}
                                                innerRef={(formik) => (window.formikPass = formik)}
                                            >
                                                {({ isSubmitting }) => (
                                                    <Form>
                                                        <Row className="g-2">
                                                            <Col lg={4}>
                                                                <div>
                                                                    <Label htmlFor="oldpasswordInput" className="form-label">Old
                                                                        Password*</Label>
                                                                    <Field
                                                                        type="password"
                                                                        name="old_password"
                                                                        id="old_password"
                                                                        as={Input}
                                                                    />
                                                                    <ErrorMessage name="old_password" component="div" className="text-danger" />
                                                                </div>
                                                            </Col>

                                                            <Col lg={4}>
                                                                <div>
                                                                    <Label htmlFor="newpasswordInput" className="form-label">New
                                                                        Password*</Label>
                                                                    <Field
                                                                        type="password"
                                                                        name="new_password"
                                                                        id="new_password"
                                                                        as={Input}
                                                                    />
                                                                    <ErrorMessage name="new_password" component="div" className="text-danger" />
                                                                </div>
                                                            </Col>

                                                            <Col lg={4}>
                                                                <div>
                                                                    <Label htmlFor="confirmpasswordInput" className="form-label">Confirm
                                                                        Password*</Label>
                                                                    <Field
                                                                        type="password"
                                                                        name="confirm_password"
                                                                        id="confirm_password"
                                                                        as={Input}
                                                                    />
                                                                    <ErrorMessage name="confirm_password" component="div" className="text-danger" />
                                                                </div>
                                                            </Col>

                                                            <Col lg={12}>
                                                                <div className="mb-3">
                                                                    <Link to="/forgot-password"
                                                                        className="link-primary text-decoration-underline">Forgot
                                                                        Password ?</Link>
                                                                </div>
                                                            </Col>

                                                            <Col lg={12}>
                                                                <div className="text-end">

                                                                    <Button type="submit" color="success" disabled={isSubmitting}>
                                                                        {isSubmitting ? 'Change Password...' : 'Change Password '}
                                                                    </Button>
                                                                </div>
                                                            </Col>

                                                        </Row>

                                                    </Form>
                                                )}
                                            </Formik>

                                        </TabPane>


                                        <Modal
                                            isOpen={modalShowQr}
                                            toggle={() => {
                                                toggleShowQr();
                                            }}
                                            backdrop={'static'}
                                            id="staticBackdrop"
                                            centered
                                        >

                                            <ModalBody className="text-center p-5">

                                                <div className="mt-4">
                                                    <h4 className="mb-3">Scan this QR Code using your APP</h4>
                                                    <p className="text-muted mb-4"> scan the QR code bellow with two-factor authentication app on your phone.</p>

                                                </div>
                                                {qrLinkIsLoaded ?
                                                    <img src={qrLink} /> :
                                                    <div>
                                                        <lord-icon
                                                            src="https://cdn.lordicon.com/avcjklpr.json"
                                                            trigger="loop"
                                                            colors="primary:#121331,secondary:#08a88a"
                                                            style={{ width: "120px", height: "120px" }}>
                                                        </lord-icon>
                                                        <div>
                                                            Please wait loading QR..
                                                        </div>
                                                    </div>
                                                }



                                                <div className="mt-4">
                                                    <h4 className="mb-3">Enter six digits code from the application </h4>
                                                    <p className="text-muted mb-4"> after scanning the QR code, the app will display six digit code that you can enter bellow.</p>
                                                    <Formik
                                                        initialValues={twoFa}
                                                        validationSchema={validationSchemaCode}
                                                        onSubmit={handleSubmitCode}
                                                        innerRef={(formik) => (window.formikCode = formik)}
                                                    >
                                                        {({ isSubmitting }) => (
                                                            <Form>
                                                                <Field
                                                                    type="text"
                                                                    name="code"
                                                                    id="code"
                                                                    placeholder="enter 6 digit"
                                                                    as={Input}
                                                                />
                                                                <ErrorMessage name="code" component="div" className="text-danger" />

                                                                <div className="hstack gap-2 justify-content-center mt-2">
                                                                    <Link to="#" className="btn btn-link link-success fw-medium" onClick={() => setModalShowQr(false)}><i className="ri-close-line me-1 align-middle"></i> Close</Link>
                                                                    <Button type="submit" color="success" disabled={isSubmitting}>
                                                                        {isSubmitting ? 'Verify to enable...' : 'Verify to enable'}
                                                                    </Button>
                                                                </div>
                                                            </Form>
                                                        )}
                                                    </Formik>
                                                </div>
                                            </ModalBody>
                                        </Modal>


                                        <TabPane tabId="4">
                                            <div className="mb-4 pb-2">
                                                <h5 className="card-title text-decoration-underline mb-3">Security:</h5>
                                                <div className="d-flex flex-column flex-sm-row mb-4 mb-sm-0">
                                                    <div className="flex-grow-1">
                                                        <h6 className="fs-14 mb-1">Two-factor Authentication</h6>
                                                        <p className="text-muted">Two-factor authentication is an enhanced
                                                            security meansur. Once enabled, you'll be required to give
                                                            two types of identification when you log into Google
                                                            Authentication .</p>
                                                    </div>
                                                    <div className="flex-shrink-0 ms-sm-3">
                                                        {userData.enable2fa === '1' ?
                                                            <Link onClick={handleDisable2fa}
                                                                className="btn btn-sm btn-danger">Disable Two-facor
                                                                Authentication</Link> :
                                                            <Link onClick={handleEnable2fa}
                                                                className="btn btn-sm btn-primary">Enable Two-facor
                                                                Authentication</Link>}

                                                    </div>
                                                </div>

                                            </div>

                                        </TabPane>
                                    </TabContent>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment >
    );
};

export default UpdateProfile;
