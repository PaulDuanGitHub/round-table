import { Component, createRef } from "react";
import { Button } from "react-bootstrap";
import io from 'socket.io-client';
import axios from "axios";
import { loadModel } from "./loadModel";
import { AiOutlineSend } from "react-icons/ai"
import "./room.css"
const socket = io.connect("http://localhost:8000")

class Room extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user:{
                userName:"",
                uuid:""
            },
            roomCode:"",
            msg:"",
            title:"",
            messages:[]
        }
        this.myRef = createRef();
        this.textArea = createRef();
        this.msgDiv = createRef();
    }

    setMessage = (event) =>{
        this.setState({msg:event.target.value});
    }
    setUserName = (event) =>{
        this.setState({user:event.target.value});
    }
    sendMessage = (event)=>{
        if (event.type === 'keydown' && event.key === "Enter") {
            event.preventDefault();
            if (this.textArea.current.value===""){
                return
            }
            socket.emit('new message',{roomCode:this.state.roomCode,user:this.state.user,msg:this.textArea.current.value})
        }else if(event.type==="click"){
            if (this.textArea.current.value===""){
                return
            }
            socket.emit('new message',{roomCode:this.state.roomCode,user:this.state.user,msg:this.textArea.current.value})
        }
    }

    componentDidMount(){
        socket.on("recieveMessage",(msg)=>{
            this.setState({messages:this.state.messages.concat(msg)},()=>{
                this.msgDiv.current.scrollTo({
                    top: this.msgDiv.current.scrollHeight,
                    left: 0,
                    behavior: 'smooth'
                  });
            })
            this.textArea.current.value = "";
            this.textArea.current.focus();
            console.log(msg);
        })
        const node = this.myRef.current;
        loadModel(node);
        axios.post(`http://localhost:8000/api/load-room${window.location.search}`).then((res)=>{
            if(res.data.status === 1){
                window.location.href='/index'
                alert("There is no meeting holds in this room");
            }else if(res.data.status === 0){
                console.log(res);
                this.setState({roomCode:res.data.code, messages:res.data.msgs, user:res.data.user, title:res.data.title},()=>{
                    socket.emit("joinRoom",{roomCode:this.state.roomCode})
                    this.msgDiv.current.scrollTo({
                        top: this.msgDiv.current.scrollHeight,
                        left: 0,
                        behavior: 'auto'
                      });
                })
            }else {
                window.location.href="/index"
                alert("Fail to validate you identity, please rejoin this room");
            }
        })
    }
    render(){
        console.log(this.state);
        const messages = this.state.messages.map((msg)=>
        <div>
            <div style={{textAlign:(msg.user.uuid === this.state.user.uuid ? "end" : "start"), fontSize:"13px"}}>
                {msg.user.userName}
            </div>
            <div style={{
                textAlign:"end",
                padding:"8px", 
                marginBottom:"10px",
                border:"1px solid none", 
                width:"fit-content", 
                marginLeft:(msg.user.uuid === this.state.user.uuid ? "auto" : "none"),
                borderRadius:"5px 5px 5px 5px",
                background:"#6BC4FF",
                // background:"rgb(255,255,255)",
                fontSize:"15px"
                }}>
                {msg.msg}
            </div>
        </div>)
        return(
            <div>
                <div style={{textAlign:"center",padding:"5px", background:"rgb(80,80,80)", color:"white"}}>{this.state.title}</div>
                <div style={{textAlign:"center"}}>
                <div ref={this.myRef} style={{display:"inline-block", width:"900px", height:"650px"}}>

                </div>
                <div style={{display:"inline-block", 
                border:"1px solid rgb(214,214,214)",
                background:"rgb(245,245,245)",
                marginLeft:"auto",
                width:"600px",
                height:"650px",
                verticalAlign:"top"}}>
                    <div style={{display:"inline-block",verticalAlign:"top"}}>Room Code: {this.state.roomCode}</div>
                    <div ref = {this.msgDiv}style={{height:"525px", overflow:"auto", overflowWrap:"break-word",padding:"5px",paddingBottom:"150px"}}>{messages}</div>
                    <div style={{height:"120px",borderTop: "1px solid rgb(214, 214, 214)",padding:"5px"}}>
                        {/* <input onChange={this.setUserName}></input> */}
                        <textarea ref={this.textArea} className={"textArea"} onKeyDown={this.sendMessage}></textarea>
                        <Button style={{height:"30px",border:"none", background:"none",fontSize:"25px", display:"inline-block",verticalAlign:"bottom"}} onClick={this.sendMessage}>
                            <AiOutlineSend style={{color:"rgb(100,100,100)",position:"relative",top:"-6px", background:"none"}}></AiOutlineSend>
                        </Button>
                    </div>
                </div>
                </div>
            </div>
        )
    }
}
export default Room