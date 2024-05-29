import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/styles/profile.css';

const groupsList = ({ groups }: { groups: string[] }) => {
  return (
    <Container fluid style={{ maxHeight: '400px', overflowY: 'auto' }}>
      {groups.map((group, index) => (
        <Row key={index} className="group-row">
          <Col className="group-container">
            <img src="https://via.placeholder.com/150" alt="group" />
            {group}
            <button className="arrow-button">Arrow Button</button>
          </Col>
        </Row>
      ))}
    </Container>
  );
};

export default groupsList;
