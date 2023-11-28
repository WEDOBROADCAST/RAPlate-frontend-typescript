import React, { useEffect, useState } from 'react';
import { Card, CardBody, CardHeader, Col, Container, Row, DropdownItem, DropdownMenu, DropdownToggle, Input, UncontrolledDropdown, Button } from 'reactstrap';
import BreadCrumb from '../../Components/Common/BreadCrumb';
import DataTable from 'react-data-table-component';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DeleteModal from '../../Components/Common/DeleteModal';
import { listUser, userDelete } from '../../helpers/api';
import { $can } from '../../helpers/permission';
import { UserData } from 'models/AppModels'

const UserList = () => {

  const navigate = useNavigate();

  const actionEdit = (id: number) => {
    navigate(`/user/${id}/edit`);
  };
  const actionView = (id: number) => {
    navigate(`/user/${id}/view`);
  };

  document.title = "";

  //delete Conatct
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedId, setSelectedId] = useState(1);

  const handleDelete = async () => {

    const response = await userDelete(selectedId)
    setDeleteModal(false);

    if (response.status === 200) {
      toast.success("User Removed Successfully", { autoClose: 3000 });

      fetchData(1, perPage, '', '')
    } else {
      toast.error("User Removed Failed!", { autoClose: 3000 });
    }
  };

  const actionDelete = async (id: number) => {
    setSelectedId(id);
    setDeleteModal(true);
  };

  const columns = [
    {
      name: <Input className="form-check-input fs-15" type="checkbox" name="checkAll" value="option1" />,

      cell: () => (
        <input className="form-check-input fs-15" type="checkbox" name="checkAll" value="option1" />
      ),
    },
    {
      name: <span className='font-weight-bold fs-13'>Name</span>,
      selector: (row: any) => row.name,
      field: 'name'
    },
    {
      name: <span className='font-weight-bold fs-13'>Email</span>,
      selector: (row: any) => row.email,
      field: 'name'
    },
    {
      name: <span className='font-weight-bold fs-13'>Role</span>,
      selector: (row: any) => <span className="badge bg-light text-body fs-12 fw-medium">{row.roles[0]?.name}</span>,
      field: 'name'
    },
    {
      name: <span className='font-weight-bold fs-13'>Action</span>,

      cell: (row: any) => {
        return (
          <UncontrolledDropdown className="dropdown d-inline-block">
            <DropdownToggle className="btn btn-soft-secondary btn-sm" tag="button">
              <i className="ri-more-fill align-middle"></i>
            </DropdownToggle>
            <DropdownMenu className="dropdown-menu-end">
              {$can('user_view') && <DropdownItem onClick={() => actionView(row.id)}><i className="ri-eye-fill align-bottom me-2 text-muted"></i>View</DropdownItem>}
              {$can('user_update') && <DropdownItem onClick={() => actionEdit(row.id)}><i className="ri-pencil-fill align-bottom me-2 text-muted"></i>Edit</DropdownItem>}
              {$can('user_delete') && <DropdownItem onClick={() => actionDelete(row.id)} > <i className="ri-delete-bin-fill align-bottom me-2 text-muted"></i> Delete </DropdownItem>}
            </DropdownMenu>
          </UncontrolledDropdown>
        );
      },
    },
  ];

  const [data, setData] = useState([]);

  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [sort, setSort] = useState('id,desc');
  const [term, seterm] = useState('');


  const handlePerPageChange = (newPerPage: React.SetStateAction<number>) => {
    setPerPage(newPerPage);
    fetchData(1, newPerPage, sort, term);
  };

  const handlePageChange = (page: number) => {
    fetchData(page, perPage, sort, term);
  };

  const handleSearch = (term: string) => {

    console.log(term)
    fetchData(1, perPage, sort, term);
  };

  const handleSortChange = (column: any, sortDirection: any) => {
    const order = `${column.field},${sortDirection}`
    setSort(order)
    fetchData(1, perPage, order, '')
  };
  const fetchData = async (page: number, perPage: any, sort = '', term: string) => {
    const response = await listUser(page, perPage, sort, term)

    const user = await response.json()

    if (response.status === 200) {
      setData(user.data)
      setTotalRows(user.meta.total);
    } else {
      toast("Server error", { position: "top-center", hideProgressBar: true, className: 'bg-danger text-white' })
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData(1, perPage, sort, '');
  }, []);

  const actionAdd = () => {
    navigate(`/user/add`);
  };

  return (
    <React.Fragment>
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDelete}
        onCloseClick={() => setDeleteModal(false)}
      />
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="User List" pageTitle="User" />
          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader>
                  <h5 className="card-title mb-0">User List {$can('user_add') && <Button onClick={actionAdd} color="primary" className="btn-label float-end"> <i className="ri-add-fill label-icon align-middle fs-16 me-2"></i> Add New User </Button>}</h5>
                </CardHeader>
                <CardBody>
                  <div className={"search-box me-2 mb-2 d-inline-block col-2 float-end"}>
                    <input
                      onChange={(e) => handleSearch(e.target.value)}
                      id="search-bar-0"
                      type="text"
                      className="form-control search /"
                      placeholder="Search user"
                    />
                    <i className="bx bx-search-alt search-icon"></i>
                  </div>

                  <DataTable
                    columns={columns}
                    data={data}
                    pagination
                    paginationServer={true}
                    paginationTotalRows={totalRows}
                    onChangePage={handlePageChange}
                    onChangeRowsPerPage={handlePerPageChange}
                    onSort={handleSortChange}
                    sortServer={true}
                  />
                </CardBody>
              </Card>
            </Col>
          </Row>

        </Container>
      </div>
    </React.Fragment>

  );
};


export default UserList;
