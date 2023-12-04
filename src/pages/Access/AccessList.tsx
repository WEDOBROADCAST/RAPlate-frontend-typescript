import React, { useEffect, useState } from 'react';
import { Card, CardBody, Col, Container, Row, Input, Label, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import { useNavigate, useParams } from "react-router-dom";

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { listRole, permissionGroupping, permissionRole, permissionRoleUpdate } from '../../helpers/api';

import classnames from "classnames";
import BreadCrumb from '../../Components/Common/BreadCrumb';



const AccessList = () => {

  interface PermissionData {
    id: string,
    name: string
  }

  const [permissionData, setPermissionData] = useState<any[string]>([])
  const [permissionDataIds, setPermissionDataIds] = useState([])
  const [activeRole, setActiveRole] = useState<number>(2)
  const [permissionRoleData, setPermissionRole] = useState<any[string]>([])

  const [cardHeaderTab, setcardHeaderTab] = useState(activeRole);
  const cardHeaderToggle = (id: any) => {
    if (cardHeaderTab !== id) {
      setcardHeaderTab(id);
      getPermissionRole(id)
      setActiveRole(id)
      setCheckAll(false)
    }
  };

  const [checkAll, setCheckAll] = useState(false)

  const checkAllAction = async () => {

    permissionDataIds.map((item) => {
      permissionRoleData[item] = !checkAll
    })

    setCheckAll(!checkAll)
    savePermissionRole()
  }


  const searchPermission = async (key: string | EventTarget) => {

    const permission = await permissionGroupping(key)

    if (permission.status === 200) {
      const data = await permission.json()

      const permissionData = data.pmsids

      setPermissionData(data.permissions)
      setPermissionDataIds(permissionData)
    }
  }

  const savePermissionRole = async () => {
    const permission = await permissionRoleUpdate(activeRole, permissionRoleData)

    if (permission.status === 200) {
      const data = await permission.json()

      setPermissionRole(data.permissions)
    } else {
      toast("Server error", { position: "top-center", hideProgressBar: true, className: 'bg-danger text-white' })
    }

  }

  const toggleAccessRole = (id: string | number) => {

    if (typeof permissionRoleData[id] === 'undefined') {
      permissionRoleData[id] = true
    } else {
      permissionRoleData[id] = !permissionRoleData[id]
    }
    savePermissionRole()
  }

  const navigate = useNavigate();
  const { id } = useParams();

  const [roleData, setRoleData] = useState([{
    id: '',
    name: 'admin',
  }])


  const getAccess = async () => {
    const response = await listRole();

    if (response.status === 200) {
      const data = await response.json()
      const roles = data.data.filter((data: { slug: string; }) => {
        return data.slug != 'admin'
      })
      setRoleData(roles);
    }
    else {
      toast("Server error", { position: "top-center", hideProgressBar: true, className: 'bg-danger text-white' })
    }

    searchPermission('')

  };

  const getPermissionRole = async (id: number) => {

    const permissionRoles = await permissionRole(id)

    if (permissionRoles.status === 200) {
      const data = await permissionRoles.json()
      console.log(data)
      setPermissionRole(data.permissions)
    } else {
      toast("Server error", { position: "top-center", hideProgressBar: true, className: 'bg-danger text-white' })
    }
  }

  useEffect(() => {
    getAccess();
    getPermissionRole(activeRole)


  }, [id, activeRole])

  document.title = "";
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Access" pageTitle="Role" />

          <Row>
            <Col lg="12">

              <Col xxl={6}>
                <Card>
                  <div className="card-header align-items-center d-flex">
                    <div className="flex-grow-1 oveflow-hidden">
                      <div className="search-box me-2 mb-2 d-inline-block">
                        <input onKeyUp={(e) => { searchPermission((e.target as HTMLInputElement).value) }} id="search-bar-0" type="text" className="form-control bg-light border-light search " placeholder="Search Permission..." />
                        <i className="bx bx-search-alt search-icon"></i>
                      </div>
                    </div>
                    <div className="flex-shrink-0 ms-2 ">

                      <Nav tabs className="nav justify-content-end nav-tabs-custom rounded card-header-tabs border-bottom-0">

                        {roleData.map((row, idx) => {
                          return (
                            <NavItem key={idx}>
                              <NavLink style={{ cursor: "pointer" }} className={classnames({ active: cardHeaderTab === Number(row.id), })} onClick={() => { cardHeaderToggle(row.id); }} >
                                {row.name}
                              </NavLink>
                            </NavItem>
                          )
                        })}
                      </Nav>
                    </div>
                  </div>
                  <CardBody>
                    <TabContent activeTab={'1'} className="text-muted">
                      <TabPane tabId="1" id="home2">
                        <Row>
                          <Col md={12}>
                            <Label>
                              <Input checked={checkAll} onChange={(check) => checkAllAction()} type='checkbox' /> Check All
                            </Label>
                          </Col>
                        </Row>
                        <Row>

                          {Object.keys(permissionData).length === 0 && (
                            <div className="py-4 text-center">
                              <div>

                              </div>

                              <div className="mt-4">
                                <h5>Sorry! No Result Found</h5>
                              </div>
                            </div>
                          )}

                          {Object.keys(permissionData).map((group) => (

                            <Col md={4} key={group} className=''>
                              <h3>{group}</h3>
                              {permissionData[group].map((permission: PermissionData) => {

                                return (
                                  <div key={`permission-${permission.id}`}>
                                    <Label>
                                      <Input checked={permissionRoleData[permission.id] ?? false} onChange={(check) => toggleAccessRole(permission.id)} type='checkbox' key={permission.id} /> {permission.name}
                                    </Label>
                                  </div>
                                )
                              })}
                            </Col>
                          ))}
                        </Row>
                      </TabPane>

                    </TabContent>
                  </CardBody>
                </Card>
              </Col>
            </Col>
          </Row>

        </Container>
      </div>
    </React.Fragment>
  );
};

export default AccessList;
