import React, { useEffect, useState } from 'react';
import { Card, CardBody, CardHeader, Col, Container, Row, Input } from 'reactstrap';
import BreadCrumb from '../../Components/Common/BreadCrumb';
import DataTable from 'react-data-table-component';
import { Link } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { listAudit } from '../../helpers/api';
import { $can } from '../../helpers/permission';
import moment from 'moment';
import { AuditData } from 'models/AppModels';

const AuditList = () => {

  document.title = "";

  const columns = [
    {
      name: <Input className="form-check-input fs-15" type="checkbox" name="checkAll" value="option1" />,
      cell: () => (
        <input className="form-check-input fs-15" type="checkbox" name="checkAll" value="option1" />
      ),
    },
    {
      name: <span className='font-weight-bold fs-13'>Audit Table</span>,
      selector: (row: AuditData) => row.auditable,
      sortable: true,
      field: 'audit_table'
    },
    {
      name: <span className='font-weight-bold fs-13'>Event</span>,
      selector: (row: AuditData) => row.event,
      sortable: true,
      field: 'event'
    },

    {
      name: <span className='font-weight-bold fs-13'>By</span>,
      selector: (row: AuditData) => row.user?.name,
    },
    {
      name: <span className='font-weight-bold fs-13'>Date</span>,
      selector: (row: AuditData) => moment(row.created_at).format('YYYY-MM-DD HH:mm'),
    },
    {
      name: <span className='font-weight-bold fs-13'>Action</span>,

      cell: (row: AuditData) => {
        return (
          <div>
            {$can('audit_view') && <Link to={`/audit/${row.id}/view`} className='btn btn-soft-secondary btn-sm'>
              <i className="ri-eye-fill align-bottom me-2 text-muted"></i>View
            </Link>}
          </div>

        );
      },
    },
  ];

  const [data, setData] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [sort, setSort] = useState('id,desc');
  const [term, seterm] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePerPageChange = (newPerPage: React.SetStateAction<number>) => {
    setPerPage(newPerPage);
    fetchData(1, newPerPage, sort, term);
  };

  const handlePageChange = (page: any) => {
    fetchData(page, perPage, sort, term);
  };

  const handleSearch = (term: string) => {
    fetchData(1, perPage, sort, term);
  };

  const handleSortChange = (selectedColumn: any, sortDirection: any, sortedRows: AuditData[]) => {
    const order = `${selectedColumn.field},${sortDirection}`
    setSort(order)
    fetchData(1, perPage, order, '')
  };

  const fetchData = async (page: number | undefined, perPage: React.SetStateAction<number> | undefined, sort = '', term: string | undefined) => {
    const response = await listAudit(page, perPage, sort, term)

    const audit = await response.json()

    if (response.status === 200) {
      setData(audit.data)
      setTotalRows(audit.meta.total);
    } else {
      toast("Server error", { position: "top-center", hideProgressBar: true, className: 'bg-danger text-white' })
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData(1, perPage, sort, term);
  }, []);


  return (
    <React.Fragment>

      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Audit List" pageTitle="Audit" />
          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader>
                  <h5 className="card-title mb-0">Audit List </h5>
                </CardHeader>
                <CardBody>
                  <div className={"search-box me-2 mb-2 d-inline-block col-2 float-end"}>

                    <input
                      onChange={(e) => handleSearch(e.target.value)}
                      id="search-bar-0"
                      type="text"
                      className="form-control search /"
                      placeholder="Search permission"
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


export default AuditList;
