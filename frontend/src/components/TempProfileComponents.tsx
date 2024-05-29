import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import 'bootstrap/dist/css/bootstrap.min.css';

const postsGrid = () => {
  const rows = [];
  for (let i = 1; i <= 24; i++) {
    rows.push(
      <Row key={i}>
        <Col>{`Row ${i}, Col 1`}</Col>
        <Col>{`Row ${i}, Col 2`}</Col>
        <Col>{`Row ${i}, Col 3`}</Col>
      </Row>
    );
  }

  return (
    <Container fluid style={{ maxHeight: '400px', overflowY: 'auto' }}>
      {rows}
    </Container>
  );
};

export default postsGrid;
