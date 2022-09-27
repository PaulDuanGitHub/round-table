import { Component, createRef} from "react";
import { Button } from "react-bootstrap";
import axios from "axios";
import io from 'socket.io-client';
import {AiOutlineCloseCircle} from "react-icons/ai";
import { v4 as uuidv4 } from 'uuid';

const socket = io.connect("http://34.130.121.26:80")

class Main extends Component {
    constructor(props) {
        super(props);
        this.state ={
            showJoinDialog: false,
            showCreateDialog: false
        }
        this.roomCodeInput = createRef();
        this.joinUserNameInput = createRef();
        this.createUserNameInput = createRef();
        this.roomTitleInput = createRef();
    }

    showJoinDialog = () =>{
        this.setState({showJoinDialog:true})
    }
    hideJoinDialog = () =>{
        this.setState({showJoinDialog:false})
    }
    showCreateDialog = () =>{
        this.setState({showCreateDialog:true})
    }
    hideCreateDialog = () =>{
        this.setState({showCreateDialog:false})
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
        axios.post(`http://34.130.121.26:80/api/create-room?code=${n}&name=${userName}&uuid=${uuid}&title=${title}`).then((res)=>{
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
    joinRoom = () => {
        var roomCode = this.roomCodeInput.current.value.trim();
        var userName = this.joinUserNameInput.current.value.trim();
        var uuid = uuidv4();
        axios.post(`http://34.130.121.26:80/api/check-room?code=${roomCode}&name=${userName}&uuid=${uuid}`).then((res)=>{
            if (roomCode != "" && userName != "" ) {
                if(res.data.status === 1){
                    alert("There is no meeting holds in this room");
                }else{
                    window.location.href=`#/room?code=${roomCode}&uuid=${uuid}`
                }
            }
        })
    }
    componentDidMount(){
    }
    render(){
        return(
            <div>
                <div style={{
                    width:"240px",
                    marginLeft:"auto",
                    marginRight:"auto",
                    position:"absolute",
                    left:0,
                    right:0,
                    zIndex:"2",
                    background:"white",
                    top:"150px",
                    padding:"25px",
                    paddingTop:"5px",
                    paddingBottom:"10px",
                    borderRadius:"5px 5px 5px 5px",
                    display: this.state.showJoinDialog ? "block" : "none"
                }}>
                    <div style={{textAlign:"end"}}>
                        <AiOutlineCloseCircle style={{fontSize:"25px", cursor:"pointer"}} onClick={this.hideJoinDialog}></AiOutlineCloseCircle>
                    </div>
                    <div>
                        Room Code<input ref={this.roomCodeInput} style={{display:"block"}}></input>
                    </div>
                    <div>
                        Your Name:<input ref={this.joinUserNameInput} style={{display:"block"}}></input>
                    </div>
                    <div style={{textAlign:"center", marginTop:"15px"}}>
                        <Button onClick={this.joinRoom}>Join!</Button>
                    </div>
                </div>
                <div style={{
                    width:"240px",
                    marginLeft:"auto",
                    marginRight:"auto",
                    position:"absolute",
                    left:0,
                    right:0,
                    zIndex:"2",
                    background:"white",
                    top:"150px",
                    padding:"25px",
                    paddingTop:"5px",
                    paddingBottom:"10px",
                    borderRadius:"5px 5px 5px 5px",
                    display: this.state.showCreateDialog ? "block" : "none"
                }}>
                    <div style={{textAlign:"end"}}>
                        <AiOutlineCloseCircle style={{fontSize:"25px", cursor:"pointer"}} onClick={this.hideCreateDialog}></AiOutlineCloseCircle>
                    </div>
                    <div>
                        Meeting Title:<input ref={this.roomTitleInput} style={{display:"block"}}></input>
                    </div>
                    <div>
                        Your Name:<input ref={this.createUserNameInput} style={{display:"block"}}></input>
                    </div>
                    <div style={{textAlign:"center", marginTop:"15px"}}>
                        <Button onClick={this.createRoom}>Start!</Button>
                    </div>
                </div>
                <div style={{height:"50px", background:"rgb(80,80,80)", marginBottom:"60px"}}></div>
                <div style={{
                    position:"relative",
                    marginLeft:"auto",
                    marginRight:"auto",
                    width:"500px",
                    opacity: (this.state.showJoinDialog || this.state.showCreateDialog) ? "0.8" : "1",
                    pointerEvents: (this.state.showJoinDialog || this.state.showCreateDialog) ? "none" : 'auto'

                }}>
                    <div style={{left:"-400px",top:"150px", position:"absolute", zIndex:"1", color:"black", fontSize:"20px"}}>How to start a meeting
                        <ul>
                            <li>Start a new meeting</li>
                            <li>Set meeting title</li>
                            <li>Copy the 5 chars room code and share it</li>
                            <li>Now we shall begin the meeting</li>
                        </ul>
                    </div>
                    <div style={{right:"-400px",top:"150px", position:"absolute", zIndex:"1", color:"black", fontSize:"20px"}}>How to join a meeting
                        <ul>
                            <li>Copy the room code</li>
                            <li>Paste it and set your name</li>
                            <li>Now we shall begin the meeting</li>
                        </ul>
                    </div>
                    <div style={{pointerEvents:"none", left:"40px",top:"100px", position:"absolute", zIndex:"1", fontSize:"50px", color:"white"}}>
                        Start
                        <div style={{fontSize:"18px", left:"-10px", position:"relative"}}>a meeting and invite people</div>
                    </div>
                    <div style={{pointerEvents:"none", left:"250px",top:"250px", position:"absolute", zIndex:"1", fontSize:"50px", color:"white"}}>
                        Join
                        <div style={{fontSize:"18px", left:"-10px", position:"relative"}}>an existing meeting</div>
                    </div>
                    <div style={{textAlign:"center", transform:"rotate(-75deg)"}}>
                        <div>
                        <Button style=
                        {{
                            width:"500px",
                            backgroundColor:"rgba(5, 131, 242, 1)",
                            height:"250px",
                            borderRadius:"500px 500px 0 0",
                            border: "none"
                        }} onClick={this.showCreateDialog}></Button>
                        </div>
                        <div>
                        <Button style=
                        {{
                            width:"500px",
                            height:"250px",
                            backgroundColor:"rgba(5, 151, 242, 1)",
                            borderRadius:"500px 500px 0 0",
                            transform:"rotate(180deg)",
                            border:"none"
                        }} onClick={this.showJoinDialog}></Button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default Main