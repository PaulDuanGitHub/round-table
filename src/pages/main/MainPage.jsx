import { Component} from "react";
import { Button } from "react-bootstrap";
import CreateRoom from "../../components/create/CreateRoom";
import JoinRoom from "../../components/join/JoinRoom";
import "./MainPage.css";

class MainPage extends Component {
    constructor(props) {
        super(props);
        this.state ={
            showJoinDialog: false,
            showCreateDialog: false
        }
    }
    showCreateDialog = () =>{
        this.setState({showCreateDialog:true})
    }
    hideCreateDialog = () =>{
        this.setState({showCreateDialog:false})
    }
    showJoinDialog = () =>{
        this.setState({showJoinDialog:true})
    }
    hideJoinDialog = () =>{
        this.setState({showJoinDialog:false})
    }
    componentDidMount(){
    }
    render(){
        return(
            <div>
                <CreateRoom showCreateDialog={this.state.showCreateDialog} closeDialog={this.hideCreateDialog}></CreateRoom>
                <JoinRoom showJoinDialog={this.state.showJoinDialog} closeDialog={this.hideJoinDialog}></JoinRoom>
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
export default MainPage