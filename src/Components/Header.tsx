import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { widthSize } from "../atoms";
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
  const [width, setWidth] = useRecoilState(widthSize);
  window.addEventListener("resize", () => {
    setWidth(window.innerWidth);
  });

  useEffect(() => {
    console.log(width);
  }, [width]);

  return (
    <Nav>
      <Logo>
        <img alt="" src={robotLogo} />
      </Logo>
      <Items>
        <Link to="/opanAI">
          <Item>Home</Item>
        </Link>
        <Link to="/openAI/chat">
          <Item>Chat</Item>
        </Link>
        <Link to="/openAI/image">
          <Item>Image</Item>
        </Link>
      </Items>
    </Nav>
  );
}

export default Header;
