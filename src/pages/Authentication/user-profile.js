import React, { useEffect, useState } from 'react';
import { Button, Card, CardBody, CardHeader, Col, Container, Input, Label, Nav, NavItem, NavLink, Row, TabContent, TabPane } from 'reactstrap';

import BreadCrumb from '../../Components/Common/BreadCrumb';
import { Link, useNavigate, useParams } from "react-router-dom";

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getProfilePhoto, getUserSession, updateUser, updateUserPassword, userDetail } from '../../helpers/api';
import progileBg from '../../assets/images/profile-bg.jpg';
import avatar1 from '../../assets/images/users/avatar-1.jpg';



const UpdateProfile = () => {

  const navigate = useNavigate();
  const { id } = useParams();

  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    profile_photo: '',
    id: '',
  })



  const getUser = async () => {
    const user = await getUserSession();

    const response = await userDetail(user.data.id);

    if (response.status === 200) {
      const data = await response.json()

      setUserData({
        name: data.user.email,
        id: data.user.id,
        profile_photo: data.user.profile_photo,
        email: data.user.email
      });
    }
    else {
      toast("Data not found", { position: "top-center", hideProgressBar: true, className: 'bg-danger text-white' })
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
                        <Input id="profile-img-file-input" type="file"
                          className="profile-img-file-input" />

                      </div>
                    </div>
                    <h5 className="fs-16 mb-1">{userData.name}</h5>
                    <p className="text-muted mb-0">{userData.email}</p>

                    <Link to={`/profile/update`} className="btn btn-success mt-3">Update Profile</Link>
                  </div>
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
