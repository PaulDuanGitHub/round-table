import { Component } from "react";
import { Button } from "react-bootstrap";
import io from 'socket.io-client';

const socket = io.connect("http://localhost:8000")

class Test extends Component {
    state = {
        roomNum:""
    }
    createRoom = ()=>{
        function createHash (hashLength) {
            // 默认长度 24
            return Array.from(Array(Number(hashLength) || 24), () => Math.floor(Math.random() * 36).toString(36)).join('');
        }
        var n = createHash()
        this.setState({roomNum:n});
        window.location.href=`/test2/?num=${n}`;
        // axios.get(`http://localhost:8000/test2?num=${n}`).then((res)=>{
        //     console.log(res);
        // })
    }
    roomNumInput = (event) => {
        this.setState({roomNumInput:event.target.value})
    }
    joinRoom = () => {
        window.location.href=`/test2/?num=${this.state.roomNumInput}`
    }
    componentDidMount(){
    }
    render(){
        return(
            <div>
                <div>房间号：{this.state.roomNum}</div>
                <input onChange={this.roomNumInput}></input>
                <Button onClick={this.joinRoom}>加入房间</Button>
                <div></div>
                <Button onClick={this.createRoom}>创建房间</Button>
            </div>
        )
    }
}
export default Test