import { Component, createRef } from "react";
import { Button,Row, Form } from "react-bootstrap";
import { CSSTransition } from "react-transition-group";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';
import { AiOutlineCloseCircle } from "react-icons/ai";
import './JoinRoom.css'

class JoinRoom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            confereeList: [],
            roomExisting: false,
            chosenSeat: null
        }
        this.roomCodeInput = createRef();
        this.joinUserNameInput = createRef();
    }
    checkRoom = () => {
        var roomCode = this.roomCodeInput.current.value.trim();
        axios.post(`http://127.0.0.1:8000/api/check-room?code=${roomCode}`).then((res) => {
            if (res.data.status == 1) {
                alert("There is no meeting holds in this room");
            } else {
                // alert(res.data.confereeList);
                var confereeList = new Array(8).fill(""); // Can be sub by room size in the future
                res.data.users.forEach((user)=>{
                    confereeList[user.chosenSeat] = user.name
                })
                var defaultSeat;
                for(var i = 0; i < confereeList.length; i++){
                    if (confereeList[i] == ""){
                        defaultSeat = i + 1;
                        break;
                    }
                }

                this.setState({ confereeList: confereeList, chosenSeat: defaultSeat, roomExisting: true });
            }
        })

    }
    joinRoom = () => {
        var roomCode = this.roomCodeInput.current.value.trim();
        var userName = this.joinUserNameInput.current.value.trim();
        var chosenSeat = this.state.chosenSeat;
        var uuid = uuidv4();
        if (roomCode != "" && userName != "" && chosenSeat != null) {
            axios.post(`http://127.0.0.1:8000/api/join-room?code=${roomCode}&name=${userName}&uuid=${uuid}&chosenSeat=${chosenSeat-1}`).then((res) => {
            // axios.post(`https://api.paulduan.tk/round-table/api/check-room?code=${roomCode}&name=${userName}&uuid=${uuid}`).then((res)=>{
                if (res.data.status == 1) {
                    alert("There is no meeting holds in this room");
                } else {
                    window.location.href = `#/room?code=${roomCode}&uuid=${uuid}`
                }
            })
        }else{
            alert("Nah")
        }
    }
    changeChosenSeat = (e) => {
        this.setState({chosenSeat: e.target.value})
    }
    render() {
        return (
            <div>
                <CSSTransition
                    in={this.props.showJoinDialog}
                    timeout={200}
                    classNames="join"
                    unmountOnExit={false}
                >
                    <div className="join-dialog">
                        <div style={{ textAlign: "end" }}>
                            <AiOutlineCloseCircle style={{ fontSize: "25px", cursor: "pointer" }} onClick={this.props.closeDialog}></AiOutlineCloseCircle>
                        </div>
                        <div>
                            Room Code<input ref={this.roomCodeInput} style={{ display: "block" }}></input>
                        </div>
                        <div style={{ textAlign: "center", marginTop: "15px" }}>
                            <Button onClick={this.state.roomExisting ? this.joinRoom : this.checkRoom}>{this.state.roomExisting ? "Join Room" : "Check Room"}</Button>
                        </div>
                        <div style={{ display: this.state.roomExisting ? "block" : "none" }}>
                            Your Name:<input ref={this.joinUserNameInput} style={{ display: "block" }}></input>
                            <Row>
                                <Form.Group>
                                    <Form.Check
                                        type="radio"
                                        value={1}
                                        disabled={this.state.confereeList[0]!=""}
                                        label={<div>1</div>}
                                        onChange={this.changeChosenSeat}
                                        checked={this.state.chosenSeat == 1}
                                    />
                                    <Form.Check
                                        type="radio"
                                        value={2}
                                        disabled={this.state.confereeList[1]!=""}
                                        label={<div>2</div>}
                                        onChange={this.changeChosenSeat}
                                        checked={this.state.chosenSeat == 2}
                                    />
                                    <Form.Check
                                        type="radio"
                                        value={3}
                                        disabled={this.state.confereeList[2]!=""}
                                        label={<div>3</div>}
                                        onChange={this.changeChosenSeat}
                                        checked={this.state.chosenSeat == 3}
                                    />
                                    <Form.Check
                                        type="radio"
                                        value={4}
                                        disabled={this.state.confereeList[3]!=""}
                                        label={<div>4</div>}
                                        onChange={this.changeChosenSeat}
                                        checked={this.state.chosenSeat == 4}
                                    />
                                    <Form.Check
                                        type="radio"
                                        value={5}
                                        disabled={this.state.confereeList[4]!=""}
                                        label={<div>5</div>}
                                        onChange={this.changeChosenSeat}
                                        checked={this.state.chosenSeat == 5}
                                    />
                                    <Form.Check
                                        type="radio"
                                        value={6}
                                        disabled={this.state.confereeList[5]!=""}
                                        label={<div>6</div>}
                                        onChange={this.changeChosenSeat}
                                        checked={this.state.chosenSeat == 6}
                                    />
                                    <Form.Check
                                        type="radio"
                                        value={7}
                                        disabled={this.state.confereeList[6]!=""}
                                        label={<div>7</div>}
                                        onChange={this.changeChosenSeat}
                                        checked={this.state.chosenSeat == 7}
                                    />
                                    <Form.Check
                                        type="radio"
                                        value={8}
                                        disabled={this.state.confereeList[7]!=""}
                                        label={<div>8</div>}
                                        onChange={this.changeChosenSeat}
                                        checked={this.state.chosenSeat == 8}
                                    />
                                </Form.Group>
                            </Row>
                        </div>
                    </div>
                </CSSTransition>
            </div>
        )
    }
}
export default JoinRoom