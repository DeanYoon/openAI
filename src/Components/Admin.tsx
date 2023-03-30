import { Link } from "react-router-dom";
import styled from "styled-components";
import User from "./Users";

const Title = styled.div``;

const Admin = () => {
  return (
    <section>
      <Title>Admins Page</Title>
      <br />
      <User />
      <br />
      <div className="flexGrow">
        <Link to="/">Home</Link>
      </div>
    </section>
  );
};

export default Admin;
