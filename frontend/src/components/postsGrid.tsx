import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/styles/profile.css';

const PostsGrid = ({ posts }: { posts: string[] }) => {
  const rows = [];

  // Determine how many full rows we have
  const numRows = Math.ceil(posts.length / 3);

  for (let i = 0; i < numRows; i++) {
    rows.push(
      <Row key={i}>
        {posts.slice(i * 3, i * 3 + 3).map((post, index) => (
          <Col key={index} xs={4} md={3} className="grid-container">
            {post}
          </Col>
        ))}
      </Row>
    );
  }

  return (
    <Container fluid style={{ maxHeight: '400px', overflowY: 'auto' }}>
      {rows}
    </Container>
  );
};

export default PostsGrid;
