import { Link } from "react-router-dom";
import styled from "styled-components";
import robotLogo from "../imgs/robotLogo.png";
const Nav = styled.div`
  position: absolute;
  width: 100%;
  background-color: black;
  height: 70px;
  color: white;
  display: flex;
  align-items: center;
  font-size: 30px;
  font-weight: 1000;
`;

const Logo = styled.div`
  img {
    width: 70px;
  }
`;
const Items = styled.div`
  display: flex;
`;
const Item = styled.div`
  padding: 0 10px;
`;

function Header() {
  return (
    <Nav>
      <Logo>
        <img src={robotLogo} />
      </Logo>
      <Items>
        <Link to="/">
          <Item>Home</Item>
        </Link>
        <Link to="/text">
          <Item>Text</Item>
        </Link>
        <Link to="/image">
          <Item>Image</Item>
        </Link>
      </Items>
    </Nav>
  );
}

export default Header;
