import { Link } from "react-router-dom";
import styled from "styled-components";
import User from "./Users";

const Title = styled.div``;

const Admin = () => {
  return (
    <section>
      <Title>Welcome to Dean's ChatBot Project</Title>
      <br />
      <User />
      <br />
      <div>
        <Link to="/">Home</Link>
      </div>
    </section>
  );
};

export default Admin;
