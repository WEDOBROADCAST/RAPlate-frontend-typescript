import React, { useEffect, useState } from 'react';
import { Card, CardBody, Col, Container, Row } from 'reactstrap';
import { useNavigate, useParams } from "react-router-dom";

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getProfilePhoto, userDetail } from '../../helpers/api';



const UserEdit = () => {

  const navigate = useNavigate();
  const { id } = useParams();


  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    id: '',
    profile_photo: '',

  })

  const getUser = async () => {
    const response = await userDetail(id);

    if (response.status === 200) {
      const data = await response.json()

      setUserData({
        name: data.user.email,
        id: data.user.id,
        email: data.user.email,
        profile_photo: data.user.profile_photo,
        password: ''
      });
    }
    else {
      navigate('/user');
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
          <Row>
            <Col lg="12">

              <Card>
                <CardBody>
                  <div className="d-flex">
                    <div className="mx-3">
                      <img
                        src={getProfilePhoto(userData.profile_photo)}
                        alt=""
                        className="avatar-md rounded-circle img-thumbnail"
                      />
                    </div>
                    <div className="flex-grow-1 align-self-center">
                      <div className="text-muted">
                        <h5>{userData.name || "Admin"}</h5>
                        <p className="mb-1">Email Id : {userData.email}</p>
                        <p className="mb-0">Id No : #{userData.id}</p>
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

export default UserEdit;
