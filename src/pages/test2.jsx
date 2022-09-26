import { Component } from "react";
import { Button } from "react-bootstrap";
import io from 'socket.io-client';
import axios from "axios";

const socket = io.connect("http://localhost:8000")

class Test2 extends Component {
    state = {
        user:"",
        msg:"",
        messages:[]
    }
    setMessage = (event) =>{
        this.setState({msg:event.target.value});
    }
    setUserName = (event) =>{
        this.setState({user:event.target.value});
    }
    sendMessage = ()=>{
        socket.emit('new message',{roomNum:this.state.roomNum,user:this.state.user,msg:this.state.msg})
    }

    componentDidMount(){
        socket.on("recieveMessage",(msg)=>{
            // alert(msg);
            console.log(msg);
            this.setState({messages:this.state.messages.concat(msg)})
            console.log(msg);
        })
        axios.get(`http://localhost:8000${window.location.pathname+window.location.search+window.location.hash}`).then((res)=>{
            this.setState({roomNum:res.data.num},()=>{
                socket.emit("joinRoom",{roomNum:this.state.roomNum})
            })
        })
    }
    render(){
        const messages = this.state.messages.map((msg)=>
        <div>
            <div>
                Name:{msg.user} IP:{msg.ip}
            </div>
            <div>
                {msg.msg}
            </div>
        </div>)
        return(
            <div>
                <div>这里是房间测试页面</div>
                <div>房间号：{this.state.roomNum}</div>
                <input onChange={this.setUserName}></input>
                <input onChange={this.setMessage}></input>
                <Button onClick={this.sendMessage}>
                    发送
                </Button>
                {messages}
            </div>
        )
    }
}
export default Test2