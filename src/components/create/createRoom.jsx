import { Component, createRef} from "react";
import { Button } from "react-bootstrap";
import { CSSTransition } from "react-transition-group";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';
import {AiOutlineCloseCircle} from "react-icons/ai";
import './createRoom.css'

class CreateRoom extends Component{
    constructor(props) {
        super(props);
        this.createUserNameInput = createRef();
        this.roomTitleInput = createRef();
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
        axios.post(`http://127.0.0.1:8000/api/create-room?code=${n}&name=${userName}&uuid=${uuid}&title=${title}`).then((res)=>{
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
                    <AiOutlineCloseCircle style={{fontSize:"25px", cursor:"pointer"}} onClick={this.props.closeDialog}></AiOutlineCloseCircle>
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
            </CSSTransition>
        </div>
        )
    }
}
export default CreateRoom