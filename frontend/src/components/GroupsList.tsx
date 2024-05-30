import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { FaArrowRight } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/styles/profile.css';

const GroupsList = ({ groups }: { groups: string[] }) => {
  return (
    <Container fluid style={{ maxHeight: '400px', overflowY: 'auto' }}>
      {groups.map((group, index) => (
        <Row key={index} className="group-row">
          <Col className="group-container" onClick={() => alert(`Clicked on ${group}`)}>
            <img src="https://via.placeholder.com/150" alt="group" className="group-image" />
            <span className="group-name">{group}</span>
            <FaArrowRight className="arrow-icon" />
          </Col>
        </Row>
      ))}
    </Container>
  );
};

export default GroupsList;
