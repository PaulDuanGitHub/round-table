import { Component, createRef} from "react";
import { Button, Col, Container, Row, Form, Card } from "react-bootstrap";
import { CSSTransition } from "react-transition-group";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';
import {AiOutlineCloseCircle} from "react-icons/ai";
import './CreateRoom.css'
import url from "../../Api";
import Room1 from '../../img/Room1.png'
import Room2 from '../../img/Room2.png'

class CreateRoom extends Component{
    constructor(props) {
        super(props);
        this.createUserNameInput = createRef();
        this.roomTitleInput = createRef();
        this.state = {
            roomType: 0
        }
    }
    createRoom = ()=>{
        function createHash (hashLength) {
            // 默认长度 24
            return Array.from(Array(Number(hashLength) || 24), () => Math.floor(Math.random() * 36).toString(36)).join('');
        }
        var n = createHash(5);
        var uuid = uuidv4();
        var title = this.roomTitleInput.current.value.trim();
        var userName = this.createUserNameInput.current.value.trim();
        var roomType = this.state.roomType;
        // axios.post(`https://api.paulduan.tk/round-table/api/create-room?code=${n}&name=${userName}&uuid=${uuid}&title=${title}`).then((res)=>{
        axios.post(`${url}/api/create-room?code=${n}&name=${userName}&uuid=${uuid}&title=${title}&roomType=${roomType}`).then((res)=>{
            // console.log(res);
            if (userName != "" ) {
                if (res.data.status === 1){
                    window.location.href=`#/room?code=${n}&uuid=${uuid}`;
                }else{
                    alert("Please try again");
                }
            }
        })
    }
    changeRoomType = (e) => {
        this.setState({roomType: e.target.value})
    }
    render(){
        return(
        <div>
            <CSSTransition
                in={this.props.showCreateDialog}
                timeout={200}
                classNames="create"
                unmountOnExit={false}
            >
            <div className={"create-dialog"}>
                <div style={{textAlign:"end"}}>
                    <AiOutlineCloseCircle style={{fontSize:"20px", cursor:"pointer"}} onClick={this.props.closeDialog}></AiOutlineCloseCircle>
                </div>
                <Container>
                    <Row>
                        <Col>
                            Meeting Title: <input ref={this.roomTitleInput} style={{}}></input>
                        </Col>
                        <Col>
                            Your Name: <input ref={this.createUserNameInput} style={{}}></input>
                        </Col>
                    </Row>
                    <Row style={{marginTop:"15px"}}>
                        <hr></hr>
                    </Row>
                    <Row>
                        <Form.Group style={{display:"flex"}}>
                            <Form.Check 
                                type="radio"
                                value= {0}
                                label= {<div>
                                    Deafault Style Room
                                        <div>
                                            <img src={Room1} className="room-img"></img>
                                        </div>
                                    </div>}
                                onChange = {this.changeRoomType}
                                checked = {this.state.roomType == 0}
                            />
                            {/* <Form.Check
                                type="radio"
                                value= {1}
                                label= {<div>
                                    SEELE Style Room
                                        <div>
                                            <img src={Room2} className="room-img"></img>
                                        </div>
                                    </div>}
                                onChange = {this.changeRoomType}
                                checked = {this.state.roomType == 1}
                            /> */}
                        </Form.Group>
                    </Row>
                </Container>
                <div>
                </div>
                <div style={{textAlign:"center", marginTop:"15px"}}>
                    <Button onClick={this.createRoom}>Start!</Button>
                </div>
            </div>
            </CSSTransition>
        </div>
        )
    }
}
export default CreateRoom