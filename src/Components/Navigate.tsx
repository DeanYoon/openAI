import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { widthSize } from "../atoms";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCubes,
  faGear,
  faHome,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
const Nav = styled.div`
  min-width: 80px;
  height: 100%;
  color: #aaaaaa;
  background-color: #fafbff;
  font-size: 30px;
  font-weight: 1000;
  display: flex;
  flex-direction: column;
`;

const Items = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 80%;
  width: 100%;
`;
const Item = styled.div`
  padding: 20px 0px;
  text-align: center;
`;
const Setting = styled.div`
  height: 20%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

function Navigate() {
  const [width, setWidth] = useRecoilState(widthSize);
  window.addEventListener("resize", () => {
    setWidth(window.innerWidth);
  });

  useEffect(() => {
    console.log(width);
  }, [width]);

  return (
    <Nav>
      <Items>
        <Link to="/openAI">
          <Item>
            <FontAwesomeIcon icon={faHome}></FontAwesomeIcon>
          </Item>
        </Link>
        <Link to="/openAI/chat">
          <Item>
            <FontAwesomeIcon icon={faUser}></FontAwesomeIcon>
          </Item>
        </Link>
        <Link to="/openAI/more">
          <Item>
            <FontAwesomeIcon icon={faCubes}></FontAwesomeIcon>
          </Item>
        </Link>
      </Items>
      <Setting>
        <Link to="/openAI/setting">
          <Item>
            {" "}
            <FontAwesomeIcon icon={faGear}></FontAwesomeIcon>{" "}
          </Item>
        </Link>
      </Setting>
    </Nav>
  );
}

export default Navigate;
