import { Component, createRef} from "react";
import { Button } from "react-bootstrap";
import { CSSTransition } from "react-transition-group";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';
import {AiOutlineCloseCircle} from "react-icons/ai";
import './joinRoom.css'

class JoinRoom extends Component{
    constructor(props) {
        super(props);
        this.roomCodeInput = createRef();
        this.joinUserNameInput = createRef();
    }
    joinRoom = () => {
        var roomCode = this.roomCodeInput.current.value.trim();
        var userName = this.joinUserNameInput.current.value.trim();
        var uuid = uuidv4();
        axios.post(`http://127.0.0.1:8000/api/check-room?code=${roomCode}&name=${userName}&uuid=${uuid}`).then((res)=>{
            if (roomCode != "" && userName != "" ) {
                if(res.data.status === 1){
                    alert("There is no meeting holds in this room");
                }else{
                    window.location.href=`#/room?code=${roomCode}&uuid=${uuid}`
                }
            }
        })
    }
    render(){
        return(
        <div>
            <CSSTransition
                in={this.props.showJoinDialog}
                timeout={200}
                classNames="join"
                unmountOnExit={false}
            >
                <div className="join-dialog">
                    <div style={{textAlign:"end"}}>
                        <AiOutlineCloseCircle style={{fontSize:"25px", cursor:"pointer"}} onClick={this.props.closeDialog}></AiOutlineCloseCircle>
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
            </CSSTransition>
        </div>
        )
    }
}
export default JoinRoom