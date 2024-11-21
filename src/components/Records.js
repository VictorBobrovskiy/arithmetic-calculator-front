// src/components/Records/Records.jsx
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Table, 
  Pagination, 
  Form, 
  InputGroup, 
  Button, 
  Alert, 
  Spinner 
} from 'react-bootstrap';

const Records = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [search, setSearch] = useState('');
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);

  const fetchRecords = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/v1/records?page=${page}&size=${size}&search=${encodeURIComponent(search)}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch records');
      }

      const data = await response.json();
      setRecords(data.content);
      setTotalPages(data.totalPages);
      setTotalRecords(data.totalElements);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchRecords();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [page, size, search]);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/v1/records/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete record');
      }

      fetchRecords();
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const renderPagination = () => {
    let items = [];
    const maxVisiblePages = 5;
    const startPage = Math.max(0, Math.min(page - 2, totalPages - maxVisiblePages));
    const endPage = Math.min(startPage + maxVisiblePages, totalPages);

    if (startPage > 0) {
      items.push(
        <Pagination.Item key="0" onClick={() => handlePageChange(0)}>1</Pagination.Item>
      );
      if (startPage > 1) items.push(<Pagination.Ellipsis key="ellipsis1" />);
    }

    for (let number = startPage; number < endPage; number++) {
      items.push(
        <Pagination.Item
          key={number}
          active={number === page}
          onClick={() => handlePageChange(number)}
        >
          {number + 1}
        </Pagination.Item>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) items.push(<Pagination.Ellipsis key="ellipsis2" />);
      items.push(
        <Pagination.Item 
          key={totalPages - 1} 
          onClick={() => handlePageChange(totalPages - 1)}
        >
          {totalPages}
        </Pagination.Item>
      );
    }

    return items;
  };

  return (
    <Card>
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h4 className="mb-0">Operation History</h4>
        <span className="text-muted">Total Records: {totalRecords}</span>
      </Card.Header>
      <Card.Body>
        <div className="mb-4">
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="Search records..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Form.Select 
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              style={{ maxWidth: '200px' }}
            >
              <option value="5">5 per page</option>
              <option value="10">10 per page</option>
              <option value="20">20 per page</option>
              <option value="50">50 per page</option>
            </Form.Select>
          </InputGroup>
        </div>

        {error && (
          <Alert variant="danger" dismissible onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : (
          <>
            <div className="table-responsive">
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Operation</th>
                    <th>Result</th>
                    <th>Cost</th>
                    <th>Balance</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {records.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center">No records found</td>
                    </tr>
                  ) : (
                    records.map((record) => (
                      <tr key={record.id}>
                        <td>{formatDate(record.date)}</td>
                        <td>{record.operationType}</td>
                        <td>{record.operationResponse}</td>
                        <td>{formatCurrency(record.amount)}</td>
                        <td>{formatCurrency(record.userBalance)}</td>
                        <td>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDelete(record.id)}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </div>

            <div className="d-flex justify-content-center mt-4">
              <Pagination>
                <Pagination.First
                  onClick={() => handlePageChange(0)}
                  disabled={page === 0}
                />
                <Pagination.Prev
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 0}
                />
                {renderPagination()}
                <Pagination.Next
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page >= totalPages - 1}
                />
                <Pagination.Last
                  onClick={() => handlePageChange(totalPages - 1)}
                  disabled={page >= totalPages - 1}
                />
              </Pagination>
            </div>
          </>
        )}
      </Card.Body>
    </Card>
  );
};

export default Records;