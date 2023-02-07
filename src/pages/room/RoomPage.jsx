import { Component, createRef } from "react";
import { Button } from "react-bootstrap";
import io from 'socket.io-client';
import axios from "axios";
// import { initScene } from "./initScene";
import { Room } from "./Room.js";
// import { renderScene } from "./renderScene.js";
import { AiOutlineSend } from "react-icons/ai"
import "./RoomPage.css"
import {url, isSocket} from "../../Api.js";
// const socket = io.connect("https://api.paulduan.tk/", {path :'/round-table/socket.io'})
// const socket = io.connect("http://127.0.0.1:8000/")

class RoomPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            socket: io.connect(`${url}`, isSocket ? {path :'/round-table/socket.io'} : {}),
            // socket: io.connect("http://127.0.0.1:8000/"),
            user: {
                userName: "",
                uuid: ""
            },
            roomCode: "",
            msg: "",
            title: "",
            messages: []
        }
        this.canvas = createRef();
        this.textArea = createRef();
        this.msgDiv = createRef();
    }

    setMessage = (event) => {
        this.setState({ msg: event.target.value });
    }
    setUserName = (event) => {
        this.setState({ user: event.target.value });
    }
    sendMessage = (event) => {
        if (event.key == "Enter") {
            console.log(event);
            event.preventDefault();
            if (this.textArea.current.value == "") {
                return
            }
            this.state.socket.emit('new message', { roomCode: this.state.roomCode, user: this.state.user, msg: this.textArea.current.value })
            this.textArea.current.value = "";
        } else if (event.type == "click") {
            if (this.textArea.current.value == "") {
                return
            }
            this.state.socket.emit('new message', { roomCode: this.state.roomCode, user: this.state.user, msg: this.textArea.current.value })
            this.textArea.current.value = "";
        }
    }
    raisingHand = () => {
        // renderScene(this.canvas.current);
        // raiseHand();
        this.state.room.raisingHand();
        // console.log("我点了奥");
    }
    loweringHand = () => {
        // renderScene(this.canvas.current);
        // raiseHand();
        this.state.room.loweringHand();
        // console.log("我点了奥");
    }
    clap = () => {
        this.state.room.clap();
    }
    unmount = () => {
        this.state.room.unmount();
    }

    componentDidMount() {
        // Example: first time connect recieve 失败,经测验服务器端发送正常
        this.state.socket.on("recieveMessage", (msg) => {
            // console.log("new message");
            this.setState({ messages: this.state.messages.concat(msg) }, () => {
                this.msgDiv.current.scrollTo({
                    top: this.msgDiv.current.scrollHeight,
                    left: 0,
                    behavior: 'smooth'
                });
            })
            // this.textArea.current.value = "";
            // this.textArea.current.focus();
            console.log(`${msg.user.userName} saies: ${msg.msg}`);
        })
        this.state.socket.on("quitRoom", () => {
            // window.location.href='#/main'
            this.props.router.navigate(`/main`);
            alert("You have been logged from another location");
        })
        // axios.post(`https://api.paulduan.tk/round-table/api/load-room${window.location.hash.substring(6)}`).then((res)=>{
        axios.post(`${url}/api/load-room${window.location.hash.substring(6)}`).then((res) => {
            if (res.data.status == 1) {
                // window.location.href='#/main'
                this.props.router.navigate(`/main`);
                alert("There is no meeting holds in this room");
            } else if (res.data.status == 0) {
                console.log(res);
                this.setState({ roomCode: res.data.code, messages: res.data.msgs, user: res.data.user, title: res.data.title, roomType: res.data.roomType }, () => {
                    const node = this.canvas.current;
                    node.innerHTML = "";
                    // const room = new Room(node, this.state.roomCode, this.state.socket, res.data.users, res.data.user);
                    var room = new Room(node, this.state.roomCode, this.state.socket, res.data.users, res.data.user);
                    this.setState({ room: room }, () => {
                        this.state.room.loadModel(0);
                    });

                    this.state.socket.emit("joinRoom", { roomCode: this.state.roomCode, uuid: this.state.user.uuid })
                    this.msgDiv.current.scrollTo({
                        top: this.msgDiv.current.scrollHeight,
                        left: 0,
                        behavior: 'auto'
                    });
                })
            } else {
                // window.location.href="#/main"
                this.props.router.navigate(`/main`);

                alert("Fail to validate you identity, please rejoin this room");
            }
        })
    }
    componentWillUnmount() {
        this.unmount();
        this.setState({room:null})
    }
    render() {
        // console.log(this.state);
        const messages = this.state.messages.map((msg) =>
            <div>
                <div style={{ textAlign: (msg.user.uuid == this.state.user.uuid ? "end" : "start"), fontSize: "13px" }}>
                    {msg.user.userName}
                </div>
                <div style={{
                    textAlign: "end",
                    padding: "8px",
                    marginBottom: "10px",
                    border: "1px solid none",
                    width: "fit-content",
                    marginLeft: (msg.user.uuid == this.state.user.uuid ? "auto" : "none"),
                    borderRadius: "5px 5px 5px 5px",
                    background: "#6BC4FF",
                    // background:"rgb(255,255,255)",
                    fontSize: "15px"
                }}>
                    {msg.msg}
                </div>
            </div>)
        return (
            <div>
                {/* Title */}
                <div style={{ textAlign: "center", padding: "5px", background: "rgb(80,80,80)", color: "white" }}>{this.state.title}</div>
                {/* Body */}
                <div style={{ textAlign: "center" }}>
                    <div style={{ position: "absolute" }}><Button onClick={this.raisingHand}>Raising</Button></div>
                    <div style={{ position: "absolute", left: "80px" }}><Button onClick={this.loweringHand}>Lowering</Button></div>
                    <div style={{ position: "absolute", left: "200px" }}><Button onClick={this.clap}>Clap</Button></div>
                    {/* Area for 3D */}
                    <div ref={this.canvas} style={{ display: "inline-block", width: "900px", height: "650px" }}>
                        {/* Chatting */}
                        {/* <div class="loader"></div> */}
                    </div>
                    <div style={{
                        display: "inline-block",
                        border: "1px solid rgb(214,214,214)",
                        background: "rgb(245,245,245)",
                        marginLeft: "auto",
                        width: "600px",
                        height: "650px",
                        verticalAlign: "top"
                    }}>
                        <div style={{ display: "inline-block", verticalAlign: "top" }}>Room Code: {this.state.roomCode}</div>
                        <div ref={this.msgDiv} style={{ height: "525px", overflow: "auto", overflowWrap: "break-word", padding: "5px", paddingBottom: "150px" }}>{messages}</div>
                        <div style={{ height: "120px", borderTop: "1px solid rgb(214, 214, 214)", padding: "5px" }}>
                            {/* <input onChange={this.setUserName}></input> */}
                            <textarea ref={this.textArea} className={"textArea"} onKeyDown={this.sendMessage}></textarea>
                            <Button style={{ height: "30px", border: "none", background: "none", fontSize: "25px", display: "inline-block", verticalAlign: "bottom" }} onClick={this.sendMessage}>
                                <AiOutlineSend style={{ color: "rgb(100,100,100)", position: "relative", top: "-6px", background: "none" }}></AiOutlineSend>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default RoomPage